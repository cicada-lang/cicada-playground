import { Library } from "@cicada-lang/cicada"

export interface GitLibrary extends Library {
  files: Record<string, string>
}
