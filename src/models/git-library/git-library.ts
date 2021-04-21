import { Library } from "@cicada-lang/cicada"
import { Checkout } from "./checkout"
import { Stage } from "./stage"

export interface GitLibrary extends Library {
  stage: Stage
  checkout: Checkout
  commit(): Promise<void>
}
