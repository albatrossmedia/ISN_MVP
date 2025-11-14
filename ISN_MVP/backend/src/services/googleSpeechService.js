// Google/Vertex adapter stub
export async function transcribeWithGoogle({ url, language }) {
  // Call @google-cloud/speech here. For now return a fixed structure.
  return { text: 'transcript from google (stub)', confidence: 0.89, latency_ms: 520 };
}