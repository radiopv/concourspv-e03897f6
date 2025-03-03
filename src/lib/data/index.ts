
/**
 * Point d'entrée pour les services de données avec optimisation des performances
 * et gestion avancée du cache
 */
import * as contestsService from './contestsData';
import * as questionsService from './questionsData';
import * as participantsService from './participantsData';
import * as prizesService from './prizesData';
import * as prizeCatalogService from './prizeCatalogData';
import { invalidateCache } from './storage';

// Mémorisation des derniers résultats pour éviter les calculs redondants
const memoizedResults = new Map<string, {data: any, timestamp: number}>();
const MEMO_TTL = 30000; // 30 secondes de validité pour les résultats mémorisés

// Fonction pour mémoriser les résultats des requêtes coûteuses
const memoize = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  const cached = memoizedResults.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < MEMO_TTL) {
    console.log(`Using memoized result for ${key}`);
    return Promise.resolve(cached.data);
  }
  
  return fetcher().then(result => {
    memoizedResults.set(key, {data: result, timestamp: now});
    return result;
  });
};

// Fonction pour invalider un résultat mémorisé
const invalidateMemo = (keyPattern: string) => {
  for (const key of memoizedResults.keys()) {
    if (key.includes(keyPattern)) {
      memoizedResults.delete(key);
      console.log(`Memoized result invalidated: ${key}`);
    }
  }
};

export const localData = {
  contests: {
    getActive: (options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo('contests.getActive');
        invalidateCache('contests');
      }
      return memoize('contests.getActive', contestsService.getActive);
    },
    getAllContests: (options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo('contests.getAllContests');
        invalidateCache('contests');
      }
      return memoize('contests.getAllContests', contestsService.getAllContests);
    },
    getById: (id: string) => memoize(`contests.getById.${id}`, () => contestsService.getById(id)),
    update: (id: string, data: any) => {
      invalidateMemo('contests');
      invalidateCache('contests');
      return contestsService.update(id, data);
    },
    create: (data: any) => {
      invalidateMemo('contests');
      invalidateCache('contests');
      return contestsService.create(data);
    },
    delete: (id: string) => {
      invalidateMemo('contests');
      invalidateCache('contests');
      return contestsService.deleteContest(id);
    },
    archive: (id: string) => {
      invalidateMemo('contests');
      invalidateCache('contests');
      return contestsService.archive(id);
    }
  },
  
  questions: {
    getByContestId: (contestId: string, options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo(`questions.getByContestId.${contestId}`);
        invalidateCache('questions');
      }
      return memoize(`questions.getByContestId.${contestId}`, () => questionsService.getByContestId(contestId));
    },
    create: (data: any) => {
      invalidateMemo('questions');
      invalidateCache('questions');
      return questionsService.create(data);
    },
    update: (id: string, data: any) => {
      invalidateMemo('questions');
      invalidateCache('questions');
      return questionsService.update(id, data);
    },
    delete: (id: string) => {
      invalidateMemo('questions');
      invalidateCache('questions');
      return questionsService.deleteQuestion(id);
    }
  },
  
  participants: {
    getByContestId: (contestId: string, options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo(`participants.getByContestId.${contestId}`);
        invalidateCache('participants');
      }
      return memoize(`participants.getByContestId.${contestId}`, () => participantsService.getByContestId(contestId));
    },
    create: (data: any) => {
      invalidateMemo('participants');
      invalidateCache('participants');
      return participantsService.create(data);
    },
    update: (id: string, data: any) => {
      invalidateMemo('participants');
      invalidateCache('participants');
      return participantsService.update(id, data);
    },
    delete: (id: string) => {
      invalidateMemo('participants');
      invalidateCache('participants');
      return participantsService.deleteParticipant(id);
    }
  },
  
  prizes: {
    getByContestId: (contestId: string, options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo(`prizes.getByContestId.${contestId}`);
        invalidateCache('prizes');
      }
      return memoize(`prizes.getByContestId.${contestId}`, () => prizesService.getByContestId(contestId));
    },
    create: (data: any) => {
      invalidateMemo('prizes');
      invalidateCache('prizes');
      return prizesService.create(data);
    },
    delete: (id: string) => {
      invalidateMemo('prizes');
      invalidateCache('prizes');
      return prizesService.deletePrize(id);
    }
  },
  
  prizeCatalog: {
    getAll: (options?: {forceRefresh?: boolean}) => {
      if (options?.forceRefresh) {
        invalidateMemo('prizeCatalog.getAll');
        invalidateCache('prizeCatalog');
      }
      return memoize('prizeCatalog.getAll', prizeCatalogService.getAll);
    },
    create: (data: any) => {
      invalidateMemo('prizeCatalog');
      invalidateCache('prizeCatalog');
      return prizeCatalogService.create(data);
    },
    update: (id: string, data: any) => {
      invalidateMemo('prizeCatalog');
      invalidateCache('prizeCatalog');
      return prizeCatalogService.update(id, data);
    },
    delete: (id: string) => {
      invalidateMemo('prizeCatalog');
      invalidateCache('prizeCatalog');
      return prizeCatalogService.deleteCatalogItem(id);
    }
  }
};

// Méthode de purge du cache pour les tests ou le développement
export const purgeCache = () => {
  memoizedResults.clear();
  console.log('Memoized results cache purged');
  ['contests', 'participants', 'questions', 'prizes', 'prizeCatalog'].forEach(key => {
    invalidateCache(key as keyof typeof invalidateCache);
  });
};
