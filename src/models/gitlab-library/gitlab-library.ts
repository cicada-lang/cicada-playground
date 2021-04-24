import { GitLibrary } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary implements GitLibrary {
  requester: InstanceType<typeof Gitlab>
  config: LibraryConfig
  cached_mods: Map<string, Module>
  host: string
  library_id: string | number
  dir: string
  files: Record<string, string>

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    host: string
    library_id: string | number
    dir: string
    files: Record<string, string>
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.host = opts.host
    this.library_id = opts.library_id
    this.dir = opts.dir
    this.files = opts.files
  }

  static async create(
    library_id: string | number,
    opts: {
      host?: string
      token?: string
      dir?: string
      files?: Record<string, string>
    } = {}
  ): Promise<GitLabLibrary> {
    const host = opts.host || "https://gitlab.com"
    const dir = opts.dir || ""
    const { token } = opts

    const requester = new Gitlab({ host, token })

    const config = await create_config({
      requester,
      library_id,
      dir,
    })

    const files =
      opts.files || (await checkout({ requester, library_id, dir, config }))

    return new GitLabLibrary({
      requester,
      config,
      host,
      library_id,
      dir,
      files,
    })
  }

  async reload(path: string): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path)
  }

  async load(path: string): Promise<Module> {
    const cached = this.cached_mods.get(path)
    if (cached) {
      return cached
    }

    const text = this.files[path]
    if (!text) {
      throw new Error(`Unknown path: ${path}`)
    }

    const stmts = Syntax.parse_stmts(text)

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

    this.cached_mods.set(path, mod)
    return mod
  }

  async fetch_files(): Promise<Record<string, string>> {
    return await checkout({
      requester: this.requester,
      library_id: this.library_id,
      dir: this.dir,
      config: this.config,
    })
  }

  async fetch_file(path: string): Promise<string> {
    const files = await this.fetch_files()
    return files[path]
  }

  async load_mods(): Promise<Map<string, Module>> {
    const paths = Object.keys(this.files)
    await Promise.all(paths.map((path) => this.load(path)))
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

async function create_config(opts: {
  library_id: string | number
  dir: string
  requester: InstanceType<typeof Gitlab>
}): Promise<LibraryConfig> {
  const { requester, library_id, dir } = opts

  const data = await requester.RepositoryFiles.show(
    library_id,
    normalize_file(`${dir}/library.json`),
    "master"
  )

  const text = Base64.decode(data.content)

  return new LibraryConfig(JSON.parse(text))
}

async function checkout(opts: {
  requester: InstanceType<typeof Gitlab>
  library_id: string | number
  dir: string
  config: LibraryConfig
}): Promise<Record<string, string>> {
  const { requester, library_id, dir, config } = opts

  const entries = (await requester.Repositories.tree(library_id, {
    path: dir,
    recursive: true,
  })) as Record<string, any>[]

  const paths: Array<string> = entries
    .filter((entry) => entry.type === "blob" && entry.path.endsWith(".cic"))
    .map((entry) => {
      const prefix = normalize_dir(`${dir}/${config.src}`)
      const path = normalize_file(entry.path.slice(prefix.length))
      return path
    })

  const files = Object.fromEntries(
    await Promise.all(
      paths.map(async (path) => {
        const file_entry = await requester.RepositoryFiles.show(
          library_id,
          normalize_file(`${dir}/${config.src}/${path}`),
          "master"
        )
        const text = Base64.decode(file_entry.content)
        return [path, text]
      })
    )
  )

  return files
}
