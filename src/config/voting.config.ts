import { VoteSettingOption, DraftMode } from '../types/service';

export const CIV6_VOTE_FFA: Record<string, VoteSettingOption[]> = {
  "Official Friends/Allies": [
    { emoji: "0️⃣", label: "None" },
    { emoji: "1️⃣", label: "One" },
    { emoji: "2️⃣", label: "Two" },
    { emoji: "♾️", label: "Unlimited" },
  ],
  "BYC Mode (Capitals Only)": [
    { emoji: "🅱️", label: "Balanced" },
    { emoji: "Ⓜ️", label: "Maximum" },
    { emoji: "🚫", label: "None" },
  ],
  "Game Duration": [
    { emoji: "4️⃣", label: "4 Hours" },
    { emoji: "6️⃣", label: "6 Hours" },
    { emoji: "♾️", label: "Unlimited" },
  ],
  "Map Type": [
    { emoji: "🅿️", label: "Pangea Classic Ridges" },
    { emoji: "🗻", label: "Pangea Standard" },
    { emoji: "🏝️", label: "Island Plates" },
    { emoji: "7️⃣", label: "7 seas" },
    { emoji: "💎", label: "Rich Highlands" },
    { emoji: "🏞️", label: "Lakes" },
    { emoji: "🗾", label: "Archipelago" },
    { emoji: "🌀", label: "Fractal" },
    { emoji: "🌍", label: "Continents & Island" },
    { emoji: "🌎", label: "Small Continents" },
    { emoji: "🌋", label: "Primordial" },
    { emoji: "🧭", label: "Tilted Axis" },
    { emoji: "🌊", label: "Inland Sea" },
    { emoji: "💦", label: "Wetlands" },
    { emoji: "🌏", label: "Terra" },
    { emoji: "❓", label: "Random" }
  ],
  "Sea level": [
    { emoji: "💧", label: "Low" },
    { emoji: "💦", label: "Standard" },
    { emoji: "🌊", label: "High" }
  ],
  "Disaster Intensity": [
    { emoji: "0️⃣", label: "0" },
    { emoji: "1️⃣", label: "1" },
    { emoji: "2️⃣", label: "2" },
    { emoji: "3️⃣", label: "3" },
    { emoji: "4️⃣", label: "4" }
  ],
  "Barbarians Mode:": [
    { emoji: "🚫", label: "No barbs" },
    { emoji: "🤝", label: "Civilized barbs" },
    { emoji: "⚖️", label: "Balanced barbs" },
    { emoji: "🔥", label: "Raging barbs" }
  ],
  "CC Voting": [
    { emoji: "⏪", label: "10 Turns Earlier" },
    { emoji: "⏸️", label: "No Change" },
    { emoji: "⏩", label: "10 Turns Later" },
    { emoji: "⏭️", label: "20 Turns Later" }
  ],
  "Draft Mode": [
    { emoji: "✅", label: DraftMode.WITH_TRADE },
    { emoji: "🚫", label: DraftMode.NO_TRADE },
    { emoji: "🅱️", label: DraftMode.BLIND },
    { emoji: "❓", label: DraftMode.RANDOM },
  ],
};

export const CIV6_VOTE_TEAM: Record<string, VoteSettingOption[]> = {
  "BYC Mode (Capitals Only)": [
    { emoji: "🅱️", label: "Balanced" },
    { emoji: "Ⓜ️", label: "Maximum" },
    { emoji: "🚫", label: "None" },
  ],
  "Game Duration": [
    { emoji: "4️⃣", label: "4 Hours" },
    { emoji: "6️⃣", label: "6 Hours" },
    { emoji: "♾️", label: "Unlimited" },
  ],
  "Map Type": [
    { emoji: "🅿️", label: "Pangea Classic Ridges" },
    { emoji: "🗻", label: "Pangea Standard" },
    { emoji: "🏝️", label: "Island Plates" },
    { emoji: "7️⃣", label: "7 seas" },
    { emoji: "💎", label: "Rich Highlands" },
    { emoji: "🏞️", label: "Lakes" },
    { emoji: "🗾", label: "Archipelago" },
    { emoji: "🌀", label: "Fractal" },
    { emoji: "🌍", label: "Continents & Island" },
    { emoji: "🌎", label: "Small Continents" },
    { emoji: "🌋", label: "Primordial" },
    { emoji: "🧭", label: "Tilted Axis" },
    { emoji: "🌊", label: "Inland Sea" },
    { emoji: "💦", label: "Wetlands" },
    { emoji: "🌏", label: "Terra" },
    { emoji: "❓", label: "Random" }
  ],
  "Sea level": [
    { emoji: "💧", label: "Low" },
    { emoji: "💦", label: "Standard" },
    { emoji: "🌊", label: "High" }
  ],
  "Disaster Intensity": [
    { emoji: "0️⃣", label: "0" },
    { emoji: "1️⃣", label: "1" },
    { emoji: "2️⃣", label: "2" },
    { emoji: "3️⃣", label: "3" },
    { emoji: "4️⃣", label: "4" }
  ],
  "Draft Mode": [
    { emoji: "✅", label: DraftMode.DRAFT_2 },
    { emoji: "🐍", label: DraftMode.SNAKE },
    { emoji: "❓", label: DraftMode.RANDOM },
  ],
};


export const CIV6_DEFAULT_VOTE_SETTINGS: Record<string, string> = {
  "Gold Trading ": "Not Allowed",
  "Luxuries Trading ": "Allowed",
  "Strategics Trading ": "Not Allowed",
  "Military Alliance ": "Not Allowed",
  "Timer ": "Competitive",
  "Resources ": "Abundant",
  "Strategics ": "Abundant",
  "Ridges Definition ": "Classic",
  "Wonders ": "Standard",
};

// Vote settings for Civ7 
export const CIV7_VOTE_FFA: Record<string, VoteSettingOption[]> = {
  "Number of Ages": [
    { emoji: "1️⃣", label: "1 Age" },
    { emoji: "2️⃣", label: "2 Ages" },
    { emoji: "3️⃣", label: "3 Ages" },
  ],
  "Turn Timer": [
    { emoji: "⏱️", label: "Standard" },
    { emoji: "⚡", label: "Dynamic" },
  ],
  "Game Speed": [
    { emoji: "🌐", label: "Online" },
    { emoji: "⚡", label: "Quick" },
    { emoji: "⌛", label: "Standard" },
    { emoji: "🚀", label: "Epic" },
    { emoji: "🐢", label: "Marathon" },
  ],
  "Map Type": [
    { emoji: "🌍", label: "Continents" },
    { emoji: "🌎", label: "Continents plus" },
    { emoji: "🗾", label: "Archipelago" },
    { emoji: "🌀", label: "Fractal" },
    { emoji: "🔀", label: "Shuffle" },
    { emoji: "🌋", label: "Terra" },
    { emoji: "🅿️", label: "Pangea" },
    { emoji: "❓", label: "Random" },
  ],
  "Mementos": [
    { emoji: "✅", label: "On" },
    { emoji: "❌", label: "Off" },
  ],
  "Age Length": [
  { emoji: "⏱️", label: "Abbreviated" }, 
  { emoji: "⏰", label: "Standard" },     
  { emoji: "⏳", label: "Long" },         
],
  "Disaster Intensity": [
    { emoji: "💧", label: "Light" },
    { emoji: "🌩️", label: "Moderate" },
    { emoji: "🔥", label: "Catastrophic" },
  ],
  "Crisis": [
    { emoji: "✅", label: "On" },
    { emoji: "❌", label: "Off" },
  ],
  "Official Friends/Allies": [
    { emoji: "0️⃣", label: "None" },
    { emoji: "1️⃣", label: "One" },
    { emoji: "2️⃣", label: "Two" },
    { emoji: "3️⃣", label: "Three" },
    { emoji: "4️⃣", label: "Four" },
  ],
  "Draft Mode": [
    { emoji: "✅", label: DraftMode.WITH_TRADE },
    { emoji: "🐍", label: DraftMode.SNAKE },
    { emoji: "🚫", label: DraftMode.NO_TRADE },
    { emoji: "🅱️", label: DraftMode.BLIND },
    { emoji: "❓", label: DraftMode.RANDOM },
  ],
};


export const CIV7_VOTE_TEAM: Record<string, VoteSettingOption[]> = {
  "Number of Ages": [
    { emoji: "1️⃣", label: "1 Age" },
    { emoji: "2️⃣", label: "2 Ages" },
    { emoji: "3️⃣", label: "3 Ages" },
  ],
  "Turn Timer": [
    { emoji: "⏱️", label: "Standard" },
    { emoji: "⚡", label: "Dynamic" },
  ],
  "Game Speed": [
    { emoji: "🌐", label: "Online" },
    { emoji: "⚡", label: "Quick" },
    { emoji: "⌛", label: "Standard" },
    { emoji: "🚀", label: "Epic" },
    { emoji: "🐢", label: "Marathon" },
  ],
  "Map Type": [
    { emoji: "🌍", label: "Continents" },
    { emoji: "🌎", label: "Continents plus" },
    { emoji: "🗾", label: "Archipelago" },
    { emoji: "🌀", label: "Fractal" },
    { emoji: "🔀", label: "Shuffle" },
    { emoji: "🌋", label: "Terra" },
    { emoji: "🅿️", label: "Pangea" },
    { emoji: "❓", label: "Random" },
  ],
  "Mementos": [
    { emoji: "✅", label: "On" },
    { emoji: "❌", label: "Off" },
  ],
  "Age Length": [
  { emoji: "⏱️", label: "Abbreviated" }, 
  { emoji: "⏰", label: "Standard" },     
  { emoji: "⏳", label: "Long" },         
],
  "Disaster Intensity": [
    { emoji: "💧", label: "Light" },
    { emoji: "🌩️", label: "Moderate" },
    { emoji: "🔥", label: "Catastrophic" },
  ],
  "Crisis": [
    { emoji: "✅", label: "On" },
    { emoji: "❌", label: "Off" },
  ],
  "Official Friends/Allies": [
    { emoji: "0️⃣", label: "None" },
    { emoji: "1️⃣", label: "One" },
    { emoji: "2️⃣", label: "Two" },
    { emoji: "3️⃣", label: "Three" },
    { emoji: "4️⃣", label: "Four" },
  ],
  "Draft Mode": [
    { emoji: "✅", label: DraftMode.DRAFT_2 },
    { emoji: "🐍", label: DraftMode.SNAKE },
    { emoji: "❓", label: DraftMode.RANDOM },
  ],
};

export const CIV7_DEFAULT_VOTE_SETTINGS: Record<string, string> = {
  "Other Rules": "TBA",
};