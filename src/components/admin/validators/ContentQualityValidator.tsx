interface ContentQualityResult {
  type: 'content';
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const validateContentQuality = (
  content: { title?: string; description?: string; id: string }
): ContentQualityResult[] => {
  const results: ContentQualityResult[] = [];

  if (!content.title || content.title.length < 5) {
    results.push({
      type: 'content',
      status: 'warning',
      message: "Titre trop court",
      details: `ID: ${content.id}`
    });
  }

  if (!content.description || content.description.length < 50) {
    results.push({
      type: 'content',
      status: 'warning',
      message: "Description insuffisante",
      details: `ID: ${content.id}`
    });
  }

  return results;
};