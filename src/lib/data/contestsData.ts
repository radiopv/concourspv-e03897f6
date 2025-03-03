
/**
 * Service de gestion des concours
 */
import { v4 as uuidv4 } from 'uuid';
import { Contest, ContestStatus, ContestStatusUpdate } from '@/types/contest';
import { contests, participants, questions, prizes, prizeCatalog, saveData } from './storage';

/**
 * Récupère les concours actifs avec leurs données associées
 */
export const getActive = async () => {
  console.log('Fetching active contests...');
  
  const activeContests = contests.filter(c => c.status === 'active');
  
  // Traitement des concours pour inclure les données supplémentaires
  const processedContests = await Promise.all(activeContests.map(async contest => {
    // Obtenir les participants pour ce concours
    const contestParticipants = participants.filter(p => p.contest_id === contest.id);
    
    // Calculer les statistiques
    const validParticipants = contestParticipants.filter(p => 
      p.status === 'completed' && 
      typeof p.score === 'number' && 
      p.score > 0
    );
    
    const eligibleParticipants = validParticipants.filter(p => p.score >= 80);
    
    const totalScore = validParticipants.reduce((acc, p) => acc + (p.score || 0), 0);
    const averageScore = validParticipants.length > 0
      ? Math.round(totalScore / validParticipants.length)
      : 0;
    
    // Obtenir les prix pour ce concours
    const contestPrizes = prizes.filter(p => p.contest_id === contest.id).map(prize => {
      const catalogItem = prizeCatalog.find(pc => pc.id === prize.prize_catalog_id);
      return {
        id: prize.id,
        name: catalogItem?.name || '',
        description: catalogItem?.description || '',
        image_url: catalogItem?.image_url || '',
        shop_url: catalogItem?.shop_url || '',
        value: catalogItem?.value || 0
      };
    });
    
    return {
      ...contest,
      participants: { count: validParticipants.length },
      questions: { count: questions.filter(q => q.contest_id === contest.id).length },
      stats: {
        totalParticipants: validParticipants.length,
        eligibleParticipants: eligibleParticipants.length,
        averageScore
      },
      prizes: contestPrizes
    } as Contest;
  }));
  
  console.log('Processed contests:', processedContests);
  return processedContests;
};

/**
 * Récupère tous les concours pour l'administration
 */
export const getAllContests = async () => {
  console.log('Fetching ALL contests for admin...');
  
  // Traiter tous les concours pour inclure les données supplémentaires
  const processedContests = await Promise.all(contests.map(async contest => {
    // Obtenir les participants pour ce concours
    const contestParticipants = participants.filter(p => p.contest_id === contest.id);
    
    // Calculer les statistiques
    const validParticipants = contestParticipants.filter(p => 
      p.status === 'completed' && 
      typeof p.score === 'number' && 
      p.score > 0
    );
    
    const eligibleParticipants = validParticipants.filter(p => p.score >= 80);
    
    const totalScore = validParticipants.reduce((acc, p) => acc + (p.score || 0), 0);
    const averageScore = validParticipants.length > 0
      ? Math.round(totalScore / validParticipants.length)
      : 0;
    
    // Obtenir les prix pour ce concours
    const contestPrizes = prizes.filter(p => p.contest_id === contest.id).map(prize => {
      const catalogItem = prizeCatalog.find(pc => pc.id === prize.prize_catalog_id);
      return {
        id: prize.id,
        name: catalogItem?.name || '',
        description: catalogItem?.description || '',
        image_url: catalogItem?.image_url || '',
        shop_url: catalogItem?.shop_url || '',
        value: catalogItem?.value || 0
      };
    });
    
    return {
      ...contest,
      participants: { count: validParticipants.length },
      questions: { count: questions.filter(q => q.contest_id === contest.id).length },
      stats: {
        totalParticipants: validParticipants.length,
        eligibleParticipants: eligibleParticipants.length,
        averageScore
      },
      prizes: contestPrizes,
      status: contest.status as ContestStatus
    } as Contest;
  }));
  
  console.log('All contests for admin:', processedContests);
  return processedContests;
};

/**
 * Récupère un concours par son ID
 */
export const getById = async (id: string) => {
  const contest = contests.find(c => c.id === id);
  if (!contest) return null;
  
  const contestPrizes = prizes.filter(p => p.contest_id === id).map(prize => {
    const catalogItem = prizeCatalog.find(pc => pc.id === prize.prize_catalog_id);
    return {
      id: prize.id,
      name: catalogItem?.name || '',
      description: catalogItem?.description || '',
      image_url: catalogItem?.image_url || '',
      shop_url: catalogItem?.shop_url || '',
      value: catalogItem?.value || 0
    };
  });
  
  return {
    ...contest,
    prizes: contestPrizes
  };
};

/**
 * Met à jour un concours
 */
export const update = async (id: string, updates: ContestStatusUpdate) => {
  const index = contests.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Contest not found');
  
  contests[index] = { ...contests[index], ...updates };
  saveData('contests', contests);
  
  return contests[index];
};

/**
 * Crée un nouveau concours
 */
export const create = async (contestData: Partial<Contest>) => {
  // Créer un nouveau concours avec la gestion appropriée des types
  const newContest = {
    id: uuidv4(),
    title: contestData.title || '',
    description: contestData.description || '', 
    status: contestData.status || 'draft' as ContestStatus,
    start_date: contestData.start_date || new Date().toISOString(),
    end_date: contestData.end_date || new Date().toISOString(),
    draw_date: contestData.draw_date || new Date().toISOString(),
    is_featured: contestData.is_featured || false,
    is_new: contestData.is_new || true,
    has_big_prizes: contestData.has_big_prizes || false,
    is_exclusive: contestData.is_exclusive || false,
    is_limited: contestData.is_limited || false,
    is_vip: contestData.is_vip || false,
    is_rank_restricted: contestData.is_rank_restricted || false,
    min_rank: contestData.min_rank || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Cast en 'any' pour éviter les problèmes de type TypeScript
  contests.push(newContest as any);
  saveData('contests', contests);
  
  return newContest;
};

/**
 * Supprime un concours
 */
export const deleteContest = async (id: string) => {
  // Vérifier si l'ID existe avant de supprimer
  const contestIndex = contests.findIndex(c => c.id === id);
  
  if (contestIndex === -1) {
    console.error(`Contest with ID ${id} not found for deletion`);
    throw new Error('Contest not found');
  }
  
  console.log(`Deleting contest with ID: ${id}`);
  
  // Supprimer le concours du tableau
  const newContests = contests.filter(c => c.id !== id);
  
  // Supprimer également les données associées (participants, questions, prix)
  const newParticipants = participants.filter(p => p.contest_id !== id);
  const newQuestions = questions.filter(q => q.contest_id !== id);
  const newPrizes = prizes.filter(p => p.contest_id !== id);
  
  // Mettre à jour les tableaux
  contests.length = 0;
  contests.push(...newContests);
  
  participants.length = 0;
  participants.push(...newParticipants);
  
  questions.length = 0;
  questions.push(...newQuestions);
  
  prizes.length = 0;
  prizes.push(...newPrizes);
  
  // Sauvegarder les tableaux mis à jour
  saveData('contests', contests);
  saveData('participants', participants);
  saveData('questions', questions);
  saveData('prizes', prizes);
  
  console.log(`Contest with ID ${id} deleted. Contests remaining: ${contests.length}`);
  
  return true;
};

/**
 * Archive un concours
 */
export const archive = async (id: string) => {
  const index = contests.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Contest not found');
  
  contests[index].status = 'archived' as ContestStatus;
  saveData('contests', contests);
  
  return contests[index];
};
