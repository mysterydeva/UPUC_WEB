/**
 * Mock barcode generation for thermal labels.
 * In a real app, this would use a library like 'jsbarcode'.
 */
export function generateBarcodeDataUrl(value: string) {
    // Simple SVG barcode representation
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
      <rect width="200" height="80" fill="white"/>
      <g transform="translate(10, 10)">
        ${Array.from({ length: 40 }).map((_, i) => `
          <rect x="${i * 4.5}" y="0" width="${Math.random() > 0.5 ? 2 : 1}" height="40" fill="black"/>
        `).join('')}
      </g>
      <text x="100" y="70" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">${value}</text>
    </svg>
  `;

    const base64 = typeof btoa !== 'undefined' ? btoa(svg) : Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}
