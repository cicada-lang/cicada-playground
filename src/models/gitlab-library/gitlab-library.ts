import { GitLibrary } from "@/models/git-library"
import {
  LibraryConfig,
  Module,
  Doc,
  doc_ext_p,
  doc_from_file,
} from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary extends GitLibrary {
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
    super()
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
      opts.files ||
      (await checkout_files({ requester, library_id, dir, config }))

    return new GitLabLibrary({
      requester,
      config,
      host,
      library_id,
      dir,
      files,
    })
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

async function checkout_files(opts: {
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
    .filter((entry) => entry.type === "blob" && doc_ext_p(entry.path))
    .map((entry) => {
      const prefix = normalize_dir(`${dir}/${config.src}`)
      const path = normalize_file(entry.path.slice(prefix.length))
      return path
    })

  const files = Object.fromEntries(
    await Promise.all(
      paths.map(async (path) => [path, await checkout_file(path, opts)])
    )
  )

  return files
}

async function checkout_file(
  path: string,
  opts: {
    requester: InstanceType<typeof Gitlab>
    library_id: string | number
    dir: string
    config: LibraryConfig
  }
): Promise<string> {
  const { requester, library_id, dir, config } = opts

  const file_entry = await requester.RepositoryFiles.show(
    library_id,
    normalize_file(`${dir}/${config.src}/${path}`),
    "master"
  )

  const text = Base64.decode(file_entry.content)

  return text
}
