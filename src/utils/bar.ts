export function progressBar(current: number, max: number, size = 16) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(Math.max(current / safeMax, 0), 1);

  const filled = Math.round(ratio * size);
  const empty = size - filled;

  return "█".repeat(filled) + "░".repeat(empty);
}
