import { CONFIG } from "../config/config";
import { CoreService } from "../core/services/core.service";

export class MatchCsvRequest {
  constructor(
    public champion?: number,
    public queue: number = CONFIG.rankedQueueId,
    public season?: number,
    public endTime?: any,
    public beginTime?: any,
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
    if (m.beginTime) {
      if (CoreService.isValidDate(new Date(m.beginTime!))) {
        m.beginTime = +new Date(m.beginTime!)
      }
    }

    if (m.endTime) {
      if (CoreService.isValidDate(new Date(m.endTime!))) {
        m.endTime = +new Date(m.endTime!)
      }
    }

    return m
  }
}