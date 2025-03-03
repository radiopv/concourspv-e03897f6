
/**
 * Utilitaires pour la gestion du stockage local des données
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

/**
 * Sauvegarde les données dans le localStorage pour la persistance
 */
export const saveData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

/**
 * Charge les données depuis le localStorage
 */
export const loadData = () => {
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

// Initialiser les données
loadData();

// Exporter les données et les fonctions de manipulation
export { 
  contests, 
  participants, 
  questions, 
  prizes, 
  prizeCatalog 
};

// Log pour le débogage
console.log('Initial data loaded:', { 
  contests: contests.length,
  participants: participants.length,
  questions: questions.length,
  prizes: prizes.length,
  prizeCatalog: prizeCatalog.length
});
