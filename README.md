<!-- Banner Image -->
<p align="center">
  <img src="[Github-Banner](assets/images/CPL_Bot_Github_banner2.png)" alt="MitoCiv Banner" width="100%" />
</p>

<!-- Badges -->
<p align="center">
  <b>MitoCiv Bot</b><br>
  <i>The Discord Bot that Fuels Competitive Civ VI & VII Communities</i><br><br>
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/Discord-Slash%20Commands-7289da" alt="Discord Slash Commands" />
  <img src="https://img.shields.io/badge/Tech-Node.js%20%7C%20TypeScript%20%7C%20MongoDB-lightgrey" alt="Tech Stack" />
</p>

---

# MitoCiv – The Discord Bot that Fuels Competitive Civ VI & VII Communities

MitoCiv is a powerhouse Discord bot designed to **streamline and energize competitive Civilization VI and VII gameplay**.  
From **civilization drafting** to **TrueSkill2-based rankings** and **dynamic leaderboards**, MitoCiv automates the setup and post-game processes that matter most to competitive players and communities.

---

## Table of Contents
1. [Features](#features)
2. [Game Modes & Draft Types](#game-modes--draft-types)
3. [Commands](#commands)
4. [Preview](#preview)
5. [Technology Stack](#technology-stack)
6. [Integrations](#integrations)
7. [Availability & Deployment](#availability-&-deployment)
8. [Contributing](#contributing)
9. [Special Thanks](#️-special-thanks)

[Back to Top](#mitociv--the-discord-bot-that-fuels-competitive-civ-vi--vii-communities)

---

## Features
- **Civilization Draft System** – Supports FFA, Teamers, Blind/Monkey, Dynamic 9/3/1, All Random, and custom formats.  
- **TrueSkill2 Ranking System** – Player performance tracking with dynamic skill ratings.  
- **Game Lobby Integration** – Automatic lobby link generation and enforcement of host rules.  
- **Dynamic Leaderboards** – Includes Hall of Fame (HoF), seasonal rankings, and detailed player stats.  
- **Utility Tools** – Quick random number generation, coin flips, and map seed generation.  
- **Discord-Optimized** – Slash commands, embeds, buttons, and dialog modals.  
- **Configurable** – Server admins can tweak settings, roles, and language with `/config`.  
- **Up-to-Date** - Accords to latest Civilization VI & Civilization VII versions. 
- **Community-Tested** – Trusted by X+ users in Civilization communities.  

[Back to Top](#table-of-contents)

---

## Game Modes & Draft Types
### **Game Modes**
- **FFA** – Free-for-all matches.
- **Teamers** – 2v2, 3v3, etc.
- **Duel** – 1v1 competitive format.
- **PBC (Play by Cloud)** – Asynchronous cloud-based games.

### **Draft Types**
- **Blind** – Hidden picks revealed after drafting.  
- **All Random** – Randomly assigned civilizations.  
- **CWC** – Civilization World Cup-style bans/picks.  
- **Dynamic** – Real-time evolving draft pools.  
- **Draft2** – Two-phase drafts (ban/pick).  
- **Snake** – Snake order picks (1→N, then N→1).  

[Back to Top](#table-of-contents)

---

## Commands

| **Command**         | **Description**                                             | **Example**                     |
|---------------------|-------------------------------------------------------------|---------------------------------|
| `/config`           | Configure server settings (roles, language, values).        | `/config language en`           |
| `/draft <mode>`     | Start a draft session with chosen format.                   | `/draft blind`                  |
| `/leaderboard`      | View current rankings or Hall of Fame.                      | `/leaderboard`                  |
| `/stats @user`      | View detailed stats for a user.                             | `/stats @player`                |
| `/random`           | Generate a random number or map seed.                       | `/random 1-100`                 |
| `/coinflip`         | Flip a coin for quick decisions.                            | `/coinflip`                     |

[Back to Top](#table-of-contents)

---

## Preview
Below are example previews of MitoCiv’s features:

### **Draft Flow**
![Draft Flow](DRAFT_IMAGE_PLACEHOLDER)

### **Player Statistics**
![Player Stats](STATS_IMAGE_PLACEHOLDER)

### **Leaderboard**
![Leaderboard](LEADERBOARD_IMAGE_PLACEHOLDER)

[Back to Top](#table-of-contents)

---

## Technology Stack
- **Languages & Frameworks:** Node.js, TypeScript, FastAPI (Python microservices)  
- **Libraries:** discord.js, Express  
- **Database:** MongoDB  
- **APIs:** Steam Web API, civ-save-phase API  
- **Other Tools:** nodemon (development), npm  

[Back to Top](#table-of-contents)

---

## Integrations
- **AuthBot** – Authentication & player identity linking.  
- **Lady Justice** – Community moderation & fair-play enforcement.  
- **Civ Save Phase API** – Automatic game result detection from save files.  

[Back to Top](#table-of-contents)

---

## Availability & Deployment
> **Note:** MitoCiv Bot is a **private bot** and not available for public self-hosting.  
It requires access to a centralized database for leaderboards and statistics.

[Back to Top](#table-of-contents)

---

## Contributing
We welcome **feedback, bug reports, and translations**.   
- **Translate:** Contact us to localize MitoCiv into other languages.  
- **Report Bugs:** Open an issue on GitHub with clear steps to reproduce.  

[Back to Top](#table-of-contents)

---

## ❤️ Special Thanks
Special thanks to **Calcifer**, **Ms. Busysnail**, and the wider Civilization community for support and feedback.

[Back to Top](#table-of-contents)
