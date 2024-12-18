export const getRandomMessage = () => {
  const messages = [
    "Votre réponse a été enregistrée. Continuez ainsi ! 🎯",
    "N'oubliez pas que vous avez 3 tentatives pour obtenir 70% ! 📚",
    "Prenez votre temps pour lire les articles, les réponses s'y trouvent ! 🔍",
    "Les articles contiennent toutes les informations nécessaires. Visez les 70% ! 📖",
    "Consultez attentivement les articles du blog, ils sont la clé du succès ! 🗝️"
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};