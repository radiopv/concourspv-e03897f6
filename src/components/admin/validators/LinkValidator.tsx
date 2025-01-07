import { checkUrl } from "../ContentValidator";

interface LinkValidationResult {
  url: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const validateLinks = async (urls: { url: string, details?: string }[]): Promise<LinkValidationResult[]> => {
  const results: LinkValidationResult[] = [];
  
  for (const { url, details } of urls) {
    try {
      const { isValid, error } = await checkUrl(url);
      
      if (isValid) {
        results.push({
          url,
          status: 'success',
          message: "Lien accessible",
          details
        });
      } else {
        results.push({
          url,
          status: 'warning',
          message: `Lien potentiellement inaccessible (${error || 'raison inconnue'})`,
          details
        });
      }
    } catch (error) {
      results.push({
        url,
        status: 'error',
        message: "Erreur lors de la vérification du lien",
        details
      });
    }
  }
  
  return results;
};