import { GitLibrary } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Octokit } from "@octokit/rest"

export class GitHubLibrary implements GitLibrary {
  config: LibraryConfig

  constructor(opts: {
    config: LibraryConfig
    cached_mods?: Map<string, Module>
  }) {
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
  }

  async load(path: string, opts?: { force?: boolean }): Promise<Module> {
    throw new Error("TODO")
  }

  async fetch_files(): Promise<Map<string, string>> {
    throw new Error("TODO")
  }

  async load_mods(): Promise<Map<string, Module>> {
    throw new Error("TODO")
  }

  async commit(): Promise<void> {
    throw new Error("TODO")
  }
}
