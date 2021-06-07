import { CONFIG } from "../config/config"
import { LabelClasses } from "./label-classes.model"

export class Label {
  name!: string
  labelClasses!: LabelClasses

  static factory(str: string) {
    return {
      name: CONFIG.label[str],
      labelClasses: {
        hyperCarry: str === 'hyperCarry' ? true : false,
        inter: str === 'inter' ? true : false,
        newAccount: str === 'newAccount' ? true : false,
        troll: str === 'troll' ? true : false,
        carry: str === 'carry' ? true : false,
      }
    }
  }
}
