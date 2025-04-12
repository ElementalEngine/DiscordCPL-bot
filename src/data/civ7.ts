export type Civ7AgePool = 'Antiquity_Age' | 'Exploration_Age' | 'Modern_Age'

export type Civ7Leader = {
  leader: string
  emoji_ID: string
  Category?: string
}

export type Civ7Civ = {
  civ: string
  emoji_ID: string
  age_pool: Civ7AgePool 
}

export const civ7Leaders: Civ7Leader[] = [
  { leader: "Augustus", emoji_ID: "1359918610557960413", Category: "non" },
  { leader: "Ashoka_World_Renouncer", emoji_ID: "1359918608091713587", Category: "non" },
  { leader: "Ashoka_World_Conqueror", emoji_ID: "1359918605952880813", Category: "non" },
  { leader: "Amina", emoji_ID: "1359918601724760235", Category: "non" },
  { leader: "Ada_Lovelace", emoji_ID: "1359918599535333660", Category: "non" },
  { leader: "Benjamin_Franklin", emoji_ID: "1359920478663344399", Category: "non" },
  { leader: "Catherine_the_Great", emoji_ID: "1359920480273829888", Category: "non" },
  { leader: "Charlemagne", emoji_ID: "1359920482287226910", Category: "non" },
  { leader: "Confucius", emoji_ID: "1359920484484907273", Category: "non" },
  { leader: "Friedrich_Baroque", emoji_ID: "1359920486775132180", Category: "non" },
  { leader: "Friedrich_Oblique", emoji_ID: "1359920489409151048", Category: "non" },
  { leader: "Harriet_Tubman", emoji_ID: "1359920492148035715", Category: "non" },
  { leader: "Hatshepsut", emoji_ID: "1359920494199050440", Category: "non" },
  { leader: "Himiko_High_Shaman", emoji_ID: "1359920495985692844", Category: "non" },
  { leader: "Himiko_Queen_of_Wa", emoji_ID: "1359920497806016634", Category: "non" },
  { leader: "Ibn_Battuta", emoji_ID: "1359920500188381257", Category: "non" },
  { leader: "Isabella", emoji_ID: "1359920502029815938", Category: "non" },
  { leader: "Jos", emoji_ID: "1359922426812825933", Category: "non" },
  { leader: "Lafayette", emoji_ID: "1359922429429944350", Category: "non" },
  { leader: "Machiavelli", emoji_ID: "1359922432131203282", Category: "non" },
  { leader: "Napoleon_Emperor", emoji_ID: "1359922434106458386", Category: "non" },
  { leader: "Napoleon_Revolutionary", emoji_ID: "1359922436380033024", Category: "non" },
  { leader: "Pachacuti", emoji_ID: "1359922438116343928" },
  { leader: "Simon_Bolvar", emoji_ID: "1359922439810842765", Category: "non" },
  { leader: "Tecumseh", emoji_ID: "1359922441563934960", Category: "non" },
  { leader: "Trung_Trac", emoji_ID: "1359922443849826425", Category: "non" },
  { leader: "Xerxes_King_of_Kings", emoji_ID: "1359922445762564307", Category: "non" },
  { leader: "Xerxes_the_Achaemenid", emoji_ID: "1359922447546792960", Category: "non" }
]

export const civ7Civs: Civ7Civ[] = [
  { civ: "Roman", emoji_ID: "1359640472649470112", age_pool: "Antiquity_Age" },
  { civ: "Persian", emoji_ID: "1359640473978798292", age_pool: "Antiquity_Age" },
  { civ: "Mississippian", emoji_ID: "1359640475484557473", age_pool: "Antiquity_Age" },
  { civ: "Maya", emoji_ID: "1359640477166473276", age_pool: "Antiquity_Age" },
  { civ: "Mauryan", emoji_ID: "1359640478651383938", age_pool: "Antiquity_Age" },
  { civ: "Khmer", emoji_ID: "1359640480551403781", age_pool: "Antiquity_Age" },
  { civ: "Han", emoji_ID: "1359640482111553656", age_pool: "Antiquity_Age" },
  { civ: "Greek", emoji_ID: "1359640483730690289", age_pool: "Antiquity_Age" },
  { civ: "Egyptian", emoji_ID: "1359640485311807538", age_pool: "Antiquity_Age" },
  { civ: "Carthaginian", emoji_ID: "1359640486867898378", age_pool: "Antiquity_Age" },
  { civ: "Aksumite", emoji_ID: "1359640587510349914", age_pool: "Antiquity_Age" },
  { civ: "Abbasid", emoji_ID: "1359648834627571925", age_pool: "Exploration_Age" },
  { civ: "Bulgarian", emoji_ID: "1359648979255824434", age_pool: "Exploration_Age" },
  { civ: "Chola", emoji_ID: "1359648830768943288", age_pool: "Exploration_Age" },
  { civ: "Hawaiian", emoji_ID: "1359648829388886196", age_pool: "Exploration_Age" },
  { civ: "Incan", emoji_ID: "1359648827652571326", age_pool: "Exploration_Age" },
  { civ: "Norman", emoji_ID: "1359648821218640192", age_pool: "Exploration_Age" },
  { civ: "Majapahit", emoji_ID: "1359648826167656598", age_pool: "Exploration_Age" },
  { civ: "Ming", emoji_ID: "1359648824297001060", age_pool: "Exploration_Age" },
  { civ: "Mongolian", emoji_ID: "1359648822619537549", age_pool: "Exploration_Age" },
  { civ: "Shawnee", emoji_ID: "1359648819154784477", age_pool: "Exploration_Age" },
  { civ: "Songhai", emoji_ID: "1359648817728852019", age_pool: "Exploration_Age" },
  { civ: "Spanish", emoji_ID: "1359648816134885486", age_pool: "Exploration_Age" },
  { civ: "American", emoji_ID: "1359654873754243122", age_pool: "Modern_Age" },
  { civ: "British", emoji_ID: "1359654872122789968", age_pool: "Modern_Age" },
  { civ: "Bugandan", emoji_ID: "1359654870290010323", age_pool: "Modern_Age" },
  { civ: "French_Imperial", emoji_ID: "1359654867580358706", age_pool: "Modern_Age" },
  { civ: "Meiji_Japanese", emoji_ID: "1359654865596584057", age_pool: "Modern_Age" },
  { civ: "Mexican", emoji_ID: "1359654863612547173", age_pool: "Modern_Age" },
  { civ: "Mughal", emoji_ID: "1359654861636895022", age_pool: "Modern_Age" },
  { civ: "Nepalese", emoji_ID: "1359654860089463005", age_pool: "Modern_Age" },
  { civ: "Prussian", emoji_ID: "1359654858361274448", age_pool: "Modern_Age" },
  { civ: "Qing", emoji_ID: "1359654856394149938", age_pool: "Modern_Age" },
  { civ: "Russian", emoji_ID: "1359654854250725477", age_pool: "Modern_Age" }
]
