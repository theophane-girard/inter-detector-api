import { CONFIG } from "../config/config";
import { CoreService } from "../core/services/core.service";

export class MatchCsvRequest {
  constructor(
    public champion?: number,
    public queue: number = CONFIG.rankedQueueId,
    public season?: number,
    public endTime?: any,
    public startTime?: any,
    public count?: number,
    public start: number = CONFIG.matchStartIndex,
    public name: string = ''
  ) {}

  static factory(obj: any) {
    let m = new MatchCsvRequest()
    for (const key in obj) {
      if (obj.hasOwnProperty.call(obj, key)) {
        m[key] = obj[key];
      }
    }
    if (m.startTime) {
      if (CoreService.isValidDate(new Date(m.startTime!))) {
        m.startTime = +new Date(m.startTime!) / 100000
      }
    }

    if (m.endTime) {
      if (CoreService.isValidDate(new Date(m.endTime!))) {
        m.endTime = +new Date(m.endTime!) / 100000
      }
    }

    return m
  }
}