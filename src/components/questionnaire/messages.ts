export const getRandomMessage = (isCorrect: boolean) => {
  const correctMessages = [
    "Excellente réponse ! Continuez comme ça ! 🎉",
    "Bravo ! Vous êtes sur la bonne voie pour le tirage au sort ! 🌟",
    "Parfait ! Gardez ce rythme pour atteindre les 70% ! 🎯",
    "Superbe ! Votre attention aux détails paie ! 🏆",
    "Fantastique ! Vous vous rapprochez du tirage au sort ! ⭐"
  ];

  const incorrectMessages = [
    "N'oubliez pas de bien lire les articles pour trouver les bonnes réponses. Un score de 70% est nécessaire pour le tirage ! 📚",
    "Prenez votre temps pour lire les articles, les réponses s'y trouvent ! Objectif 70% pour le tirage ! 🎯",
    "Les articles contiennent toutes les informations nécessaires. Visez les 70% pour participer au tirage ! 📖",
    "Un peu plus de lecture et vous trouverez la bonne réponse ! Rappelez-vous : 70% pour le tirage ! 🔍",
    "Consultez attentivement les articles du blog, ils sont la clé du succès ! Objectif 70% ! 🗝️"
  ];

  const randomIndex = Math.floor(Math.random() * (isCorrect ? correctMessages.length : incorrectMessages.length));
  return isCorrect ? correctMessages[randomIndex] : incorrectMessages[randomIndex];
};