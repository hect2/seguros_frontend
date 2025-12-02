export function generateUniqueColor(existing: string[]) {
  let color;
  do {
    color = "#" + Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  } while (existing.includes(color));

  existing.push(color);
  return color;
}