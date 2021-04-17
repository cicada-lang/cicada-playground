export class EntranceState {
  servant: null | string = null
  library_id: null | string = null

  library_list: Array<{
    servant: string
    library_id: string
  }> = []
}
