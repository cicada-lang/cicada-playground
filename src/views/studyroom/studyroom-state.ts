export class StudyroomState {
  n: number

  constructor(){
    this.n = 0
  }

  inc(): void {
    this.n += 1
  }

  get add1(): number {
    return this.n + 1
  }
}
