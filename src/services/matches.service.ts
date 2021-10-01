import { forkJoin, Observable, of } from 'rxjs';
import { CONFIG } from "../config/config";
import { map, mergeMap, switchMap, take, tap } from "rxjs/operators";
import { RiotGames } from "../types/riot-games/riot-games";
import Axios from 'axios-observable';
import { AxiosRequestConfig } from 'axios';
import { MatchCsvRequest } from '../models/match-csv-request';
import { MatchToCSV } from '../models/match-to-csv.model';
import moment from 'moment';
import { CoreService } from '../core/services/core.service';
import { HttpRequestLog } from '../models/http-request-log';
import { RiotService } from './riot.service';
import { SummonersService } from './summoners.service';
import { Service, Inject } from 'typedi';
import 'reflect-metadata';
@Service()
export class MatchesService extends RiotService {

  constructor(private sumService: SummonersService) {
    super()
  }

  getMatchesToCSV(params: MatchCsvRequest): Observable<RiotGames.Match.MatchDetail[]> {
    let matchesRequest$: Observable<any>[] = []
    let sumId: string
    return this.sumService.getSummoner(params.name).pipe(
      tap((sum: RiotGames.Summoner.SummonerDto) => sumId = sum.id),
      switchMap((data: RiotGames.Summoner.SummonerDto) => this.getLastMatchIdList(params, data.puuid)),
      mergeMap((matches: string[]) => matches),
      switchMap((match: string) => of(match)),
      map((match: string) => of(matchesRequest$.push(this.getMatchById(match)))),
      switchMap(() => forkJoin(matchesRequest$)),
      take(1),
      map((matches: any[]) => this.formatMatchToCsv(matches, sumId))
    )
  }

  formatMatchToCsv(matches: RiotGames.Match.MatchDto[], id: string): any {
    return matches.map((match: RiotGames.Match.MatchDto) => {
      let summonerToMap = match.info.participants.find((p: RiotGames.Match.ParticipantDto) => p.summonerId + '' === id)
      let date = new Date(match.info.gameCreation)
      let win: boolean|undefined = summonerToMap?.win

      let matchToCSV: MatchToCSV = {
        date: date.toString(),
        day: CONFIG.daysOfWeek[date.getDay()],
        hour: (moment(date)).format('HH:mm:00'),
        win: this.formatWin(win),
        gameNumber: this.getGameNumber(match, matches, date)
      }
      return matchToCSV
    }).sort((a, b)=> this.sortByDateAndGameNumber(a, b))
    .map(match => {
      match.date = moment(new Date(match.date)).format('DD/MM/yyyy')
      return match
    })
  }

  sortByDateAndGameNumber(a, b) {
    let o1 = new Date(a.date).getTime();
    let o2 = new Date(b.date).getTime();
    let p1 = a.gameNumber;
    let p2 = b.gameNumber;

    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  }

  /**
   * 
   * @param params MatchCsvRequest
   * @param id accountId
   * @returns 
   */
  getLastMatchIdList(params: MatchCsvRequest, id: string): Observable<string[]> {

    let url = encodeURI(CONFIG.apiUrlMatchesByPuuidPrefix + id + CONFIG.apiUrlMatchesByPuuidSuffix)
    let options: AxiosRequestConfig = {
      params: CoreService.cleanNullAndUndefined(params),
      baseURL: CONFIG.apiV5Base + CONFIG.apiUrl
    }
    return this.api.get(url, options).pipe(map((response: any) => response.data))
  }

  getMatchById(id: string): Observable<RiotGames.Match.MatchDto> {
    let url = encodeURI(CONFIG.apiUrlMatchesById + id)
    let options: AxiosRequestConfig = {
      baseURL: CONFIG.apiV5Base + CONFIG.apiUrl
    }
    return this.api.get(url, options).pipe(map((response: any) => response.data))
  }

  formatWin(win: boolean|undefined): string {
    return win ? CONFIG.win['Win'].label : CONFIG.win['Fail'].label
  }

  getGameNumber(
    match: RiotGames.Match.MatchDto, 
    matches: RiotGames.Match.MatchDto[], 
    date: Date
  ): number {
    let dayMatches = matches.filter(m => (new Date(m.info.gameCreation)).getDate() === date.getDate())
    dayMatches = dayMatches.sort((a, b) => a.info.gameCreation - b.info.gameCreation)
    return dayMatches.indexOf(match) + 1
  }
}
