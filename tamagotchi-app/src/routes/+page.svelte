<script>
  import { tamagotchi } from '$lib/tamagotchi';
  import { getSprite } from '$lib/spriteSystem';

  let pet = $derived($tamagotchi);
  let currentTime = $derived(new Date().getHours());
  let isNight = $derived(currentTime > 20 || currentTime < 6);
  
  // Wetter-System
  let weather = $state('☀️');
  const weatherOptions = ['☀️', '⛅', '🌧️', '🌈', '⛈️', '🌙'];
  
  // Achievement-Notification
  let achievementPopup = $state(null);
  
  // Cooldown-Status
  let cooldowns = $state({
    feed: 0,
    play: 0,
    sleep: 0,
    clean: 0
  });

  // Tick-System und Cooldown-Updates
  $effect(() => {
    const interval = setInterval(() => {
      tamagotchi.tick();
      
      // Cooldowns aktualisieren
      if (pet) {
        const now = Date.now();
        cooldowns = {
          feed: Math.max(0, Math.ceil((30000 - (now - pet.lastFed)) / 1000)),
          play: Math.max(0, Math.ceil((45000 - (now - pet.lastPlayed)) / 1000)),
          sleep: Math.max(0, Math.ceil((60000 - (now - pet.lastSlept)) / 1000)),
          clean: Math.max(0, Math.ceil((20000 - (now - pet.lastCleaned)) / 1000))
        };
      }
      
      // Wetter ändern
      if (Math.random() < 0.1) {
        weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      }
    }, 5000);
    
    return () => clearInterval(interval);
  });

  // Achievement Check
  $effect(() => {
    if (pet?.achievements) {
      const unlocked = Object.entries(pet.achievements).find(([key, val]) => val && !previousAchievements[key]);
      if (unlocked) {
        const achievementNames = {
          firstMeal: 'Erste Mahlzeit! 🍽️',
          level5: 'Level 5! 🎉',
          level10: 'Level 10! 🏆',
          rich: '100 Münzen! 💰',
          survivor: '1 Stunde überlebt! 🏅'
        };
        achievementPopup = achievementNames[unlocked[0]];
        setTimeout(() => achievementPopup = null, 3000);
      }
    }
  });

  let previousAchievements = $derived(pet?.achievements ? {...pet.achievements} : {});
</script>

<div class="device">
  <div class="tamagotchi-device">
    <div class="screen-area">
      <div class="screen" class:night-mode={isNight}>
        {#if pet}
          {#if pet.alive}
            <!-- Wetter-Anzeige -->
            <div class="weather-widget">
              <span class="weather-icon">{weather}</span>
              <span class="time-indicator">{isNight ? '🌙 Nacht' : '☀️ Tag'}</span>
            </div>

            <!-- Achievement Popup -->
            {#if achievementPopup}
              <div class="achievement-popup animate-popup">
                {achievementPopup}
              </div>
            {/if}

            <div class="sprite-container">
              <img 
                class="sprite" 
                class:animate-happy={pet.happiness > 70}
                class:animate-hungry={pet.hunger > 70}
                class:animate-sleeping={pet.energy < 20}
                src={getSprite(pet)} 
                alt="tamagotchi sprite"
              />
            </div>
            
            <!-- Evolution Stage -->
            <div class="evolution-badge">
              {pet.evolutionStage === 'baby' ? '👶' : pet.evolutionStage === 'teen' ? '🧒' : '🧑'} 
              {pet.evolutionStage}
            </div>
            
            <div class="level-badge">
              <span class="star">⭐</span> Lv.{pet.level}
              <span class="coins">🪙 {pet.coins}</span>
            </div>
            
            <!-- XP Section -->
            <div class="xp-section">
              <div class="xp-header">
                <span class="xp-label">XP</span>
                <span class="xp-numbers">{pet.xp} / {pet.xpToNext}</span>
              </div>
              <div class="xp-bar">
                <div class="xp-track">
                  <div 
                    class="xp-fill" 
                    style="width: {(pet.xp / pet.xpToNext * 100).toFixed(1)}%"
                  ></div>
                </div>
              </div>
              <div class="xp-percentage">
                {((pet.xp / pet.xpToNext) * 100).toFixed(1)}% zum nächsten Level
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-icon">🍔</span>
                <div class="stat-info">
                  <div class="stat-name">Hunger</div>
                  <div class="stat-bar">
                    <div 
                      class="stat-fill hunger" 
                      style="width: {pet.hunger}%"
                    ></div>
                  </div>
                  <div class="stat-value">{pet.hunger}/100</div>
                </div>
              </div>
              
              <div class="stat-item">
                <span class="stat-icon">😊</span>
                <div class="stat-info">
                  <div class="stat-name">Freude</div>
                  <div class="stat-bar">
                    <div 
                      class="stat-fill happiness" 
                      style="width: {pet.happiness}%"
                    ></div>
                  </div>
                  <div class="stat-value">{pet.happiness}/100</div>
                </div>
              </div>
              
              <div class="stat-item">
                <span class="stat-icon">⚡</span>
                <div class="stat-info">
                  <div class="stat-name">Energie</div>
                  <div class="stat-bar">
                    <div 
                      class="stat-fill energy" 
                      style="width: {pet.energy}%"
                    ></div>
                  </div>
                  <div class="stat-value">{pet.energy}/100</div>
                </div>
              </div>
              
              <div class="stat-item">
                <span class="stat-icon">❤️</span>
                <div class="stat-info">
                  <div class="stat-name">Gesundheit</div>
                  <div class="stat-bar">
                    <div 
                      class="stat-fill health" 
                      style="width: {pet.health}%"
                    ></div>
                  </div>
                  <div class="stat-value">{pet.health}/100</div>
                </div>
              </div>
            </div>

            <!-- Statistiken -->
            <div class="mini-stats">
              <span title="Alter in Minuten">⏱️ {Math.floor(pet.age)}min</span>
              <span title="Mahlzeiten">🍽️ {pet.totalFed}</span>
              <span title="Gespielt">⚽ {pet.totalPlayed}</span>
            </div>
          {:else}
            <div class="death-screen">
              <div class="skull">💀</div>
              <h2>Game Over</h2>
              <p>Dein Tamagotchi ist gestorben...</p>
              <div class="final-stats">
                <p>Level: {pet.level} erreicht</p>
                <p>Alter: {Math.floor(pet.age)} Minuten</p>
                <p>Münzen: {pet.coins} 🪙</p>
              </div>
            </div>
          {/if}
        {/if}
      </div>
      
      <div class="status-led {pet?.alive ? 'alive' : 'dead'}"></div>
    </div>
    
    <div class="buttons-area">
      {#if pet?.alive}
        <div class="button-grid">
          <button 
            class="tama-btn feed" 
            class:cooldown={cooldowns.feed > 0}
            onclick={() => tamagotchi.feed()}
            disabled={cooldowns.feed > 0}
          >
            <span class="btn-icon">🍖</span>
            {cooldowns.feed > 0 ? `${cooldowns.feed}s` : 'Füttern'}
            <span class="btn-effect">-25 Hunger</span>
          </button>
          
          <button class="tama-btn reset-small" onclick={() => tamagotchi.reset()}>
            <span class="btn-icon">🔄</span>
            Reset
          </button>
          
          <button 
            class="tama-btn play" 
            class:cooldown={cooldowns.play > 0}
            onclick={() => tamagotchi.play()}
            disabled={cooldowns.play > 0}
          >
            <span class="btn-icon">⚽</span>
            {cooldowns.play > 0 ? `${cooldowns.play}s` : 'Spielen'}
            <span class="btn-effect">+10 Hunger</span>
          </button>
          
          <button 
            class="tama-btn sleep" 
            class:cooldown={cooldowns.sleep > 0}
            onclick={() => tamagotchi.sleep()}
            disabled={cooldowns.sleep > 0}
          >
            <span class="btn-icon">💤</span>
            {cooldowns.sleep > 0 ? `${cooldowns.sleep}s` : 'Schlafen'}
          </button>
          
          <button 
            class="tama-btn clean" 
            class:cooldown={cooldowns.clean > 0}
            onclick={() => tamagotchi.clean()}
            disabled={cooldowns.clean > 0}
          >
            <span class="btn-icon">🧹</span>
            {cooldowns.clean > 0 ? `${cooldowns.clean}s` : 'Reinigen'}
          </button>
        </div>
      {:else if pet}
        <div class="reset-area">
          <p>Dein Tamagotchi braucht dich!</p>
          <button class="tama-btn reset" onclick={() => tamagotchi.reset()}>
            <span class="btn-icon">🥚</span>
            Neues Ei
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Hintergrund */
  .device {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
  }

  /* Tamagotchi-Gerät */
  .tamagotchi-device {
    background: linear-gradient(145deg, #ff6b6b, #ee5a24);
    border-radius: 40px;
    padding: 20px;
    box-shadow: 
      0 20px 60px rgba(0,0,0,0.3),
      inset 0 -5px 15px rgba(0,0,0,0.2),
      inset 0 5px 15px rgba(255,255,255,0.1);
    width: 400px;
    max-width: 90vw;
    border: 4px solid #c44569;
  }

  /* Bildschirm-Bereich */
  .screen-area {
    background: #2c3e50;
    border-radius: 25px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 
      inset 0 0 30px rgba(0,0,0,0.5),
      0 5px 15px rgba(0,0,0,0.3);
    border: 3px solid #34495e;
  }

  /* Bildschirm */
  .screen {
    background: linear-gradient(180deg, #a8d8ea 0%, #7ec8e3 50%, #6ab0d6 100%);
    border-radius: 15px;
    padding: 20px;
    min-height: 420px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
    transition: background 0.5s ease;
  }

  .night-mode {
    background: linear-gradient(180deg, #1a1a2e, #16213e, #0f3460);
    color: #ecf0f1;
  }

  .screen::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    border-radius: 15px;
  }

  /* Wetter Widget */
  .weather-widget {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 8px;
    background: rgba(255,255,255,0.2);
    border-radius: 15px;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
    font-size: 12px;
  }

  .weather-icon {
    font-size: 16px;
  }

  .time-indicator {
    font-weight: bold;
    font-size: 10px;
  }

  /* Achievement Popup */
  .achievement-popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(145deg, #f39c12, #e67e22);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10;
    text-align: center;
  }

  .animate-popup {
    animation: popup 0.5s ease, fadeOut 0.5s ease 2.5s;
  }

  @keyframes popup {
    0% { transform: translate(-50%, -50%) scale(0); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes fadeOut {
    to { opacity: 0; }
  }

  /* Evolution Badge */
  .evolution-badge {
    text-align: center;
    font-size: 11px;
    color: #2c3e50;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
    text-transform: capitalize;
  }

  .night-mode .evolution-badge {
    color: #ecf0f1;
  }

  /* Sprite Container */
  .sprite-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    position: relative;
    z-index: 1;
  }

  .sprite {
    width: 100px;
    height: 100px;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
    animation: float 3s ease-in-out infinite;
    transition: all 0.3s ease;
  }

  .animate-happy {
    animation: bounce 0.5s ease infinite;
  }

  .animate-hungry {
    animation: shake 0.3s ease infinite;
  }

  .animate-sleeping {
    animation: sleep 2s ease infinite;
    filter: brightness(0.8);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes sleep {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.95); }
  }

  /* Level Badge */
  .level-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    background: rgba(255,255,255,0.3);
    border-radius: 20px;
    padding: 3px 12px;
    margin: 0 auto 12px;
    width: fit-content;
    font-weight: bold;
    color: #2c3e50;
    font-size: 13px;
    backdrop-filter: blur(5px);
    position: relative;
    z-index: 1;
  }

  .night-mode .level-badge {
    background: rgba(255,255,255,0.1);
    color: #ecf0f1;
  }

  .star {
    font-size: 14px;
  }

  .coins {
    font-size: 12px;
  }

  /* XP Section */
  .xp-section {
    margin-bottom: 15px;
    position: relative;
    z-index: 1;
  }

  .xp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .xp-label {
    font-size: 10px;
    font-weight: bold;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .night-mode .xp-label {
    color: #ecf0f1;
  }

  .xp-numbers {
    font-size: 11px;
    font-weight: bold;
    color: #2c3e50;
    background: rgba(255,255,255,0.3);
    padding: 2px 8px;
    border-radius: 10px;
  }

  .night-mode .xp-numbers {
    color: #ecf0f1;
    background: rgba(255,255,255,0.1);
  }

  .xp-bar {
    margin-bottom: 2px;
  }

  .xp-track {
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    height: 10px;
    overflow: hidden;
  }

  .xp-fill {
    background: linear-gradient(90deg, #f1c40f, #f39c12);
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(241,196,15,0.5);
  }

  .xp-percentage {
    font-size: 9px;
    color: #2c3e50;
    text-align: right;
    font-weight: bold;
  }

  .night-mode .xp-percentage {
    color: #ecf0f1;
  }

  /* Stats Grid */
  .stats-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stat-icon {
    font-size: 20px;
    width: 25px;
    text-align: center;
  }

  .stat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-name {
    font-size: 10px;
    font-weight: bold;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .night-mode .stat-name {
    color: #ecf0f1;
  }

  .stat-bar {
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    height: 10px;
    overflow: hidden;
  }

  .stat-fill {
    height: 100%;
    border-radius: 8px;
    transition: width 0.5s ease;
  }

  .stat-fill.hunger {
    background: linear-gradient(90deg, #e74c3c, #c0392b);
  }

  .stat-fill.happiness {
    background: linear-gradient(90deg, #f1c40f, #f39c12);
  }

  .stat-fill.energy {
    background: linear-gradient(90deg, #3498db, #2980b9);
  }

  .stat-fill.health {
    background: linear-gradient(90deg, #2ecc71, #27ae60);
  }

  .stat-value {
    font-size: 9px;
    font-weight: bold;
    color: #2c3e50;
    text-align: right;
  }

  .night-mode .stat-value {
    color: #ecf0f1;
  }

  /* Mini Stats */
  .mini-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
    padding: 8px;
    background: rgba(255,255,255,0.2);
    border-radius: 15px;
    font-size: 11px;
    color: #2c3e50;
    position: relative;
    z-index: 1;
  }

  .night-mode .mini-stats {
    color: #ecf0f1;
  }

  /* Death Screen */
  .death-screen {
    text-align: center;
    padding: 30px 20px;
    position: relative;
    z-index: 1;
  }

  .skull {
    font-size: 60px;
    margin-bottom: 15px;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .death-screen h2 {
    color: #2c3e50;
    margin: 10px 0;
    font-size: 24px;
  }

  .night-mode .death-screen h2 {
    color: #ecf0f1;
  }

  .death-screen p {
    color: #34495e;
    font-size: 14px;
  }

  .night-mode .death-screen p {
    color: #bdc3c7;
  }

  .final-stats {
    margin-top: 20px;
    padding: 15px;
    background: rgba(255,255,255,0.2);
    border-radius: 15px;
  }

  .final-stats p {
    margin: 5px 0;
    color: #e74c3c !important;
    font-weight: bold;
  }

  /* Status LED */
  .status-led {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 10px auto 0;
  }

  .status-led.alive {
    background: #2ecc71;
    box-shadow: 0 0 10px #2ecc71;
    animation: blink 2s ease-in-out infinite;
  }

  .status-led.dead {
    background: #e74c3c;
    box-shadow: 0 0 10px #e74c3c;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Buttons Bereich */
  .buttons-area {
    padding: 10px 0;
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px 15px;
    justify-items: center;
    align-items: center;
  }

  .tama-btn {
    border: none;
    border-radius: 50%;
    width: 75px;
    height: 75px;
    cursor: pointer;
    font-weight: bold;
    font-size: 11px;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: all 0.2s ease;
    box-shadow: 
      0 5px 15px rgba(0,0,0,0.2),
      inset 0 -3px 8px rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
  }

  .tama-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(50%);
  }

  .tama-btn.cooldown {
    background: #95a5a6 !important;
  }

  .btn-icon {
    font-size: 22px;
  }

  .btn-effect {
    font-size: 8px;
    opacity: 0.8;
    background: rgba(0,0,0,0.2);
    padding: 1px 4px;
    border-radius: 6px;
  }

  .tama-btn:active:not(:disabled) {
    transform: scale(0.9);
    box-shadow: 
      0 2px 5px rgba(0,0,0,0.2),
      inset 0 2px 4px rgba(0,0,0,0.2);
  }

  .tama-btn.feed {
    background: linear-gradient(145deg, #f39c12, #e67e22);
  }

  .tama-btn.play {
    background: linear-gradient(145deg, #3498db, #2980b9);
  }

  .tama-btn.sleep {
    background: linear-gradient(145deg, #9b59b6, #8e44ad);
  }

  .tama-btn.clean {
    background: linear-gradient(145deg, #1abc9c, #16a085);
  }

  .tama-btn.reset-small {
    background: linear-gradient(145deg, #95a5a6, #7f8c8d);
    width: 55px;
    height: 55px;
    font-size: 9px;
  }

  .tama-btn.reset-small .btn-icon {
    font-size: 18px;
  }

  .button-grid .tama-btn:nth-child(4) {
    grid-column: 1;
    grid-row: 2;
  }

  .button-grid .tama-btn:nth-child(5) {
    grid-column: 3;
    grid-row: 2;
  }

  .reset-area {
    text-align: center;
    padding: 20px;
  }

  .reset-area p {
    color: white;
    margin-bottom: 15px;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }

  .tama-btn.reset {
    background: linear-gradient(145deg, #ecf0f1, #bdc3c7);
    color: #2c3e50;
    width: auto;
    border-radius: 25px;
    padding: 12px 25px;
    margin: 0 auto;
    display: inline-flex;
    flex-direction: row;
    gap: 8px;
    font-size: 14px;
  }

  @media (max-width: 400px) {
    .tamagotchi-device {
      border-radius: 25px;
      padding: 15px;
    }
    
    .sprite {
      width: 80px;
      height: 80px;
    }
    
    .tama-btn {
      width: 65px;
      height: 65px;
      font-size: 10px;
    }
    
    .tama-btn.reset-small {
      width: 50px;
      height: 50px;
      font-size: 8px;
    }
    
    .btn-icon {
      font-size: 18px;
    }
    
    .tama-btn.reset-small .btn-icon {
      font-size: 16px;
    }
  }
</style>