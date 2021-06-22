export class CoreService {
  static hydrate(props: any, obj: any) {
    for(let p in props) {
      if (obj.hasOwnProperty(p)) {
        obj[p] = props[p]
      }
    }
    return obj
  }
  static capitalize(word: string) : string {
    const lower = word.toLowerCase()
    return word.charAt(0).toUpperCase() + lower.slice(1)
  }

  static isValidDate(d: any) {
    return !isNaN(d) && d instanceof Date;
  }

  static cleanNullAndUndefined(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === 'undefined' || obj[propName] === 'null') {
        delete obj[propName];
      }
    }
    return obj
  }
}