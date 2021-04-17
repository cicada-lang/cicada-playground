import { GitLibrary } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

export class GitHubLibrary implements GitLibrary {
  requester: Octokit
  config: LibraryConfig
  cached_mods?: Map<string, Module>

  constructor(opts: {
    requester: Octokit
    config: LibraryConfig
    cached_mods?: Map<string, Module>
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
  }

  static async create_config(opts: {
    requester: Octokit
    owner: string
    repo: string
    project_dir: string
  }): Promise<LibraryConfig> {
    const { requester, owner, repo, project_dir } = opts

    const { data } = await requester.rest.repos.getContent({
      owner,
      repo,
      path: `${project_dir}/library.json`,
    })

    if (data instanceof Array) {
      throw new Error(
        `Expecting data to be object: ${project_dir}/library.json`
      )
    }

    if (!("content" in data)) {
      throw new Error(`Expecting content in data: ${project_dir}/library.json`)
    }

    const text = Base64.decode(data.content)

    return new LibraryConfig(JSON.parse(text))
  }

  static async create(opts: {
    auth: string
    owner: string
    repo: string
    project_dir: string
  }): Promise<GitHubLibrary> {
    const { auth, owner, repo, project_dir } = opts

    const requester = new Octokit({ auth })

    const config = await GitHubLibrary.create_config({
      requester,
      owner,
      repo,
      project_dir,
    })

    return new GitHubLibrary({
      requester,
      config,
    })
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
