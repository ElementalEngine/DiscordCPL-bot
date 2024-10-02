import { Request, Response } from 'express'

export const LobbyLinkController = {
  join: (req: Request, res: Response) => {
    const { game, player, session } = req.params
    res.send(
      `<script>window.location.href = 'steam://joinlobby/${game}/${player}/${session}'</script>`
    )
  },
}
