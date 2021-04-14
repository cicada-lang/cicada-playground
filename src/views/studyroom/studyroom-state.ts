export class StudyroomState {
  n: number

  p: { x: number, y: number }

  constructor(){
    this.n = 0
    this.p = { x: 0, y: 0 }
  }

  inc(): void {
    this.n += 1
  }

  move(): void {
    this.p.x += 1
    this.p.y += 1
  }

  get add1(): number {
    return this.n + 1
  }
}
