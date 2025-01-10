const messages = [
  "Continuez comme ça !",
  "Vous progressez bien !",
  "Excellent travail !",
  "Gardez ce rythme !",
  "Vous êtes sur la bonne voie !",
  "Belle performance !",
  "Persévérez, ça paie !",
  "Votre effort est remarquable !",
  "Chaque réponse compte !",
  "Vous vous améliorez !"
];

export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};