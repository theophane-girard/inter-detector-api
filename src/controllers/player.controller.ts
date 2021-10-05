import { Request, Response } from "express";
import { forkJoin, Observable, of } from "rxjs";
import { map, mergeMap, switchMap, tap, pluck, catchError, take } from "rxjs/operators";
import { CONFIG } from "../config/config";
import { DecayParam } from "../models/decay-request";
import { Label } from "../models/label.model";
import { MatchCsvRequest } from "../models/match-csv-request";
import { Match } from "../models/match.model";
import { Player, PlayerInterface } from "../models/player.model";
import { MatchesService } from "../services/matches.service";
import { SummonersService } from "../services/summoners.service";
import { RiotGames } from "../types/riot-games/riot-games";
import { Service, Inject } from 'typedi';
import 'reflect-metadata';

@Service()
export class PlayerController {

  /**
   *
   */
  constructor(
    private matchService: MatchesService,
    private sumService: SummonersService
  ) {
  }
  public index(req: Request, res: Response) {
    // Player.findAll<Player>({})
    //   .then((players: Array<Player>) => res.json(players))
    //   .catch((err: Error) => res.status(500).json(err));
    res.json(true)
  }

  public create(req: Request, res: Response) {
    const params: PlayerInterface = req.body;

    // Player.create<Player>(params)
    //   .then((player: Player) => res.status(201).json(player))
    //   .catch((err: Error) => res.status(500).json(err));
    res.json(true)
  }

  public getSummonerByName(req: Request, res: Response) {
    return this.sumService.getSummoner(req.params.name).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error.status)
    )
  }

  public getSummoners(req: Request, res: Response) {
    let playerResquests: Observable<any>[] = []
    let players: Player[] = []
    let matchRefAndLeagueRequest$: Observable<any>[] = []
    let matchesRequest$: Observable<any>[] = []

    if (!req.body.names) {
      return res.status(500).json(CONFIG.badRequestMessage)
    }

    if (req.body.names.length === 0) {
      return res.status(500).json(CONFIG.badRequestMessage)
    }

    req.body.names.forEach((name: string) => {
      let playerRequest$ = this.sumService.getSummoner(name).pipe(
        switchMap((summoner: RiotGames.Summoner.SummonerDto) => of(players.push(Player.factory(summoner)))),
        catchError(err => of(err))
      )
      playerResquests.push(playerRequest$)
    })

    forkJoin(playerResquests).pipe(
      take(1),
      mergeMap((summoners: any[]) => players),
      map((summoner: RiotGames.Summoner.SummonerDto) => matchRefAndLeagueRequest$.push(
        this.sumService.getSummonerLeague(summoner.id), 
        this.getObsMatchBySum(summoner, matchesRequest$))
      ),
      switchMap((data) => forkJoin(matchRefAndLeagueRequest$)),
      take(1),
      map(data => this.appendLeagueDataToPlayers(data, players)),
      mergeMap(data => forkJoin(matchesRequest$)),
      take(1),
    ).subscribe(
      data => {
        this.appendMatchDataToPlayers(data, players)
        this.appendStatsDataToplayers(data, players)
        res.status(200).json(players)
      },
      error => res.status(error.status.status_code).json(error.status)
    )
  }

  setPlayerLabels(player: Player) : Label[] {
    let labelList: Label[] = []

    if (player.summonerLevel < CONFIG.newAccountValue) {
      labelList.push(Label.factory(CONFIG.label.newAccount.class))
    }

    if (player.getAverageKdaRate() < CONFIG.maxInterKda) {
      labelList.push(Label.factory(CONFIG.label.inter.class))
    }

    if (player.getAverageKdaRate() > CONFIG.minQuiteCarryKda && player.getAverageKdaRate() <= CONFIG.maxQuiteCarryKda) {
      labelList.push(Label.factory(CONFIG.label.carry.class))
    }

    if (player.getAverageKdaRate() > CONFIG.minHyperCarryKda) {
      labelList.push(Label.factory(CONFIG.label.hyperCarry.class))
    }

    if (player.winrate <= CONFIG.maxInterWinRate) {
      labelList.push(Label.factory(CONFIG.label.troll.class))
    }

    return labelList
  }

  getSummonerLeague(req: Request, res: Response) {
    return this.sumService.getSummonerLeague(req.params.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  getLastMatchRefList(req: Request, res: Response) {
    let m: MatchCsvRequest = MatchCsvRequest.factory(req.body)
    return this.matchService.getLastMatchIdList(m, req.body.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  getMatchById(req: Request, res: Response) {
    return this.matchService.getMatchById(req.params.id).subscribe(
      player => res.status(200).json(player),
      error => res.status(500).json(error)
    )
  }

  getObsMatchBySum(summoner: RiotGames.Summoner.SummonerDto, obsArray$: Observable<any>[]) {
    let m: MatchCsvRequest = new MatchCsvRequest()
    return this.matchService.getLastMatchIdList(
      m,
      summoner.accountId
    ).pipe(
      mergeMap((matches: string[]) => matches),
      switchMap((match: string) => of(obsArray$.push(this.getMatchDetailObs(match, summoner.id)))),
    )
  }

  appendLeagueDataToPlayers(data, players: Player[]) {
    let playerLeagues: any[] = data.filter(d => typeof d === 'object')
    players.map(player => {
      let playerLeague = playerLeagues.find((leagues: RiotGames.League.LeagueDto[]) => leagues.find(l => l.summonerId === player.id))
      if (!playerLeague) {
        return
      }
      player.league = playerLeague
    })
  }

  
  appendMatchDataToPlayers(matches: Match[], players) {
    matches.forEach(match => {
      let player: Player = players.find(p => p.id === match.summonerId)
      if (!player) {
        return
      }
      if (!player.matches) {
        player.matches = []
      }
      match.win = match.getMatchResult(player.name)
      match.kda = match.getKDA(player.name)
      player.matches.push(match)
    });
  }

  getMatchDetailObs(game: string, id: string) {
    return this.matchService.getMatchById(game).pipe(map(match => {
      let m = Match.factory(match)
      m.summonerId = id
      // m.role = game.role
      // m.champion = game.champion
      // m.lane = game.lane
      return m
    }))
  }

  appendStatsDataToplayers(matches, players: Player[]) {
    players.forEach(player => {
      player.kda = player.getAverageKda()
      player.kdaRate = player.getAverageKdaRate()
      player.wins = player.getWins()
      player.losses = player.getLosses()
      player.rank = player.getRank()
      player.tier = player.getTier()
      player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 10) / 10
      player.labels = this.setPlayerLabels(player)
    })
  }

  getMatchesToCSV(req: Request, res: Response) {
    let params: MatchCsvRequest
    if (!req.body.name) {
      res.status(500).json(CONFIG.badRequestMessage)
    }
    params = MatchCsvRequest.factory(req.body)
    this.matchService.getMatchesToCSV(params).subscribe(
      (matches: RiotGames.Match.MatchDetail[]) => res.status(200).json(matches),
      error => res.status(error.status.status_code).json(error.status)
    )
  }

  getDecayCountDownDate(req: Request, res: Response) {
    if (!req.body.name) {
      res.status(500).json(CONFIG.badRequestMessage)
    }
    if (!req.body.startTime) {
      res.status(500).json(CONFIG.badRequestMessage)
    }
    if (!req.body.bankDays) {
      res.status(500).json(CONFIG.badRequestMessage)
    }
    this.sumService.getSummonerDecayCountDown(req.body).subscribe(
      (date: Date) => res.status(200).json(date.getTime()),
      error => res.status(error.status.status_code).json(error.status)
    )
  }
}
