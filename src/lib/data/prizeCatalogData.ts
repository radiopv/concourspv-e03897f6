
/**
 * Service de gestion du catalogue de prix
 */
import { v4 as uuidv4 } from 'uuid';
import { prizeCatalog, saveData } from './storage';

/**
 * Récupère tous les éléments du catalogue de prix
 */
export const getAll = async () => {
  return prizeCatalog;
};

/**
 * Crée un nouvel élément du catalogue
 */
export const create = async (catalogItemData: any) => {
  const newCatalogItem = {
    id: uuidv4(),
    ...catalogItemData,
    created_at: new Date().toISOString()
  };
  
  prizeCatalog.push(newCatalogItem);
  saveData('prizeCatalog', prizeCatalog);
  
  return newCatalogItem;
};

/**
 * Met à jour un élément du catalogue
 */
export const update = async (id: string, catalogItemData: any) => {
  const index = prizeCatalog.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Catalog item not found');
  
  prizeCatalog[index] = { ...prizeCatalog[index], ...catalogItemData };
  saveData('prizeCatalog', prizeCatalog);
  
  return prizeCatalog[index];
};

/**
 * Supprime un élément du catalogue
 */
export const deleteCatalogItem = async (id: string) => {
  const newPrizeCatalog = prizeCatalog.filter(p => p.id !== id);
  prizeCatalog.length = 0;
  prizeCatalog.push(...newPrizeCatalog);
  saveData('prizeCatalog', prizeCatalog);
  return true;
};
