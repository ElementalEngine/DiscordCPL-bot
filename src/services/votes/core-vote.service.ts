import { Message, User, GuildMember } from 'discord.js';

export interface VoteSettingOption {
  emoji: string;
  label: string;
}
export interface VoteSetting {
  name: string;
  options: VoteSettingOption[];
}
export interface VoteResults {
  [emoji: string]: string[];
}
export interface VoteOutcome {
  [setting: string]: string;
}

export class CoreVoteService {
  public readonly participants: GuildMember[];
  private readonly voteSettings: VoteSetting[];
  private readonly voteResults: Record<string, VoteResults> = {};
  private readonly finished = new Set<string>();

  constructor(
    participants: GuildMember[],
    voteSettings: VoteSetting[],
    private readonly voteMsg: Message
  ) {
    this.participants = participants;
    this.voteSettings = voteSettings;
    this.initResults();
  }

  private initResults(): void {
    for (const setting of this.voteSettings) {
      this.voteResults[setting.name] = {};
      for (const opt of setting.options) {
        this.voteResults[setting.name][opt.emoji] = [];
      }
    }
    // Special: add an empty "Leader Ban" category if not present
    if (!this.voteResults['Leader Ban']) this.voteResults['Leader Ban'] = {};
  }

  public hasVoted(setting: string, userId: string): boolean {
    return Object.values(this.voteResults[setting] ?? {}).some(ids => ids.includes(userId));
  }

  public recordVote(setting: string, emoji: string, user: User): void {
    if (setting === "Leader Ban") {
      // Leader Ban: allow user to vote on many, so just add if not already there
      if (!this.voteResults[setting][emoji]) this.voteResults[setting][emoji] = [];
      if (!this.voteResults[setting][emoji].includes(user.id))
        this.voteResults[setting][emoji].push(user.id);
      return;
    }
    // Other settings: one vote per user per setting
    const results = this.voteResults[setting];
    for (const key of Object.keys(results)) {
      const idx = results[key].indexOf(user.id);
      if (idx !== -1) results[key].splice(idx, 1);
    }
    results[emoji]?.push(user.id);
  }

  public removeVote(setting: string, emoji: string, user: User): void {
    if (!this.voteResults[setting][emoji]) return;
    const idx = this.voteResults[setting][emoji].indexOf(user.id);
    if (idx !== -1) this.voteResults[setting][emoji].splice(idx, 1);
  }

  public markFinished(userId: string): void {
    this.finished.add(userId);
  }
  public isFinished(userId: string): boolean {
    return this.finished.has(userId);
  }
  public allFinished(): boolean {
    return this.participants.every(m => this.finished.has(m.id));
  }

  // For settings, only announce winner if no more votes possible or all finished
  public getOutcomeForEmbed(
    setting: string,
    options: VoteSettingOption[],
    finishedCount: number,
    totalCount: number
  ): string {
    if (setting === "Leader Ban") {
      const threshold = Math.ceil(totalCount / 2);
      const banned = Object.entries(this.voteResults[setting] || {})
        .filter(([_, users]) => users.length >= threshold)
        .map(([emoji]) => {
          const found = options.find(o => o.emoji === emoji);
          return found ? `${emoji}` : emoji; // Just emoji, no label
        });
      return banned.length ? banned.join(' ') : 'No bans';
    }
    // Regular settings
    const res = this.voteResults[setting];
    if (!res) return 'Pending votes...';

    const allVotes = Object.values(res).reduce((acc, arr) => acc + arr.length, 0);
    // Check for uncatchable winner (majority, or all users finished)
    let winner: string | null = null;
    let max = -1, ties: string[] = [];
    for (const [emoji, users] of Object.entries(res)) {
      if (users.length > max) {
        max = users.length;
        winner = emoji;
        ties = [emoji];
      } else if (users.length === max && max > 0) {
        ties.push(emoji);
      }
    }
    if (max <= 0) return 'Pending votes...';
    // Uncatchable if remaining users can't outvote the current leader(s)
    const remaining = totalCount - allVotes;
    const maybeTie = ties.length > 1;
    if (max > Math.floor(totalCount / 2) || allVotes === totalCount || finishedCount === totalCount) {
      // Break tie randomly if present and all finished
      const chosen = ties.length > 1 && (allVotes === totalCount || finishedCount === totalCount)
        ? ties[Math.floor(Math.random() * ties.length)]
        : winner;
      const found = options.find(o => o.emoji === chosen!);
      return found ? `${chosen} ${found.label}` : chosen!;
    }
    return 'Pending votes...';
  }

  public tallyVotes(): VoteOutcome {
    const outcome: VoteOutcome = {};
    for (const setting of this.voteSettings) {
      const options = setting.options;
      outcome[setting.name] = this.getOutcomeForEmbed(
        setting.name,
        options,
        this.finished.size,
        this.participants.length
      );
    }
    // Special: Leader Ban
    if (this.voteResults['Leader Ban']) {
      const leaderOptions = Object.values(this.voteSettings).find(
        (s) => s.name === 'Leader Ban'
      )?.options ?? [];
      outcome['Leader Ban'] = this.getOutcomeForEmbed(
        'Leader Ban',
        leaderOptions,
        this.finished.size,
        this.participants.length
      );
    }
    return outcome;
  }
}
