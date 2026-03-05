import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service.js';
import { NovaService } from '../nova/nova.service.js';

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

@Injectable()
export class SearchService {
  constructor(
    private readonly dynamo: DynamoService,
    private readonly nova: NovaService,
  ) {}

  /** NL search: Nova 2 Lite ranks items by relevance to user query */
  async searchNL(query: string, filters?: { placeId?: string; category?: string }) {
    let items = await this.dynamo.scan(process.env.DYNAMODB_ITEMS_TABLE!);

    if (filters?.placeId) items = items.filter((i) => i.placeId === filters.placeId);
    if (filters?.category) items = items.filter((i) => i.category === filters.category);

    const summary = JSON.stringify(
      items.map((i) => ({
        id: i.id, name: i.name, brand: i.brandName,
        cat: i.category, tags: i.tags, loc: i.placeName, status: i.status,
      })),
    );

    const rankedIds = await this.nova.searchItemsNL(query, summary);
    const itemMap = new Map(items.map((i) => [i.id, i]));
    return rankedIds.map((id) => itemMap.get(id)).filter(Boolean);
  }

  /** Semantic search: cosine similarity over Nova Embeddings vectors */
  async semanticSearch(query: string, topK = 10) {
    const queryEmbedding = await this.nova.generateEmbedding(query);
    const items = await this.dynamo.scan(process.env.DYNAMODB_ITEMS_TABLE!);

    return items
      .filter((item) => item.embedding)
      .map((item) => ({ ...item, score: cosineSimilarity(queryEmbedding, item.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /** Voice search: audio buffer -> transcript -> NL search */
  async voiceSearch(audioBase64: string) {
    // Transcribe via Nova Pro multimodal (audio content block)
    const transcript = await this.transcribe(audioBase64);
    const results = await this.searchNL(transcript);
    return { transcript, results };
  }

  private async transcribe(audioBase64: string): Promise<string> {
    // Use Nova Pro's multimodal capability for audio
    const { BedrockRuntimeClient, InvokeModelCommand } = await import(
      '@aws-sdk/client-bedrock-runtime'
    );
    const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

    const payload = {
      messages: [
        {
          role: 'user',
          content: [
            { video: { format: 'mp4', source: { bytes: audioBase64 } } },
            {
              text: 'Transcribe this audio recording of a user searching a university inventory. Return only the transcribed text.',
            },
          ],
        },
      ],
      inferenceConfig: { maxTokens: 100, temperature: 0 },
    };

    const command = new InvokeModelCommand({
      modelId: process.env.NOVA_VISION_MODEL,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await client.send(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.output?.message?.content?.[0]?.text ?? '';
  }
}
