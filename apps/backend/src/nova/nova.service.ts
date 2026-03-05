import { Injectable, Logger } from '@nestjs/common';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

@Injectable()
export class NovaService {
  private readonly logger = new Logger(NovaService.name);
  private readonly client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
  }

  /** Invoke Bedrock with exponential backoff on throttling */
  private async invokeWithRetry(command: InvokeModelCommand, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.client.send(command);
      } catch (err: any) {
        if (err.name === 'ThrottlingException' && attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          continue;
        }
        throw err;
      }
    }
    throw new Error('Max retries exceeded');
  }

  /** Strip markdown code fences from Nova JSON responses */
  private cleanJson(text: string): string {
    return text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  }

  /**
   * Nova Pro Multimodal Vision: analyze item photo.
   * Returns structured item metadata from a base64 image.
   */
  async analyzeItemImage(imageBase64: string) {
    const prompt = `You are an inventory assistant for a university.
Analyze this image and return ONLY a JSON object with:
{
  "name": "specific item name",
  "brandName": "brand/manufacturer or empty string",
  "category": "one of: electronics|av_equipment|furniture|lab_equipment|tools|books|sporting|clothing|other",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.0 to 1.0,
  "description": "1-2 sentence description"
}
Be specific. If you see a Canon camera, say "Canon EOS Rebel T7 DSLR Camera", not just "camera".`;

    const payload = {
      messages: [
        {
          role: 'user',
          content: [
            { image: { format: 'jpeg', source: { bytes: imageBase64 } } },
            { text: prompt },
          ],
        },
      ],
      inferenceConfig: { maxTokens: 500, temperature: 0.1 },
    };

    const command = new InvokeModelCommand({
      modelId: process.env.NOVA_VISION_MODEL,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await this.invokeWithRetry(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    const text = body.output?.message?.content?.[0]?.text ?? '{}';
    return JSON.parse(this.cleanJson(text));
  }

  /**
   * Nova 2 Lite: natural language item search.
   * Ranks items by relevance to a user query.
   */
  async searchItemsNL(query: string, itemsSummary: string): Promise<string[]> {
    const prompt = `University inventory search.
User query: "${query}"

Item catalog (JSON):
${itemsSummary}

Return ONLY a JSON array of item IDs most relevant to the query, ordered by relevance. Max 10 results.
If no matches, return: []`;

    const payload = {
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 200, temperature: 0.2 },
    };

    const command = new InvokeModelCommand({
      modelId: process.env.NOVA_TEXT_MODEL,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await this.invokeWithRetry(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    const text = body.output?.message?.content?.[0]?.text ?? '[]';
    return JSON.parse(this.cleanJson(text));
  }

  /** Nova 2 Lite: generate personalized borrow reminder message */
  async generateReminderMessage(context: {
    borrowerName: string;
    itemName: string;
    daysOverdue: number;
  }): Promise<string> {
    const prompt = `Write a friendly but firm email reminder for a university inventory system.
Borrower: ${context.borrowerName}
Item: ${context.itemName}
Days overdue: ${context.daysOverdue}
Keep it under 100 words. Professional but warm tone.`;

    const payload = {
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 150, temperature: 0.7 },
    };

    const command = new InvokeModelCommand({
      modelId: process.env.NOVA_TEXT_MODEL,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await this.invokeWithRetry(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.output?.message?.content?.[0]?.text ?? '';
  }

  /** Nova Embeddings: generate 1024-dim vector for semantic search */
  async generateEmbedding(text: string): Promise<number[]> {
    const payload = {
      inputText: text,
      embeddingConfig: { outputEmbeddingLength: 1024 },
    };

    const command = new InvokeModelCommand({
      modelId: process.env.NOVA_EMBED_MODEL,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await this.invokeWithRetry(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.embedding;
  }
}
