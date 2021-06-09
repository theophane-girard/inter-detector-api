import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { CONFIG } from "../config/config";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../types/riot-games/riot-games";
import Axios from  'axios-observable';
import { AxiosRequestConfig } from 'axios';


export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()
  private api = Axios.create({
    baseURL: CONFIG.apiUrl,
    headers: {
      'X-Riot-Token': process.env.RIOT_API_KEY,
      'Content-Type': 'application/json',
    }
  });

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

  getLastMatchIdList(start: number, count: number, id: string) : Observable<RiotGames.MatchList.MatchList> {

    let url = encodeURI(CONFIG.apiUrlMatchesByAccountId + id)
    let options: AxiosRequestConfig = {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_API_KEY ? process.env.RIOT_API_KEY : '',
      },
      params: {
        'endIndex': count,
        'beginIndex': start,
        'queue': CONFIG.rankedQueueId
      }
    }
    console.log('http request', url,options);
    
    return this.api.get(url, options).pipe(map(response => response.data))
  }

  // getMatchListByChampId(id: number, account: any) {
  //   let param = new HttpParams()
  //   param = param.append('queue', `${CONFIG.rankedQueueId}`)
  //   param = param.append('champion', id)

  //   let url = CONFIG.apiUrlMatchesByAccountId 
  //     + account.accountId

  //   return this.http.get<RiotGames.MatchList.MatchList>(url, { params: param })
  // }

  getMatchById(id: any) : Observable<RiotGames.Match.MatchDetail> {
    let url = encodeURI(CONFIG.apiUrlMatchesById + id)
    return this.api.get(url, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_API_KEY ? process.env.RIOT_API_KEY : '',
      }
    }).pipe(map(response => response.data))
  }

  getSummoner(summonerName: string) {
    let url = encodeURI(CONFIG.apiUrlGetSummoner + summonerName)
    let options = {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_API_KEY ? process.env.RIOT_API_KEY : '',
      }
    }
    
    console.log(['http request', url,options]);
    return this.api.get(url, options).pipe(map(response => response.data))
  }

  getSummonerLeague(id: string) : Observable<RiotGames.League.LeagueDto[]> {
    let url = encodeURI(CONFIG.apiUrlGetSummonerLeague + id)
    
    return this.api.get(url, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Riot-Token': process.env.RIOT_API_KEY ? process.env.RIOT_API_KEY : '',
      }
    }).pipe(map(response => response.data))
  }
}
