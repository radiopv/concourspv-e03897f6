
// This file replaces Supabase with local JSON-based data management

import contestsData from '@/data/contests.json';
import participantsData from '@/data/participants.json';
import questionsData from '@/data/questions.json';
import prizesData from '@/data/prizes.json';
import prizeCatalogData from '@/data/prizeCatalog.json';
import { Contest, ContestStatus, ContestStatusUpdate } from '@/types/contest';
import { Prize } from '@/types/prize';
import { Participant } from '@/types/participant';
import { v4 as uuidv4 } from 'uuid';

// Local data store
let contests = [...contestsData];
let participants = [...participantsData];
let questions = [...questionsData];
let prizes = [...prizesData];
let prizeCatalog = [...prizeCatalogData];

// Helper function to save data to localStorage for persistence
const saveData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Helper function to load data from localStorage
const loadData = () => {
  if (typeof window !== 'undefined') {
    const storedContests = localStorage.getItem('contests');
    const storedParticipants = localStorage.getItem('participants');
    const storedQuestions = localStorage.getItem('questions');
    const storedPrizes = localStorage.getItem('prizes');
    const storedPrizeCatalog = localStorage.getItem('prizeCatalog');

    contests = storedContests ? JSON.parse(storedContests) : contests;
    participants = storedParticipants ? JSON.parse(storedParticipants) : participants;
    questions = storedQuestions ? JSON.parse(storedQuestions) : questions;
    prizes = storedPrizes ? JSON.parse(storedPrizes) : prizes;
    prizeCatalog = storedPrizeCatalog ? JSON.parse(storedPrizeCatalog) : prizeCatalog;
  }
};

// Initialize data from localStorage if available
loadData();

// Log initial state for debugging
console.log('Initial data loaded:', { 
  contests: contests.length,
  participants: participants.length,
  questions: questions.length,
  prizes: prizes.length,
  prizeCatalog: prizeCatalog.length
});

export const localData = {
  // Contest operations
  contests: {
    getActive: async () => {
      console.log('Fetching active contests...');
      
      const activeContests = contests.filter(c => c.status === 'active');
      
      // Process contests to include additional data
      const processedContests = await Promise.all(activeContests.map(async contest => {
        // Get participants for this contest
        const contestParticipants = participants.filter(p => p.contest_id === contest.id);
        
        // Calculate statistics
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
        
        // Get prizes for this contest
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
          stats: {
            totalParticipants: validParticipants.length,
            eligibleParticipants: eligibleParticipants.length,
            averageScore
          },
          prizes: contestPrizes
        };
      }));
      
      console.log('Processed contests:', processedContests);
      return processedContests;
    },
    
    getById: async (id: string) => {
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
    },
    
    update: async (id: string, updates: ContestStatusUpdate) => {
      const index = contests.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Contest not found');
      
      contests[index] = { ...contests[index], ...updates };
      saveData('contests', contests);
      
      return contests[index];
    },
    
    create: async (contestData: Partial<Contest>) => {
      const newContest = {
        id: uuidv4(),
        title: contestData.title || '',
        description: contestData.description || '',
        status: contestData.status || 'draft',
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
        min_rank: contestData.min_rank || 'NOVATO',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Contest;
      
      contests.push(newContest);
      saveData('contests', contests);
      
      return newContest;
    },
    
    delete: async (id: string) => {
      contests = contests.filter(c => c.id !== id);
      saveData('contests', contests);
    },
    
    archive: async (id: string) => {
      const index = contests.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Contest not found');
      
      contests[index].status = 'archived';
      saveData('contests', contests);
      
      return contests[index];
    }
  },
  
  // Questions operations
  questions: {
    getByContestId: async (contestId: string) => {
      return questions.filter(q => q.contest_id === contestId);
    },
    
    create: async (questionData: any) => {
      const newQuestion = {
        id: uuidv4(),
        ...questionData,
        created_at: new Date().toISOString()
      };
      
      questions.push(newQuestion);
      saveData('questions', questions);
      
      return newQuestion;
    },
    
    update: async (id: string, questionData: any) => {
      const index = questions.findIndex(q => q.id === id);
      if (index === -1) throw new Error('Question not found');
      
      questions[index] = { ...questions[index], ...questionData };
      saveData('questions', questions);
      
      return questions[index];
    },
    
    delete: async (id: string) => {
      questions = questions.filter(q => q.id !== id);
      saveData('questions', questions);
    }
  },
  
  // Participants operations
  participants: {
    getByContestId: async (contestId: string) => {
      return participants.filter(p => p.contest_id === contestId);
    },
    
    create: async (participantData: any) => {
      const newParticipant = {
        id: uuidv4(),
        participation_id: uuidv4(),
        ...participantData,
        created_at: new Date().toISOString()
      };
      
      participants.push(newParticipant);
      saveData('participants', participants);
      
      return newParticipant;
    },
    
    update: async (id: string, participantData: any) => {
      const index = participants.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Participant not found');
      
      participants[index] = { ...participants[index], ...participantData };
      saveData('participants', participants);
      
      return participants[index];
    },
    
    delete: async (id: string) => {
      participants = participants.filter(p => p.id !== id);
      saveData('participants', participants);
    }
  },
  
  // Prizes operations
  prizes: {
    getByContestId: async (contestId: string) => {
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
    },
    
    create: async (prizeData: any) => {
      const newPrize = {
        id: uuidv4(),
        ...prizeData,
        created_at: new Date().toISOString()
      };
      
      prizes.push(newPrize);
      saveData('prizes', prizes);
      
      return newPrize;
    },
    
    delete: async (id: string) => {
      prizes = prizes.filter(p => p.id !== id);
      saveData('prizes', prizes);
    }
  },
  
  // Prize catalog operations
  prizeCatalog: {
    getAll: async () => {
      return prizeCatalog;
    },
    
    create: async (catalogItemData: any) => {
      const newCatalogItem = {
        id: uuidv4(),
        ...catalogItemData,
        created_at: new Date().toISOString()
      };
      
      prizeCatalog.push(newCatalogItem);
      saveData('prizeCatalog', prizeCatalog);
      
      return newCatalogItem;
    },
    
    update: async (id: string, catalogItemData: any) => {
      const index = prizeCatalog.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Catalog item not found');
      
      prizeCatalog[index] = { ...prizeCatalog[index], ...catalogItemData };
      saveData('prizeCatalog', prizeCatalog);
      
      return prizeCatalog[index];
    },
    
    delete: async (id: string) => {
      prizeCatalog = prizeCatalog.filter(p => p.id !== id);
      saveData('prizeCatalog', prizeCatalog);
    }
  }
};
