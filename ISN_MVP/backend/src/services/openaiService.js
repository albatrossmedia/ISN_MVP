// OpenAI Whisper adapter stub
export async function transcribeWithWhisper({ url, language }) {
  // Call OpenAI API here. For now return a fixed structure.
  return { text: 'transcript from whisper (stub)', confidence: 0.91, latency_ms: 420 };
}