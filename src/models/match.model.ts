import { Model } from "sequelize";
import { CONFIG } from "../config/config";
import { RiotGames } from "../types/riot-games/riot-games";

export class Match extends Model implements RiotGames.Match.MatchDetail {
  public mapId!: number;
  public gameCreation!: number;
  public gameId!: number;
  public gameMode!: string;
  public gameType!: string;
  public matchVersion!: string;
  public participantIdentities!: RiotGames.Match.ParticipantIdentity[];
  public participants!: RiotGames.Match.Participant[];
  public platformId!: string;
  public region!: string;
  public seasonId!: number;
  public teams!: RiotGames.Match.Team[];
  public timeline!: RiotGames.Match.Timeline;
  public queueId!: number;
  public gameDuration!: number;
  public gameVersion!: string;

  public role!: string
  public champion!: number
  public lane!: string
  
  static factory(match: any) : Match {
    let p = new Match()
    for (let property in match) {
      if (match.hasOwnProperty(property)) {
        p.setDataValue(property, match[property])
      }
    }

    return p
  }

  getPlayerParticipant(summonerName: string) : RiotGames.Match.Participant {
    let summonerToMap = this.participantIdentities.find(p => p.player.summonerName === summonerName)!
    let summonerParticipantId: number = summonerToMap.participantId
    let res = this.participants.find(p => p.participantId === summonerParticipantId)!
    return res
  }

  getMatchResult(summonerName: string){
    let participant = this.getPlayerParticipant(summonerName)
    let team = this.teams.find(t => t.teamId === participant.teamId)!
    return CONFIG.win[team.win].value
  }

  getKDA(summonerName: string) : string {
    let participant = this.getPlayerParticipant(summonerName)
    return `${participant.stats.kills}/${participant.stats.deaths}/${participant.stats.assists}`
  }

  getTotalScoreRank(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.totalScoreRank
  }

  getTotalPlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.totalPlayerScore
  }

  getCombatPlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.combatPlayerScore
  }

  getObjectivePlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.objectivePlayerScore
  }
}