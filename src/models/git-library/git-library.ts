import { Library } from "@cicada-lang/cicada"
import { Stage } from "./stage"

export interface GitLibrary extends Library {
  stage: Stage
  commit(): Promise<void>
}
