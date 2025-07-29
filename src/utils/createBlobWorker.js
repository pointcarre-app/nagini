/**
 * Blob Worker Creation Utility
 * 
 * Creates web workers from blob URLs to handle cross-origin scenarios.
 * Essential for Flask apps and other frameworks where Nagini is served
 * from a different origin than the main application.
 */

/**
 * Create a blob worker URL from a bundled worker script
 * @param {string} workerUrl - URL to the bundled worker script (worker-dist.js)
 * @returns {Promise<string>} Blob URL that can be used to create a Worker
 * @throws {Error} If worker script cannot be fetched
 */
export async function createBlobWorkerUrl(workerUrl) {
  try {
    // Fetch the bundled worker script
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch worker script: HTTP ${response.status}`);
    }
    
    const workerScript = await response.text();
    
    // Create a blob URL for the worker script
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    
    console.log(`🐍 [BlobWorker] Created blob URL for worker: ${workerUrl}`);
    return blobUrl;
    
  } catch (error) {
    console.error('🐍 [BlobWorker] Failed to create blob worker:', error);
    throw new Error(`Failed to create blob worker from ${workerUrl}: ${error.message}`);
  }
}

/**
 * Create a Worker instance using blob URL pattern
 * @param {string} workerUrl - URL to the bundled worker script (worker-dist.js)
 * @returns {Promise<Worker>} Web Worker instance created from blob URL
 * @throws {Error} If worker creation fails
 */
export async function createBlobWorker(workerUrl) {
  try {
    // Ensure we're using the bundled worker
    if (!workerUrl.includes('worker-dist.js')) {
      console.warn('🐍 [BlobWorker] Warning: Expected bundled worker (worker-dist.js), got:', workerUrl);
    }
    
    const blobUrl = await createBlobWorkerUrl(workerUrl);
    const worker = new Worker(blobUrl);
    
    console.log(`🐍 [BlobWorker] Worker created successfully from blob URL`);
    return worker;
    
  } catch (error) {
    console.error('🐍 [BlobWorker] Worker creation failed:', error);
    throw error;
  }
}

/**
 * Cleanup blob URL to prevent memory leaks
 * @param {string} blobUrl - Blob URL to revoke
 */
export function revokeBlobUrl(blobUrl) {
  try {
    URL.revokeObjectURL(blobUrl);
    console.log(`🐍 [BlobWorker] Blob URL revoked: ${blobUrl.substring(0, 50)}...`);
  } catch (error) {
    console.warn('🐍 [BlobWorker] Failed to revoke blob URL:', error);
  }
} 