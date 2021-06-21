import { CONFIG } from "../config/config";

export class MatchCsvRequest {
  constructor(
    public champion?: number,
    public queue: number = CONFIG.rankedQueueId,
    public season?: number,
    public endTime?: number,
    public beginTime?: number,
    public endIndex: number = +(process.env.MATCH_AMOUNT || 0),
    public beginIndex: number = CONFIG.matchStartIndex,
    public name: string = ''
  ) {}

  static factory(obj: any) {
    let m = new MatchCsvRequest()
    for (const key in obj) {
      if (obj.hasOwnProperty.call(obj, key)) {
        m[key] = obj[key];
      }
    }
    return m
  }
}