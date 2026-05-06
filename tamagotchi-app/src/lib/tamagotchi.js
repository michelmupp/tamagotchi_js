import { writable } from 'svelte/store';

const initialState = {
  hunger: 50,
  happiness: 50,
  energy: 50,
  health: 100,
  alive: true,
  xp: 0,
  level: 1,
  xpToNext: 100,
  
  // Neue Features
  age: 0,
  evolutionStage: 'baby',
  coins: 0,
  
  // Cooldowns
  lastFed: 0,
  lastPlayed: 0,
  lastSlept: 0,
  lastCleaned: 0,
  
  // Statistiken
  totalFed: 0,
  totalPlayed: 0,
  totalSlept: 0,
  totalCleaned: 0,
  
  // Achievements
  achievements: {
    firstMeal: false,
    level5: false,
    level10: false,
    rich: false,
    survivor: false
  },
  
  // Inventar
  inventory: []
};

function createTamagotchi() {
  const { subscribe, set, update } = writable(load() || initialState);

  function save(state) {
    localStorage.setItem('tamagotchi', JSON.stringify(state));
  }

  function load() {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem('tamagotchi');
    return data ? JSON.parse(data) : null;
  }

  function checkAchievements(state) {
    if (state.totalFed >= 1 && !state.achievements.firstMeal) {
      state.achievements.firstMeal = true;
      return 'Erste Mahlzeit! 🍽️';
    }
    if (state.level >= 5 && !state.achievements.level5) {
      state.achievements.level5 = true;
      return 'Level 5 erreicht! 🎉';
    }
    if (state.level >= 10 && !state.achievements.level10) {
      state.achievements.level10 = true;
      return 'Level 10 Meister! 🏆';
    }
    if (state.coins >= 100 && !state.achievements.rich) {
      state.achievements.rich = true;
      return 'Reich! 💰';
    }
    if (state.age >= 60 && !state.achievements.survivor) {
      state.achievements.survivor = true;
      return 'Überlebenskünstler! 🏅';
    }
    return null;
  }

  function tick() {
    update(state => {
      if (!state.alive) return state;
      
      const next = { ...state };
      
      next.hunger = Math.min(100, next.hunger + 2);
      next.energy = Math.max(0, next.energy - 1);
      next.happiness = Math.max(0, next.happiness - 1);
      next.age += 5/60;
      
      // Evolution
      if (next.level <= 3) next.evolutionStage = 'baby';
      else if (next.level <= 7) next.evolutionStage = 'teen';
      else next.evolutionStage = 'adult';
      
      if (next.hunger > 80) next.health = Math.max(0, next.health - 2);
      if (next.energy < 20) next.health = Math.max(0, next.health - 1);
      
      if (next.health <= 0) {
        next.alive = false;
      }
      
      // Passives Einkommen
      next.coins += 1;
      
      save(next);
      return next;
    });
  }

  return {
    subscribe,
    
    feed: () => update(state => {
      if (!state.alive) return state;
      
      const now = Date.now();
      const cooldown = 20000;
      
      if (now - state.lastFed < cooldown) return state;
      
      const next = { ...state };
      next.hunger = Math.max(0, next.hunger - 25);
      next.happiness = Math.min(100, next.happiness + 5);
      next.lastFed = now;
      next.totalFed++;
      
      addXP(next, 10);
      
      const achievement = checkAchievements(next);
      if (achievement) console.log('🏆 Achievement:', achievement);
      
      save(next);
      return next;
    }),
    
    play: () => update(state => {
      if (!state.alive) return state;
      
      const now = Date.now();
      const cooldown = 30000;
      
      if (now - state.lastPlayed < cooldown) return state;
      
      const next = { ...state };
      next.happiness = Math.min(100, next.happiness + 15);
      next.energy = Math.max(0, next.energy - 5);
      next.hunger = Math.min(100, next.hunger + 10);
      next.lastPlayed = now;
      next.totalPlayed++;
      next.coins += 2;
      
      addXP(next, 20);
      
      const achievement = checkAchievements(next);
      if (achievement) console.log('🏆 Achievement:', achievement);
      
      save(next);
      return next;
    }),
    
    sleep: () => update(state => {
      if (!state.alive) return state;
      
      const now = Date.now();
      const cooldown = 30000;
      
      if (now - state.lastSlept < cooldown) return state;
      
      const next = { ...state };
      next.energy = Math.min(100, next.energy + 25);
      next.lastSlept = now;
      next.totalSlept++;
      
      addXP(next, 5);
      
      save(next);
      return next;
    }),
    
    clean: () => update(state => {
      if (!state.alive) return state;
      
      const now = Date.now();
      const cooldown = 20000;
      
      if (now - state.lastCleaned < cooldown) return state;
      
      const next = { ...state };
      next.health = Math.min(100, next.health + 10);
      next.lastCleaned = now;
      next.totalCleaned++;
      
      addXP(next, 8);
      
      save(next);
      return next;
    }),

    tick,
    
    reset: () => {
      save(initialState);
      set(initialState);
    }
  };
}

function addXP(state, amount) {
  if (!state.alive) return;
  
  state.xp += amount;
  
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.floor(state.xpToNext * 1.3);
    state.health = Math.min(100, state.health + 10);
    state.happiness = Math.min(100, state.happiness + 10);
    state.coins += 10; // Bonus für Level-Up
  }
}

export const tamagotchi = createTamagotchi();