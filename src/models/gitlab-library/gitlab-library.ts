import { Library, LibraryConfig, Module } from "@cicada-lang/cicada"

export class GitLabLibrary implements Library {
  config: LibraryConfig

  constructor() {
    this.config = new LibraryConfig({
      name: "mock-gitlab-library",
      date: "2021-04-14",
    })
  }

  load(path: string): Promise<Module> {
    throw new Error("TODO")
  }

  paths(): Promise<Array<string>> {
    throw new Error("TODO")
  }

  load_all(opts?: { verbose?: boolean }): Promise<Map<string, Module>> {
    throw new Error("TODO")
  }
}
