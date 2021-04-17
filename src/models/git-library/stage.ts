import { Checkout } from "./checkout"

export class Stage {
  files: Record<string, string>

  constructor(opts?: { files?: Record<string, string> }) {
    this.files = opts?.files || {}
  }

  static from_checkout(checkout: Checkout): Stage {
    return new Stage({
      files: { ...checkout.files },
    })
  }
}
