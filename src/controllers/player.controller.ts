import { Request, Response } from "express";
import { forkJoin, from, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { CONFIG } from "../config/config";
import { Label } from "../models/label.model";
import { Match } from "../models/match.model";
import { Player, PlayerInterface } from "../models/player.model";
import { MatchesService } from "../services/matches.service";
import { RiotGames } from "../types/riot-games/riot-games";

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
    
    // playerNames = playerNames.filter(name => name.replace(/\s/g, '') !== environment.CREDENTIALS.summonerName.replace(/\s/g, ''))
    req.body.playerNames.forEach((name: string) => {
      let currentSummoner: Player
      let currentMatches: any
      let matchesRequest$: Observable<any>[] = []
      let playerRequest$ = m.getSummoner(name).pipe(
        tap((summoner: RiotGames.Summoner.SummonerDto) => currentSummoner = Player.factory(summoner)),
        switchMap(() => m.getSummonerLeague(currentSummoner.id)),
        tap((league: RiotGames.League.LeagueDto[]) => currentSummoner.league = league),
        switchMap(() => of(currentSummoner)),
        switchMap(summoner => m.getLastMatchIdList(CONFIG.matchStartIndex, +(process.env.MATCH_AMOUNT || 0), summoner)),
        tap((matches: RiotGames.MatchList.MatchList) => currentMatches = matches.matches),
        switchMap((matches: any) => of(matches.matches)),
        map((match: RiotGames.MatchList.MatchReference) => matchesRequest$.push(m.getMatchById(match.gameId))),
        switchMap(() => forkJoin(matchesRequest$)),
        map((matches: RiotGames.Match.MatchDetail[]) => this.addToRankedData(matches, currentSummoner, currentMatches, players)))

        playerResquests.push(playerRequest$)
    });

    forkJoin(playerResquests).subscribe(() => this.formatPlayers(players))
  }
  
  formatPlayers(players: Player[]): void {
    players = players.map((player: Player) => {
      player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 10) / 10
      player.labels = this.setPlayerLabels(player)
      return player
    })
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
}