import { Request, Response } from 'express';

export const LobbyLinksController = {
  join(req: Request, res: Response): void {
    const { game, player, session } = req.params;
    res.send(
      `<script>
        window.location.href = 'steam://joinlobby/${game}/${player}/${session}';
      </script>`
    );
  },
};