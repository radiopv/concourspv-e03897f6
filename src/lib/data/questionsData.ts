
/**
 * Service de gestion des questions
 */
import { v4 as uuidv4 } from 'uuid';
import { questions, saveData } from './storage';

/**
 * Récupère les questions d'un concours
 */
export const getByContestId = async (contestId: string) => {
  return questions.filter(q => q.contest_id === contestId);
};

/**
 * Crée une nouvelle question
 */
export const create = async (questionData: any) => {
  const newQuestion = {
    id: uuidv4(),
    ...questionData,
    created_at: new Date().toISOString()
  };
  
  questions.push(newQuestion);
  saveData('questions', questions);
  
  return newQuestion;
};

/**
 * Met à jour une question
 */
export const update = async (id: string, questionData: any) => {
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) throw new Error('Question not found');
  
  questions[index] = { ...questions[index], ...questionData };
  saveData('questions', questions);
  
  return questions[index];
};

/**
 * Supprime une question
 */
export const deleteQuestion = async (id: string) => {
  const newQuestions = questions.filter(q => q.id !== id);
  questions.length = 0;
  questions.push(...newQuestions);
  saveData('questions', questions);
  return true;
};
