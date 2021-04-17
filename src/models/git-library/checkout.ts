import { LibraryConfig } from "@cicada-lang/cicada"

export class Checkout {
  files: Record<string, string>

  constructor(opts?: { files?: Record<string, string> }) {
    this.files = opts?.files || {}
  }
}