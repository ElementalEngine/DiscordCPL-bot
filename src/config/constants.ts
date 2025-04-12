// General settings.
export const MAX_MENTIONS: number = 14;
export const VOTE_TIMER: number = 1000 * 60 * 2;      // 2 minutes
export const VOTE_TIMER_DRAFT: number = 1000 * 60 * 10; // 10 minutes

export const EMOJI_NO: string = ':x:';
export const EMOJI_YES: string = ':white_check_mark:';
export const EMOJI_QUESTION: string = ':grey_question:';

export const EMOJI_DRAFT_FINISH: string = '✅';
export const EMOJI_DRAFT_CANCEL: string = '❌';
export interface VoteSettingOption {
  emoji: string;
  label: string;
}

// Enum for Draft Mode settings.
export enum DraftMode {
  WITH_TRADE = "With Trade",
  NO_TRADE = "No Trade",
  BLIND = "Blind",
  RANDOM = "Random",
  SNAKE = "Snake",
}

// Vote settings for Civ6 
export const VOTE_SETTINGS_CIV6: Record<string, VoteSettingOption[]> = {
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

  "Map": [
    { emoji: "🅿️", label: "Pangea Classic Ridges" },
    { emoji: "⛰️", label: "Pangea Standard" },
    { emoji: "🏖️", label: "Island Plates" },
    { emoji: "7️⃣", label: "7 seas" },
    { emoji: "💰", label: "Rich Highlands" },
    { emoji: "🇱", label: "Lakes" },
    { emoji: "🗾", label: "Archipelago" },
    { emoji: "🇫", label: "Fractal" },
    { emoji: "🏝", label: "Continents & Island" },
    { emoji: "🗺️", label: "Small Continents" },
    { emoji: "🌋", label: "Primordial" },
    { emoji: "🇹", label: "Tilted Axis" },
    { emoji: "🌊", label: "Inland Sea" },
    { emoji: "💦", label: "Wetlands" },
    { emoji: "🦖", label: "Terra" },
    { emoji: "❓", label: "Random" },
  ],

  "Sea level": [
    { emoji: "🇱", label: "Low" },
    { emoji: "🇸", label: "Standard" },
    { emoji: "🇭", label: "High" },
  ],

  "Disasters": [
    { emoji: "0️⃣", label: "0" },
    { emoji: "1️⃣", label: "1" },
    { emoji: "2️⃣", label: "2" },
    { emoji: "3️⃣", label: "3" },
    { emoji: "4️⃣", label: "4" },
  ],

  "Barbarians mode:": [
    { emoji: "🚫", label: "No barbs" },
    { emoji: "🇨", label: "Civilized barbs" },
    { emoji: "🅱️", label: "Balanced barbs" },
    { emoji: "🇷", label: "Raging barbs" },
  ],

  "CC Voting": [
    { emoji: "⬇️", label: "10 Turns Earlier" },
    { emoji: "➖", label: "No Change" },
    { emoji: "⬆️", label: "10 Turns Later" },
    { emoji: "⏫", label: "20 Turns Later" },
  ],

  "Draft Mode": [
    { emoji: "✅", label: DraftMode.WITH_TRADE },
    { emoji: "🚫", label: DraftMode.NO_TRADE },
    { emoji: "🅱️", label: DraftMode.BLIND },
    { emoji: "❓", label: DraftMode.RANDOM },
  ],
};

export const DEFAULT_VOTE_SETTINGS_CIV6: Record<string, string> = {
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
