
/**
 * Service de gestion des participants
 */
import { v4 as uuidv4 } from 'uuid';
import { participants, saveData } from './storage';

/**
 * Récupère les participants d'un concours
 */
export const getByContestId = async (contestId: string) => {
  return participants.filter(p => p.contest_id === contestId);
};

/**
 * Crée un nouveau participant
 */
export const create = async (participantData: any) => {
  const newParticipant = {
    id: uuidv4(),
    participation_id: uuidv4(),
    ...participantData,
    created_at: new Date().toISOString()
  };
  
  participants.push(newParticipant);
  saveData('participants', participants);
  
  return newParticipant;
};

/**
 * Met à jour un participant
 */
export const update = async (id: string, participantData: any) => {
  const index = participants.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Participant not found');
  
  participants[index] = { ...participants[index], ...participantData };
  saveData('participants', participants);
  
  return participants[index];
};

/**
 * Supprime un participant
 */
export const deleteParticipant = async (id: string) => {
  const newParticipants = participants.filter(p => p.id !== id);
  participants.length = 0;
  participants.push(...newParticipants);
  saveData('participants', participants);
  return true;
};
