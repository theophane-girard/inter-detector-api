export class CoreService {
  static hydrate(props: any, obj: any) {
    for(let p in props) {
      if (obj.hasOwnProperty(p)) {
        obj[p] = props[p]
      }
    }
    return obj
  }
}