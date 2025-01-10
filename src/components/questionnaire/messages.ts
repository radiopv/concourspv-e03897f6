const messages = [
  "Prenez votre temps pour réfléchir à chaque réponse !",
  "Vous progressez bien, continuez comme ça !",
  "Chaque question est une opportunité d'apprendre !",
  "Restez concentré, vous faites du bon travail !",
  "La réflexion est la clé du succès !",
  "N'hésitez pas à relire l'article si nécessaire",
  "Votre progression est encourageante !",
  "Chaque réponse vous rapproche du but !",
  "La persévérance est votre meilleur atout !",
  "Vous êtes sur la bonne voie !"
];

export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};