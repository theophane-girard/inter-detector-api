import { forkJoin, Observable, of } from 'rxjs';
import { CONFIG } from "../config/config";
import { map, mergeMap, pluck, switchMap, take, tap } from "rxjs/operators";
import { RiotGames } from "../types/riot-games/riot-games";
import Axios from 'axios-observable';
import { AxiosRequestConfig } from 'axios';
import { MatchCsvRequest } from '../models/match-csv-request';
import { MatchToCSV } from '../models/match-to-csv.model';
import moment from 'moment';
import { CoreService } from '../core/services/core.service';
import { HttpRequestLog } from '../models/http-request-log';

export class MatchesService {
  private api = Axios.create({
    baseURL: CONFIG.apiUrl,
    headers: {
      'X-Riot-Token': process.env.RIOT_API_KEY,
      'Content-Type': 'application/json',
    }
  });

  constructor() {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error.response.data || error)
    );
    this.api.interceptors.request.use(
      (request: AxiosRequestConfig) => {
        console.log(HttpRequestLog.factory(request))
        return request
      },
      (error) => Promise.reject(error.response.data || error)
    );
  }

  getMatchesToCSV(params: MatchCsvRequest): Observable<RiotGames.Match.MatchDetail[]> {
    let matchesRequest$: Observable<any>[] = []
    let sumId: string
    return this.getSummoner(params.name).pipe(
      tap((sum: RiotGames.Summoner.SummonerDto) => sumId = sum.id),
      switchMap((data: RiotGames.Summoner.SummonerDto) => this.getLastMatchIdList(params, data.accountId)),
      pluck('matches'),
      mergeMap((match: RiotGames.MatchList.MatchReference[]) => match),
      switchMap((match: RiotGames.MatchList.MatchReference) => of(match)),
      map((match: RiotGames.MatchList.MatchReference) => of(matchesRequest$.push(this.getMatchById(match.gameId)))),
      switchMap(() => forkJoin(matchesRequest$)),
      take(1),
      map(matches => this.formatMatchToCsv(matches, sumId))
    )
  }

  formatMatchToCsv(matches: any[], id: string): any {
    return matches.map((match: RiotGames.Match.MatchDetail) => {
      let summonerToMap = match.participantIdentities.find((p: RiotGames.Match.ParticipantIdentity) => p.player.summonerId + '' === id)
      let date = new Date(match.gameCreation)
      let summonerParticipantId: number = summonerToMap!.participantId
      let participant = match.participants.find(p => p.participantId === summonerParticipantId)
      let win = match.teams.find(team => team.teamId === participant!.teamId)!.win

      let matchToCSV: MatchToCSV = {
        date: (moment(date)).format('DD/MM/yyyy'),
        day: CONFIG.daysOfWeek[date.getDay()],
        hour: (moment(date)).format('HH:mm:00'),
        win: this.formatWin(win),
        gameNumber: this.getGameNumber(match, matches, date)
      }
      return matchToCSV
    }).sort((a, b)=> this.sortByDateAndGameNumber(a, b))
  }

  sortByDateAndGameNumber(a, b) {
    let o1 = a.date;
    let o2 = b.date;
    let p1 = a.gameNumber;
    let p2 = b.gameNumber;

    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  }

  getLastMatchIdList(params: MatchCsvRequest, id: string): Observable<RiotGames.MatchList.MatchList> {

    let url = encodeURI(CONFIG.apiUrlMatchesByAccountId + id)
    let options: AxiosRequestConfig = {
      params: CoreService.cleanNullAndUndefined(params)
    }
    return this.api.get(url, options).pipe(map(response => response.data))
  }

  getMatchById(id: any): Observable<RiotGames.Match.MatchDetail> {
    let url = encodeURI(CONFIG.apiUrlMatchesById + id)
    return this.api.get(url).pipe(map(response => response.data))
  }

  getSummoner(summonerName: string) {
    let url = encodeURI(CONFIG.apiUrlGetSummoner + summonerName)
    return this.api.get(url).pipe(map(response => response.data))
  }

  getSummonerLeague(id: string): Observable<RiotGames.League.LeagueDto[]> {
    let url = encodeURI(CONFIG.apiUrlGetSummonerLeague + id)
    return this.api.get(url).pipe(map(response => response.data))
  }

  formatWin(winner: string): string {
    return CONFIG.win[winner].label
  }

  getGameNumber(
    match: RiotGames.Match.MatchDetail, 
    matches: RiotGames.Match.MatchDetail[], 
    date: Date
  ): number {
    let dayMatches = matches.filter(m => (new Date(m.gameCreation)).getDate() === date.getDate())
    dayMatches = dayMatches.sort((a, b) => a.gameCreation - b.gameCreation)
    return dayMatches.indexOf(match) + 1
  }
}
