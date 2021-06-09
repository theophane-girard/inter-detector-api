import { Request, Response } from "express";
import { forkJoin, from, Observable, of } from "rxjs";
import { map, mergeMap, switchMap, tap, pluck } from "rxjs/operators";
import { CONFIG } from "../config/config";
import { Label } from "../models/label.model";
import { Match } from "../models/match.model";
import { Player, PlayerInterface } from "../models/player.model";
import { MatchesService } from "../services/matches.service";
import { RiotGames } from "../types/riot-games/riot-games";

export class PlayerController {
  public index(req: Request, res: Response) {
    // Player.findAll<Player>({})
    //   .then((players: Array<Player>) => res.json(players))
    //   .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: PlayerInterface = req.body;

    // Player.create<Player>(params)
    //   .then((player: Player) => res.status(201).json(player))
    //   .catch((err: Error) => res.status(500).json(err));
  }

  public getSummonerByName(req: Request, res: Response) {
    let m = new MatchesService()
    return m.getSummoner(req.params.name).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  public getSummoners(req: Request, res: Response) {
    let m = new MatchesService()
    let playerResquests: Observable<any>[] = []
    let players: Player[] = []

    if (req.body.length === 0) {
      return res.status(500).json({})
    }
    try {
      req.body.forEach((name: string) => {
        let currentSummoner: Player
        let currentMatches: any
        let matchesRequest$: Observable<any>[] = []
        let playerRequest$ = m.getSummoner(name).pipe(
          tap((summoner: RiotGames.Summoner.SummonerDto) => currentSummoner = Player.factory(summoner)),
          switchMap(() => m.getSummonerLeague(currentSummoner.id)),
          tap((league: RiotGames.League.LeagueDto[]) => currentSummoner.league = league),
          switchMap(() => of(currentSummoner)),
          switchMap((summoner: RiotGames.Summoner.SummonerDto) => m.getLastMatchIdList(CONFIG.matchStartIndex, +(process.env.MATCH_AMOUNT || 0), summoner.accountId)),
          tap((matches: RiotGames.MatchList.MatchList) => currentMatches = matches.matches),
          pluck('matches'),
          mergeMap((match: RiotGames.MatchList.MatchReference[]) => match),
          map((match: RiotGames.MatchList.MatchReference) => {
            matchesRequest$.push(m.getMatchById(match.gameId));
            return of({})
          }),
          switchMap(() => forkJoin(matchesRequest$)),
          // map((matches: RiotGames.Match.MatchDetail[]) => this.addToRankedData(matches, currentSummoner, currentMatches, players))
          map((matches: RiotGames.Match.MatchDetail[]) => {
            if (players.every(player => player.id !== currentSummoner.id)) {
              players.push(currentSummoner)
            }
            let player: Player = players.find(p => p.id === currentSummoner.id)!
            if (!player.matches) {
              player.matches = []
            }
            matches.map(match => {
              let m = Match.factory(match)
              let mappingMatch = currentMatches.find(pMatch => pMatch.gameId === match.gameId)
              m.role = mappingMatch.role
              m.champion = mappingMatch.champion
              m.lane = mappingMatch.lane
              player.matches.push(m)
            })
          })
        )
        playerResquests.push(playerRequest$)
      })
  
      // forkJoin(playerResquests).subscribe((data) => this.formatPlayers(players, res))
      forkJoin(playerResquests).subscribe((data) => {
        players = players.map((player: Player) => {
          player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 10) / 10
          // player.labels = this.setPlayerLabels(player)
          return player
        })
        return res.status(200).json(players)
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  getMatchesFromMatchRef(matches: any): Observable<RiotGames.MatchList.MatchReference> {
    let res: any = matches.matches
    return of(res)
  }

  formatPlayers(players: Player[], res: Response) {
    players = players.map((player: Player) => {
      player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 10) / 10
      player.labels = this.setPlayerLabels(player)
      return player
    })
    return res.status(200).json(players)
  }

  addToRankedData(matches, currentSummoner, currentMatches, players: Player[]) {
    if (players.every(player => player.id !== currentSummoner.id)) {
      players.push(currentSummoner)
    }
    let player: Player = players.find(p => p.id === currentSummoner.id)!
    if (!player.matches) {
      player.matches = []
    }
    matches.map(match => {
      let m = Match.factory(match)
      let mappingMatch = currentMatches.find(pMatch => pMatch.gameId === match.gameId)
      m.role = mappingMatch.role
      m.champion = mappingMatch.champion
      m.lane = mappingMatch.lane
      player.matches.push(m)
    })
  }

  setPlayerLabels(player: Player) : Label[] {
    return []
  }

  getSummonerLeague(req: Request, res: Response) {
    let m = new MatchesService()
    return m.getSummonerLeague(req.params.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  getLastMatchRefList(req: Request, res: Response) {
    let m = new MatchesService()
    let matchAmount = process.env.MATCH_AMOUNT ? +process.env.MATCH_AMOUNT : 0
    return m.getLastMatchIdList(CONFIG.matchStartIndex, matchAmount, req.params.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  getMatchById(req: Request, res: Response) {
    let m = new MatchesService()
    return m.getMatchById(+req.params.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }
}