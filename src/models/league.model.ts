import { RiotGames } from "../types/riot-games/riot-games";

export class League implements RiotGames.League.LeagueDto {
  public leagueId!: string;
  public summonerId!: string;
  public summonerName!: string;
  public queueType!: string;
  public tier!: string;
  public rank!: string;
  public leaguePoints!: number;
  public wins!: number;
  public losses!: number;
  public hotStreak!: boolean;
  public veteran!: boolean;
  public freshBlood!: boolean;
  public inactive!: boolean;
  public miniSeries!: RiotGames.League.MiniSeriesDto;

  static factory(label: string) {
    let l = new League()
    l.tier = label
    return l
  }
}