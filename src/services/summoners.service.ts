import { forkJoin, Observable, of } from "rxjs";
import { map, mergeMap, switchMap, take } from "rxjs/operators";
import { CONFIG } from "../config/config";
import { DecayParam } from "../models/decay-request";
import { MatchCsvRequest } from "../models/match-csv-request";
import { RiotGames } from "../types/riot-games/riot-games";
import { MatchesService } from "./matches.service";
import { RiotService } from "./riot.service";
import { Service, Container } from 'typedi';
import 'reflect-metadata';

@Service()
export class SummonersService extends RiotService {
  constructor(
    private matchesService: MatchesService
  ) {
    super()
  }
  
  getSummoner(summonerName: string): Observable<RiotGames.Summoner.SummonerDto> {
    let url = encodeURI(CONFIG.apiUrlGetSummoner + summonerName)
    return this.api.get(url).pipe(map((response: any) => response.data))
  }

  getSummonerLeague(id: string): Observable<RiotGames.League.LeagueDto[]> {
    let url = encodeURI(CONFIG.apiUrlGetSummonerLeague + id)
    return this.api.get(url).pipe(map((response: any) => response.data))
  }

  getSummonerDecayCountDown(params: any): Observable<any> {
    let matchCsvRequest: MatchCsvRequest = MatchCsvRequest.factory({
      startTime: params.startTime,
      name: params.name,
      count: 100
    })
    return this.getSummoner(params.name).pipe(
      switchMap((data: RiotGames.Summoner.SummonerDto) => Container.get(MatchesService).getLastMatchIdList(matchCsvRequest, data.puuid)),
      switchMap((matches: string[]) => this.getDecayDateFromLastGame(matches, params))
    )
  }

  getDecayDateFromLastGame(matches: string[], params: DecayParam): Observable<Date> {
    let today: Date = new Date()
    let givenLastGamePlayedDate: Date = new Date(+params.startTime * 1000)
    let timeDiff: number = today.getTime() - givenLastGamePlayedDate.getTime();
    let bankDays: number = (params.bankDays + matches.length * CONFIG.bankDaysPerGame)
    let result: Date = new Date(today.setDate(today.getDate() + bankDays))
    return of(new Date(result.setTime(result.getTime() - timeDiff)))
  }
}