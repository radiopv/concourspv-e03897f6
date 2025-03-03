
/**
 * Point d'entrée pour les services de données
 */
import * as contestsService from './contestsData';
import * as questionsService from './questionsData';
import * as participantsService from './participantsData';
import * as prizesService from './prizesData';
import * as prizeCatalogService from './prizeCatalogData';

export const localData = {
  contests: {
    getActive: contestsService.getActive,
    getAllContests: contestsService.getAllContests,
    getById: contestsService.getById,
    update: contestsService.update,
    create: contestsService.create,
    delete: contestsService.deleteContest,
    archive: contestsService.archive
  },
  
  questions: {
    getByContestId: questionsService.getByContestId,
    create: questionsService.create,
    update: questionsService.update,
    delete: questionsService.deleteQuestion
  },
  
  participants: {
    getByContestId: participantsService.getByContestId,
    create: participantsService.create,
    update: participantsService.update,
    delete: participantsService.deleteParticipant
  },
  
  prizes: {
    getByContestId: prizesService.getByContestId,
    create: prizesService.create,
    delete: prizesService.deletePrize
  },
  
  prizeCatalog: {
    getAll: prizeCatalogService.getAll,
    create: prizeCatalogService.create,
    update: prizeCatalogService.update,
    delete: prizeCatalogService.deleteCatalogItem
  }
};
