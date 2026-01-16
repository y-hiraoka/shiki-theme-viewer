/**
 * Compresses a string using gzip and encodes it as URL-safe base64.
 * @param code - The string to compress
 * @returns URL-safe base64 encoded gzip compressed string
 */
export async function compressCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);

  const compressedStream = new Response(data).body!.pipeThrough(
    new CompressionStream("gzip")
  );

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

  const decompressedStream = new Response(bytes).body!.pipeThrough(
    new DecompressionStream("gzip")
  );

  return new Response(decompressedStream).text();
}

// Cache for compression promises to avoid redundant compression
const compressionCache = new Map<string, Promise<string>>();

/**
 * Compresses code with caching to avoid redundant compression.
 * @param code - The string to compress
 * @returns URL-safe base64 encoded gzip compressed string
 */
export function compressCodeCached(code: string): Promise<string> {
  const cached = compressionCache.get(code);
  if (cached) {
    return cached;
  }

  const promise = compressCode(code);
  compressionCache.set(code, promise);

  // Limit cache size
  if (compressionCache.size > 100) {
    const firstKey = compressionCache.keys().next().value;
    if (firstKey !== undefined) {
      compressionCache.delete(firstKey);
    }
  }

  return promise;
}

// Cache for decompression promises
const decompressionCache = new Map<string, Promise<string>>();

/**
 * Decompresses code with caching to avoid redundant decompression.
 * @param compressed - The compressed string to decompress
 * @returns The original decompressed string
 */
export function decompressCodeCached(compressed: string): Promise<string> {
  const cached = decompressionCache.get(compressed);
  if (cached) {
    return cached;
  }

  const promise = decompressCode(compressed);
  decompressionCache.set(compressed, promise);

  // Limit cache size
  if (decompressionCache.size > 100) {
    const firstKey = decompressionCache.keys().next().value;
    if (firstKey !== undefined) {
      decompressionCache.delete(firstKey);
    }
  }

  return promise;
}
