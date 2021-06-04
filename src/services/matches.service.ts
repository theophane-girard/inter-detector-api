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

  getLastMatchIdList(start: number, count: number, account: any) {
    // let config: axios.AxiosRequestConfig = {
    //   data: {
    //     'endIndex': `${count}`,
    //     'beginIndex': `${start}`,
    //     'queue': `${CONFIG.rankedQueueId}`
    //   }
    // }
    // param = param.append('endIndex', `${count}`)
    // param = param.append('beginIndex', `${start}`)
    // param = param.append('queue', `${CONFIG.rankedQueueId}`)

    let url = CONFIG.apiUrlMatchesByAccountId 
      + account.accountId

    // return http.get<RiotGames.MatchList.MatchList>(url, config)
  }

  // getMatchListByChampId(id: number, account: any) {
  //   let param = new HttpParams()
  //   param = param.append('queue', `${CONFIG.rankedQueueId}`)
  //   param = param.append('champion', id)

  //   let url = CONFIG.apiUrlMatchesByAccountId 
  //     + account.accountId

  //   return this.http.get<RiotGames.MatchList.MatchList>(url, { params: param })
  // }

  // getMatchById(id: number) {
  //   let url = CONFIG.apiUrlMatchesById + id

  //   return this.http.get<RiotGames.Match.MatchDetail>(url);
  // }

  getSummoner(summonerName: string) {
    let url = CONFIG.apiUrl + CONFIG.apiUrlGetSummoner + summonerName
    // <RiotGames.Summoner.SummonerDto>
    // api.
    // let promise = this.api.get(url).pipe(
    //   map(response => {
    //     console.log('response', response)
    //     return response
    //   }),
    //   catchError((e: any) => {
    //     console.log('ERRROR ',e)
        
    //   return  throwError(e)
    //   })
    // );
    // console.log('getSummoner');
    
    // return promise
    // CONFIG.apiUrl,
    // headers: {
    //   'X-Riot-Token': process.env.RIOT_APi_KEY,
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*',
    // }
    // return from(fetch(CONFIG.apiUrl + CONFIG.apiUrlGetSummoner + summonerName + '?api_key=' +process.env.RIOT_APi_KEY, {
    //   method: 'GET',
    //   headers: {
    //     'content-type': 'application/json;charset=UTF-8',
    //     'X-Riot-Token': process.env.RIOT_APi_KEY ? process.env.RIOT_APi_KEY : '',
    //     "Access-Control-Allow-Headers": 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
    //   },
    // }))
    
    http.get(CONFIG.apiUrl + CONFIG.apiUrlGetSummoner + summonerName + '?api_key=' +process.env.RIOT_APi_KEY, (res) => console.log(res.statusCode))
    return of({})
    // return from(promise)
  }

  // getSummonerLeague(id: string) {
  //   let url = CONFIG.apiUrlGetSummonerLeague + id

  //   return this.http.get<RiotGames.League.LeagueDto[]>(url);
  // }

  addMatch(matches: RiotGames.Match.MatchDetail[]) {
    this.matches = matches
    this.notifyMatchesChanged()
  }
  
  notifyMatchesChanged() {
    this.matches$.next(this.matches.slice()) 
  }
}
