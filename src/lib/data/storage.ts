
/**
 * Utilitaires pour la gestion du stockage local des données avec cache avancé
 */

// Import des données initiales
import contestsData from '@/data/contests.json';
import participantsData from '@/data/participants.json';
import questionsData from '@/data/questions.json';
import prizesData from '@/data/prizes.json';
import prizeCatalogData from '@/data/prizeCatalog.json';

// État local des données
let contests = [...contestsData];
let participants = [...participantsData];
let questions = [...questionsData];
let prizes = [...prizesData];
let prizeCatalog = [...prizeCatalogData];

// Système de cache avancé
interface CacheItem<T> {
  data: T;
  timestamp: number;
  version: number;
}

interface Cache {
  contests: CacheItem<typeof contests>;
  participants: CacheItem<typeof participants>;
  questions: CacheItem<typeof questions>;
  prizes: CacheItem<typeof prizes>;
  prizeCatalog: CacheItem<typeof prizeCatalog>;
}

// Durée de validité du cache (en ms)
const CACHE_TTL = 60000; // 1 minute

// Initialiser le cache
let cache: Cache = {
  contests: { data: [], timestamp: 0, version: 0 },
  participants: { data: [], timestamp: 0, version: 0 },
  questions: { data: [], timestamp: 0, version: 0 },
  prizes: { data: [], timestamp: 0, version: 0 },
  prizeCatalog: { data: [], timestamp: 0, version: 0 }
};

/**
 * Sauvegarde les données dans le localStorage pour la persistance
 * et met à jour le cache avec la version la plus récente
 */
export const saveData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      // Mise à jour du cache
      if (key in cache) {
        const cacheKey = key as keyof Cache;
        cache[cacheKey] = {
          data: [...data],
          timestamp: Date.now(),
          version: cache[cacheKey].version + 1
        };
      }
      
      console.log(`Data saved: ${key}, cache updated to version ${cache[key as keyof Cache].version}`);
    } catch (error) {
      console.error(`Error saving data for ${key}:`, error);
    }
  }
};

/**
 * Vérifie si le cache est valide pour une clé donnée
 */
const isCacheValid = (key: keyof Cache): boolean => {
  const cacheItem = cache[key];
  const now = Date.now();
  return cacheItem.data.length > 0 && (now - cacheItem.timestamp) < CACHE_TTL;
};

/**
 * Charge les données depuis le localStorage ou utilise le cache si valide
 */
export const loadData = () => {
  if (typeof window !== 'undefined') {
    try {
      // Utiliser le cache si possible
      if (!isCacheValid('contests')) {
        const storedContests = localStorage.getItem('contests');
        if (storedContests) {
          contests = JSON.parse(storedContests);
          cache.contests = { data: [...contests], timestamp: Date.now(), version: cache.contests.version + 1 };
        }
      } else {
        console.log('Using cached contests data');
      }

      if (!isCacheValid('participants')) {
        const storedParticipants = localStorage.getItem('participants');
        if (storedParticipants) {
          participants = JSON.parse(storedParticipants);
          cache.participants = { data: [...participants], timestamp: Date.now(), version: cache.participants.version + 1 };
        }
      } else {
        console.log('Using cached participants data');
      }

      if (!isCacheValid('questions')) {
        const storedQuestions = localStorage.getItem('questions');
        if (storedQuestions) {
          questions = JSON.parse(storedQuestions);
          cache.questions = { data: [...questions], timestamp: Date.now(), version: cache.questions.version + 1 };
        }
      } else {
        console.log('Using cached questions data');
      }

      if (!isCacheValid('prizes')) {
        const storedPrizes = localStorage.getItem('prizes');
        if (storedPrizes) {
          prizes = JSON.parse(storedPrizes);
          cache.prizes = { data: [...prizes], timestamp: Date.now(), version: cache.prizes.version + 1 };
        }
      } else {
        console.log('Using cached prizes data');
      }

      if (!isCacheValid('prizeCatalog')) {
        const storedPrizeCatalog = localStorage.getItem('prizeCatalog');
        if (storedPrizeCatalog) {
          prizeCatalog = JSON.parse(storedPrizeCatalog);
          cache.prizeCatalog = { data: [...prizeCatalog], timestamp: Date.now(), version: cache.prizeCatalog.version + 1 };
        }
      } else {
        console.log('Using cached prize catalog data');
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }
};

/**
 * Invalide le cache pour une clé spécifique
 */
export const invalidateCache = (key: keyof Cache) => {
  cache[key].timestamp = 0;
  console.log(`Cache invalidated for ${key}`);
};

/**
 * Obtient les données avec gestion du cache
 */
export const getData = <T>(key: keyof Cache): T => {
  if (!isCacheValid(key)) {
    loadData(); // Recharger les données uniquement si nécessaire
  }
  return cache[key].data as unknown as T;
};

// Initialiser les données
loadData();

// Exporter les données et les fonctions de manipulation
export { 
  contests, 
  participants, 
  questions, 
  prizes, 
  prizeCatalog,
  invalidateCache,
  getData
};

// Log pour le débogage
console.log('Data system initialized with cache management:', { 
  contests: contests.length,
  participants: participants.length,
  questions: questions.length,
  prizes: prizes.length,
  prizeCatalog: prizeCatalog.length
});
