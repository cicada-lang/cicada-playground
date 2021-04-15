import { Library, LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary implements Library {
  requester: InstanceType<typeof Gitlab>
  config: LibraryConfig
  cached_mods: Map<string, Module>
  host: string
  project_id: string | number
  project_dir: string

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    host: string
    project_id: string | number
    project_dir: string
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.host = opts.host
    this.project_id = opts.project_id
    this.project_dir = opts.project_dir
  }

  static async create(opts: {
    host: string
    token: string
    project_id: string | number
    project_dir: string
  }): Promise<GitLabLibrary> {
    const { project_id, project_dir, host, token } = opts

    const requester = new Gitlab({ host, token })

    const file_path = `${project_dir}/library.json`
    const file_entry = await requester.RepositoryFiles.show(
      project_id,
      file_path,
      "master"
    )

    const text = Base64.decode(file_entry.content)
    const config = new LibraryConfig(JSON.parse(text))

    return new GitLabLibrary({
      requester,
      config,
      host,
      project_id,
      project_dir,
    })
  }

  async load(path: string): Promise<Module> {
    const cached = this.cached_mods.get(path)
    if (cached) {
      return cached
    }

    const file_path = `${this.project_dir}/${this.config.src}/${path}`
    const file_entry = await this.requester.RepositoryFiles.show(
      this.project_id,
      file_path,
      "master"
    )

    const text = Base64.decode(file_entry.content)
    const stmts = Syntax.parse_stmts(text)

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

    this.cached_mods.set(path, mod)
    return mod
  }

  async paths(): Promise<Array<string>> {
    const entries = (await this.requester.Repositories.tree(this.project_id, {
      path: this.project_dir,
      recursive: true,
    })) as Record<string, any>[]

    const paths: Array<string> = []
    for (const entry of entries) {
      if (entry.type === "blob" && entry.path.endsWith(".cic")) {
        const prefix = normalize_dir(`${this.project_dir}/${this.config.src}`)
        paths.push(normalize_file(entry.path.slice(prefix.length)))
      }
    }

    return paths
  }

  async load_all(): Promise<Map<string, Module>> {
    await Promise.all((await this.paths()).map((path) => this.load(path)))
    return this.cached_mods
  }
}

function normalize_dir(dir: string): string {
  if (dir.startsWith("/")) return normalize_dir(dir.slice(1))
  if (dir.endsWith("/")) return normalize_dir(dir.slice(0, dir.length - 1))
  else return dir
}

function normalize_file(file: string): string {
  if (file.startsWith("/")) return normalize_dir(file.slice(1))
  else return file
}
