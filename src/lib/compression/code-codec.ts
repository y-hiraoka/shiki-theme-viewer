/**
 * Compresses a string using gzip and encodes it as URL-safe base64.
 * @param code - The string to compress
 * @returns URL-safe base64 encoded gzip compressed string
 */
export async function compressCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);

  const body = new Response(data).body;
  if (!body) throw new Error("Failed to create response body for compression");

  const compressedStream = body.pipeThrough(new CompressionStream("gzip"));
  const compressedData = await new Response(compressedStream).arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedData)));

  // Make URL-safe: replace + with -, / with _, and remove trailing =
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decompresses a URL-safe base64 encoded gzip string.
 * @param compressed - The compressed string to decompress
 * @returns The original decompressed string
 */
export async function decompressCode(compressed: string): Promise<string> {
  // Restore standard base64 from URL-safe format
  let base64 = compressed.replace(/-/g, "+").replace(/_/g, "/");

  // Add back padding
  while (base64.length % 4) {
    base64 += "=";
  }

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const body = new Response(bytes).body;
  if (!body)
    throw new Error("Failed to create response body for decompression");

  const decompressedStream = body.pipeThrough(new DecompressionStream("gzip"));

  return new Response(decompressedStream).text();
}
