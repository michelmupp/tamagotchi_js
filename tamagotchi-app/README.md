# 🐣 Tamagotchi JS

Ein virtuelles Haustier, das in deinem Browser lebt – inspiriert von den klassischen Tamagotchis der 90er Jahre, aber modern umgesetzt mit Svelte!

## ✨ Features

- 🎮 **Klassische Tamagotchi-Mechaniken** – Füttern, Spielen, Schlafen und Reinigen
- 📊 **Level-System** – Sammle XP und steige im Level auf
- 🦋 **Evolution** – Dein Tamagotchi entwickelt sich vom Baby zum Teen und schließlich zum Erwachsenen
- 🏆 **Achievements** – Schalte Erfolge frei für besondere Meilensteine
- 🪙 **Münz-System** – Verdiene Münzen durch Aktionen und Level-Ups
- 🌙 **Tag/Nacht-Modus** – Der Bildschirm passt sich automatisch der Tageszeit an
- 🌤️ **Dynamisches Wetter** – Zufälliges Wetter auf dem Bildschirm
- ⏱️ **Cooldown-System** – Ausgewogenes Gameplay mit Abklingzeiten für Aktionen
- 💾 **Auto-Save** – Dein Fortschritt wird automatisch im Browser gespeichert
- 📱 **Responsive Design** – Spielbar auf Desktop und Mobilgeräten
- 🎨 **Retro-Design** – Pixel-Look mit modernen Animationen

## 🎯 So funktioniert's

### Werte deines Tamagotchis:
- 🍔 **Hunger** – Steigt mit der Zeit. Füttere dein Tamagotchi, bevor es verhungert!
- 😊 **Freude** – Sinkt langsam. Spiele mit ihm, um es glücklich zu machen.
- ⚡ **Energie** – Wird weniger. Lass es schlafen, um neue Kraft zu tanken.
- ❤️ **Gesundheit** – Sinkt bei Vernachlässigung. Halte alle Werte im grünen Bereich!

### Aktionen:
| Aktion | Effekt | Cooldown |
|--------|--------|----------|
| 🍖 Füttern | -25 Hunger, +5 Freude | 15s |
| ⚽ Spielen | +15 Freude, +10 Hunger, -5 Energie | 20s |
| 💤 Schlafen | +25 Energie | 30s |
| 🧹 Reinigen | +5 Gesundheit | 10s |

### Level-System:
- Jede Aktion gibt XP
- Bei Level-Up: Gesundheit & Freude steigen
- XP-Bedarf steigt mit jedem Level
- Evolution bei Level 3 (Teen) und Level 7 (Adult)

### Achievements:
- 🍽️ **Erste Mahlzeit** – Zum ersten Mal gefüttert
- 🎉 **Level 5** – Level 5 erreicht
- 🏆 **Level 10** – Level 10 Meister
- 💰 **Reich** – 100 Münzen gesammelt
- 🏅 **Überlebenskünstler** – 1 Stunde am Leben

## 🚀 Installation & Entwicklung

```bash
# Repository klonen
git clone https://github.com/michelmupp/tamagotchi_js.git
cd tamagotchi_js

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
