export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delayMs: number }
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (options.retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, options.delayMs));
    return retry(fn, { ...options, retries: options.retries - 1 });
  }
} 