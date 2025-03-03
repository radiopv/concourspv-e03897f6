
/**
 * Service de gestion des prix
 */
import { v4 as uuidv4 } from 'uuid';
import { prizes, prizeCatalog, saveData } from './storage';

/**
 * Récupère les prix d'un concours
 */
export const getByContestId = async (contestId: string) => {
  return prizes
    .filter(p => p.contest_id === contestId)
    .map(prize => {
      const catalogItem = prizeCatalog.find(pc => pc.id === prize.prize_catalog_id);
      return {
        id: prize.id,
        name: catalogItem?.name || '',
        description: catalogItem?.description || '',
        image_url: catalogItem?.image_url || '',
        shop_url: catalogItem?.shop_url || '',
        value: catalogItem?.value || 0,
        prize_catalog_id: prize.prize_catalog_id,
        contest_id: prize.contest_id
      };
    });
};

/**
 * Crée un nouveau prix
 */
export const create = async (prizeData: any) => {
  const newPrize = {
    id: uuidv4(),
    ...prizeData,
    created_at: new Date().toISOString()
  };
  
  prizes.push(newPrize);
  saveData('prizes', prizes);
  
  return newPrize;
};

/**
 * Supprime un prix
 */
export const deletePrize = async (id: string) => {
  const newPrizes = prizes.filter(p => p.id !== id);
  prizes.length = 0;
  prizes.push(...newPrizes);
  saveData('prizes', prizes);
  return true;
};
