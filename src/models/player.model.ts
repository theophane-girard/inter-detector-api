import { database } from "../config/database";
import { Sequelize, DataTypes, BuildOptions, Model } from "sequelize";
import { CoreService } from "../core/services/core.service";
import { RiotGames } from "../types/riot-games/riot-games";
import { CONFIG } from "../config/config";
import { Match } from "./match.model";
import { Label } from "../models/label.model";

export class Player implements RiotGames.Summoner.SummonerDto {
  public accountId!: string
  public profileIconId!: number
  public revisionDate!: number
  public name!: string
  public id!: string
  public puuid!: string
  public summonerLevel!: number
  public winrate!: number
  public matches!: Match[]
  public league!: RiotGames.League.LeagueDto[]
  public labels!: Label[]
  
    getSoloRankedLeague() : RiotGames.League.LeagueDto {
      return this.league.find(l => l.queueType === CONFIG.unrankedLabel)!
    }
  
    getValue(index: string) : any {
      let rankedSoloLeague: any = this.getSoloRankedLeague()
      if (!rankedSoloLeague) {
        return CONFIG.unrankedLabel
      }
      if (!rankedSoloLeague.hasOwnProperty(index)) {
        console.error(`${index} is not defined in league`, this.league);
        return CONFIG.unrankedLabel
      }
      return rankedSoloLeague[index]
    }
  
    getWins() : number {
      let rankedSoloLeague: RiotGames.League.LeagueDto = this.getSoloRankedLeague()
      if (this.league.length === 0) {
        return -1
      }

      if (!rankedSoloLeague) {
        return -1
      }
      return rankedSoloLeague.wins
    }
  
    getLosses() : number {
      if (this.league.length === 0) {
        return -1
      }
      if (!this.getSoloRankedLeague()) {
        return -1
      }
      return this.getSoloRankedLeague().losses
    }
  
    isOnHotStreak() : boolean {
      if (this.league.length === 0) {
        return false
      }
      return this.getSoloRankedLeague().hotStreak
    }
    
    getTier() : string {
      if (this.league.length === 0) {
        return CONFIG.unrankedLabel
      }
      return CoreService.capitalize(this.getSoloRankedLeague().tier)
    }
    
    getRank() : string {
      if (this.league.length === 0) {
        return CONFIG.unrankedLabel
      }
      return CoreService.capitalize(this.getSoloRankedLeague().tier) + ' ' + this.getSoloRankedLeague().rank
    }
  
    static factory(player: any) : Player {
      let p: Player = new Player()
      for (let property in player) {
        if (player.hasOwnProperty(property)) {
          p[property] = player[property]
          // p.setDataValue(property, player[property])
        }
      }
  
      return p
    }
    
    getAverageKda(): string {
      return `${this.getAverageByIndex('kills')}/${this.getAverageByIndex('deaths')}/${this.getAverageByIndex('assists')}`
    }
    
    getAverageKdaRate(): number {
      return (this.getAverageByIndex('kills') + this.getAverageByIndex('assists')) / this.getAverageByIndex('deaths')
    }
  
    getAverageByIndex(index: string) : number {
      let average = 0
      this.matches.forEach(m => {
        let stat = m.getPlayerParticipant(this.name).stats!
        if (index in stat) {
          average += stat[index]
        }
      })
  
      average = Math.round((average / +(process.env.MATCH_AMOUNT || 1)) * 10 ) /10
      return average
    }
  
    getRankedPositionPicture(match: Match) {
      let tier = CONFIG.rankedPositionTier[this.getTier()]
      tier = tier ? tier : this.getTier()
      let lane = CONFIG.rankedPositionLane[CoreService.capitalize(match.lane)]
      lane = lane ? lane : CoreService.capitalize(match.lane)
    
      return CONFIG.rankedPositionLabel 
      + tier
      + '-' 
      + lane
      + CONFIG.rankedPositionsExtension
    }
}

// export interface PlayerAttributes {
//   id: number;
//   name: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
// export interface PlayerModel extends Model<PlayerAttributes>, PlayerAttributes { }
// export class Player extends Model<PlayerModel, PlayerAttributes> { }

// export type PlayerStatic = typeof Model & {
//   new(values?: object, options?: BuildOptions): PlayerInterface;
// };

// export function PlayerFactory(sequelize: Sequelize): PlayerStatic {
//   return <PlayerStatic>sequelize.define("users", {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//   });
// }

// export const PlayerFactDb = PlayerFactory(database);
export interface PlayerInterface {
  name: string;
}

// Player.init(
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: new DataTypes.STRING(128),
//       allowNull: false,
//     },
//     accountId:{ 
//       type: DataTypes.STRING
//     },
//     profileIconId:{ 
//       type: DataTypes.STRING
//     },
//     revisionDate:{ 
//       type: DataTypes.STRING
//     },
//     puuid:{ 
//       type: DataTypes.STRING
//     },
//     summonerLevel:{ 
//       type: DataTypes.STRING
//     },
//     winrate:{ 
//       type: DataTypes.STRING
//     },
//     // league:{ 
//     //   type: DataTypes.STRING
//     //   .League.LeagueDto[]},
//     // labels:{ 
//     //   type: DataTypes.STRING
//     //   []},
//   },
//   {
//     tableName: "players",
//     sequelize: database, // this bit is important
//   }
// );
// Player.hasMany(Match, {
//   sourceKey: 'id',
//   foreignKey: 'playerd'
// })
// Player.sync({ force: true }).then(() => console.log("Player table created"));