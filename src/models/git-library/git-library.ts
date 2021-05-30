import { Library, Module, Doc, doc_from_file } from "@cicada-lang/cicada"

export abstract class GitLibrary extends Library {
  abstract files: Record<string, string>
  abstract cached_mods: Map<string, Module>

  async fetch_docs(): Promise<Record<string, Doc>> {
    return Object.fromEntries(
      Object.entries(this.files).map(([path, text]) => [
        path,
        doc_from_file({ path, text, library: this }),
      ])
    )
  }

  async fetch_doc(path: string): Promise<Doc> {
    const text = this.files[path]
    return doc_from_file({ path, text, library: this })
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

    const doc = await this.fetch_doc(path)
    const mod = await Module.from_doc(doc)

    this.cached_mods.set(path, mod)
    return mod
  }

  async load_mods(): Promise<Map<string, Module>> {
    const paths = Object.keys(this.files)
    await Promise.all(paths.map((path) => this.load(path)))
    return this.cached_mods
  }
}
