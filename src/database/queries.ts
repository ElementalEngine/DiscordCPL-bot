import { PlayerStats2Model, IPlayerStats2 } from './models/playerStats2.model';
import { SeasonStatsModel, ISeasonStats } from './models/seasonStats.model';
import { PBCStatsModel, IPBCStats } from './models/pbcStats.model';
import { Edition } from './models/edition.model';
import { GameType } from './models/gameType.model';
import { WaitingMatchModel, ValidatedMatchModel, IMatch } from './models/match.model';

// Seasonal Stats queries
export async function getAllSeasonStats(edition: Edition, gameType: GameType, minGames = 3): Promise<ISeasonStats[]> {
  return SeasonStatsModel.find({ edition, gameType, games: { $gte: minGames } });
}
export async function getSeasonStatsById(edition: Edition, gameType: GameType, id: number): Promise<ISeasonStats> {
  let rec = await SeasonStatsModel.findOne({ _id: id, edition, gameType });
  if (!rec) {
    rec = new SeasonStatsModel({ _id: id, edition, gameType });
    await rec.save();
  }
  return rec;
}
export async function setSeasonStats(stat: ISeasonStats): Promise<void> {
  stat.lastModified = new Date();
  await SeasonStatsModel.replaceOne(
    { _id: stat._id, edition: stat.edition, gameType: stat.gameType },
    stat,
    { upsert: true }
  );
}
export async function resetSeasonStats(edition: Edition, gameType: GameType): Promise<void> {
  await SeasonStatsModel.deleteMany({ edition, gameType });
}

// Lifetime Stats queries remain unchanged
export async function getAllPlayerStats(edition: Edition, gameType: GameType, minGames = 3): Promise<IPlayerStats2[]> {
  return PlayerStats2Model.find({ edition, gameType, games: { $gte: minGames } });
}
export async function getPlayerStatsById(edition: Edition, gameType: GameType, id: number): Promise<IPlayerStats2> {
  let rec = await PlayerStats2Model.findOne({ _id: id, edition, gameType });
  if (!rec) {
    rec = new PlayerStats2Model({ _id: id, edition, gameType });
    await rec.save();
  }
  return rec;
}
export async function setPlayerStats(stat: IPlayerStats2): Promise<void> {
  stat.lastModified = new Date();
  await PlayerStats2Model.replaceOne(
    { _id: stat._id, edition: stat.edition, gameType: stat.gameType },
    stat,
    { upsert: true }
  );
}
export async function resetPlayerStats(edition: Edition, gameType: GameType): Promise<void> {
  await PlayerStats2Model.deleteMany({ edition, gameType });
}

// PBCStats queries
export async function getAllPBCStats(edition: Edition, gameType: GameType): Promise<IPBCStats[]> {
  return PBCStatsModel.find({ edition, gameType });
}
export async function getPBCStatsById(edition: Edition, gameType: GameType, id: number): Promise<IPBCStats> {
  let rec = await PBCStatsModel.findOne({ _id: id, edition, gameType });
  if (!rec) {
    rec = new PBCStatsModel({ _id: id, edition, gameType });
    await rec.save();
  }
  return rec;
}
export async function setPBCStats(stat: IPBCStats): Promise<void> {
  stat.lastModified = new Date();
  await PBCStatsModel.replaceOne(
    { _id: stat._id, edition: stat.edition, gameType: stat.gameType },
    stat,
    { upsert: true }
  );
}

// Match queries unchanged
export async function addMatch(match: IMatch): Promise<IMatch> {
  return WaitingMatchModel.create(match);
}
export async function getMatch(id: number): Promise<IMatch | null> {
  return WaitingMatchModel.findOne({ $or: [{ _id: id }, { validationMsgId: id }] });
}
export async function getMatchHistoryFrom(date: Date): Promise<IMatch[]> {
  const minId = Number(date.getTime());
  return ValidatedMatchModel.find({ _id: { $gte: minId } });
}
export async function getMatchHistoryForPlayer(discordId: number): Promise<IMatch[]> {
  return ValidatedMatchModel.find({ 'players.id': discordId }).sort({ _id: -1 });
}
export async function editMatch(id: number, data: IMatch): Promise<void> {
  const existing = await getMatch(id); if (!existing) throw new Error(`Match ${id} not found`); await WaitingMatchModel.replaceOne({ _id: existing._id }, data);
}
export async function deleteMatch(id: number): Promise<void> {
  await WaitingMatchModel.deleteOne({ _id: id });
}
export async function validateMatch(id: number): Promise<IMatch | null> {
  const match = await getMatch(id); if (!match) return null; await ValidatedMatchModel.create(match); await WaitingMatchModel.deleteOne({ _id: match._id }); return match;
}



// Vote queries // TODO: 