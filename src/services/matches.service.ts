import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { CONFIG } from "../config/config";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../types/riot-games/riot-games";
// import axios = require('axios')
// var http = axios.default
import Axios from  'axios-observable';
import * as dotenv from "dotenv";
dotenv.config({ path: '../.env' })
import fetch from 'cross-fetch';
import * as http from "https";
import { IncomingMessage } from 'http';


export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()
  private api = Axios.create({
    // baseURL: CONFIG.apiUrl,
    headers: {
      'X-Riot-Token': process.env.RIOT_APi_KEY,
      'Content-Type': 'application/json',
    }
  });

  // constructor(private http: HttpClient) {
    
  // }

  // updateMatchesToCSV(matchAmount: number) {
  //   let matchesRequest$: Observable<any>[] = []
  //   let summonerName = process.env.SUMMONER_NAME ? process.env.SUMMONER_NAME : ''
  //   this.getSummoner(summonerName).pipe(
  //     switchMap((data: any) => this.getLastMatchIdList(CONFIG.matchStartIndex, matchAmount, data)),
  //     switchMap((response: any) => from(response.matches)),
  //     map((match: RiotGames.Match.MatchDetail) => matchesRequest$.push(this.getMatchById(match.gameId))),
  //     switchMap(() => forkJoin(matchesRequest$)),
  //   ).subscribe((matches: RiotGames.Match.MatchDetail[]) => this.addMatch(matches))
  // }

  getLastMatchIdList(start: number, count: number, account: any) : Observable<RiotGames.MatchList.MatchList> {

    let url = CONFIG.apiUrlMatchesByAccountId 
      + account.accountId
      return Axios.get(encodeURI(url), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'X-Riot-Token': process.env.RIOT_APi_KEY ? process.env.RIOT_APi_KEY : '',
        },
        data: {
          'endIndex': count,
          'beginIndex': start,
          'queue': CONFIG.rankedQueueId
        }
      }).pipe(map(response => response.data))
  }

  // getMatchListByChampId(id: number, account: any) {
  //   let param = new HttpParams()
  //   param = param.append('queue', `${CONFIG.rankedQueueId}`)
  //   param = param.append('champion', id)

  //   let url = CONFIG.apiUrlMatchesByAccountId 
  //     + account.accountId

  //   return this.http.get<RiotGames.MatchList.MatchList>(url, { params: param })
  // }

  getMatchById(id: number) : Observable<RiotGames.Match.MatchDetail> {
    let url = CONFIG.apiUrlMatchesById + id
    return Axios.get(encodeURI(url), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_APi_KEY ? process.env.RIOT_APi_KEY : '',
      }
    }).pipe(map(response => response.data))
  }

  getSummoner(summonerName: string) {
    let url = CONFIG.apiUrl + CONFIG.apiUrlGetSummoner + summonerName
    return Axios.get(encodeURI(url), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_APi_KEY ? process.env.RIOT_APi_KEY : '',
      }
    }).pipe(map(response => response.data))
  }

  getSummonerLeague(id: string) : Observable<RiotGames.League.LeagueDto[]> {
    let url = CONFIG.apiUrlGetSummonerLeague + id
    return Axios.get(encodeURI(url), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_APi_KEY ? process.env.RIOT_APi_KEY : '',
      }
    }).pipe(map(response => response.data))
  }

  addMatch(matches: RiotGames.Match.MatchDetail[]) {
    this.matches = matches
    this.notifyMatchesChanged()
  }
  
  notifyMatchesChanged() {
    this.matches$.next(this.matches.slice()) 
  }
}
