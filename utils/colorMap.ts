const categoryColorMap: Record<string, string> = {};

function generatePastelColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`;
}

export function getPastelColor(category: string): string {
  if (!categoryColorMap[category]) {
    categoryColorMap[category] = generatePastelColor(category);
  }
  return categoryColorMap[category];
}
