import { Library } from "@cicada-lang/cicada"

export interface GitLibrary extends Library {
  commit(): Promise<void>
}
