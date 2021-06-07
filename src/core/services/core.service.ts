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
}