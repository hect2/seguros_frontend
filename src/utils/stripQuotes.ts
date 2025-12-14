export const stripQuotes = (value: any) => {
  if (typeof value === "string") {
    return value.replace(/^"(.*)"$/, "$1");
  }
  return value;
};
