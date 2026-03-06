// Mock Nova AI analysis responses for demo mode
// Cycles through realistic results to simulate vision AI

const MOCK_ANALYSES = [
  { name: 'Canon EOS Rebel T7 DSLR Camera', brandName: 'Canon', category: 'electronics', tags: ['camera', 'dslr', 'photography', 'canon'], confidence: 0.94, description: 'Digital SLR camera suitable for photography courses and event documentation' },
  { name: 'Dell XPS 15 Laptop', brandName: 'Dell', category: 'electronics', tags: ['laptop', 'computer', 'dell', 'portable'], confidence: 0.91, description: '15-inch professional laptop suitable for development and design work' },
  { name: 'Shure SM58 Dynamic Microphone', brandName: 'Shure', category: 'av_equipment', tags: ['microphone', 'audio', 'recording', 'shure'], confidence: 0.89, description: 'Professional dynamic microphone ideal for vocal recording and live presentations' },
  { name: 'Epson EB-X51 Projector', brandName: 'Epson', category: 'av_equipment', tags: ['projector', 'presentation', 'display', 'epson'], confidence: 0.92, description: 'XGA projector with 3,800 lumens suitable for classroom and conference use' },
  { name: 'Arduino Uno R3 Starter Kit', brandName: 'Arduino', category: 'lab_equipment', tags: ['arduino', 'microcontroller', 'electronics', 'prototyping'], confidence: 0.87, description: 'Microcontroller board kit for embedded systems courses and IoT projects' },
  { name: 'Logitech C920 Webcam', brandName: 'Logitech', category: 'electronics', tags: ['webcam', 'camera', 'video', 'streaming'], confidence: 0.93, description: 'Full HD 1080p webcam for video conferencing and content creation' },
];

let index = 0;

/** Returns a mock AI analysis with a realistic delay */
export async function getMockAnalysis(): Promise<typeof MOCK_ANALYSES[0]> {
  await new Promise((r) => setTimeout(r, 1800));
  const result = MOCK_ANALYSES[index % MOCK_ANALYSES.length];
  index++;
  return result;
}
