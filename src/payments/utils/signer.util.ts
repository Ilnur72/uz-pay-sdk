export function generateBasicAuthHeader(
  merchantId: string,
  key: string,
): string {
  const token = Buffer.from(`${merchantId}:${key}`).toString('base64');
  return `Basic ${token}`;
}
