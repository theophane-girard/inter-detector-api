import { Request, Response } from "express";
import { Player, PlayerInterface } from "../models/player.model";
import { MatchesService } from "../services/matches.service";

export class PlayerController {
  public index(req: Request, res: Response) {
    Player.findAll<Player>({})
      .then((players: Array<Player>) => res.json(players))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: PlayerInterface = req.body;

    Player.create<Player>(params)
      .then((player: Player) => res.status(201).json(player))
      .catch((err: Error) => res.status(500).json(err));
  }

  public getSummoner(req: Request, res: Response) {
    let m = new MatchesService()
    m.getSummoner(req.params.name)
    // .then(
    .subscribe(
      player => {
        console.log('player', player)
        
        return res.status(200).json({...player})
      },
      error => {
        console.log('error', error)
        
        return  res.status(500).json(error)
      }
    )
    return true
    // .catch( error => {
    //   console.log(error)
      
    //   res.status(500).json(error)
    // })
  }
}