export function extractLearningRequestTitle(request) {
  const requestBody = request?.topics_needed_help_with;

  if (typeof requestBody === "string") {
    const titleMatch = requestBody.match(/^\s*Title:\s*(.+)\s*$/im);

    if (titleMatch?.[1]) {
      return titleMatch[1].trim();
    }
  }

  return "";
}
