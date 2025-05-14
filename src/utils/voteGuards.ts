export class VoteGuards {
  private static readonly locks = new Set<string>();

  static tryAcquire(channelId: string): boolean {
    if (this.locks.has(channelId)) {
      return false;
    }
    this.locks.add(channelId);
    return true;
  }

  static release(channelId: string): void {
    this.locks.delete(channelId);
  }
}