export function getSprite(pet) {
  const level = pet.level;

  const mood = getMood(pet);

  if (level <= 3) {
    return moodSprites.baby[mood];
  }

  if (level <= 7) {
    return moodSprites.teen[mood];
  }

  return moodSprites.adult[mood];
}

function getMood(pet) {
  if (pet.health < 40) return "sad";
  if (pet.hunger > 70) return "hungry";
  if (pet.happiness > 70) return "happy";
  return "normal";
}

const moodSprites = {
  baby: {
    normal: "/sprites/baby.png",
    hungry: "/sprites/baby_hungry.png",
    sad: "/sprites/baby.png",
    happy: "/sprites/baby.png"
  },
  teen: {
    normal: "/sprites/teen.png",
    hungry: "/sprites/teen_hungry.png",
    sad: "/sprites/teen.png",
    happy: "/sprites/teen.png"
  },
  adult: {
    normal: "/sprites/adult.png",
    hungry: "/sprites/adult_hungry.png",
    sad: "/sprites/adult.png",
    happy: "/sprites/adult.png"
  }
};