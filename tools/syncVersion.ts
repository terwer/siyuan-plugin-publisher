import fs from "fs"
import minimist from "minimist"

class SyncVersion {
  /**
   * 同步根目录的版本号到指定指定文件
   *
   * @param filename - 问号路径，相对于根目录
   * @param versionField - 版本字段名
   * @param newVersion - 可选，传递之后将使用传递的版本号，不使用默认的 package.json 版本号
   */
  async parseJSON(filename: string, versionField: string, newVersion: string | undefined): Promise<void> {
    try {
      // Read JSON from file
      const rawData = await fs.promises.readFile(filename)
      const data = JSON.parse(rawData.toString())

      // Modify version field in JSON data
      const pkgData = await fs.promises.readFile("package.json")
      const pkg = JSON.parse(pkgData.toString())
      if (!newVersion) {
        newVersion = pkg["version"]
      }

      if (data[versionField] === newVersion) {
        console.log("版本号已经是最新，无需修改")
        return
      }

      data[versionField] = newVersion

      // Write modified JSON back to file
      await fs.promises.writeFile(filename, JSON.stringify(data, null, 2))
      console.log(`${filename} 修改完毕，新版本为：${newVersion}`)
    } catch (err) {
      console.error(`Error parsing JSON file: ${err}`)
    }
  }
}

;(async () => {
  const args = minimist(process.argv.slice(2))
  const newVersion = args.version || args.v || undefined

  const syncVersion = new SyncVersion()
  await syncVersion.parseJSON("plugins/publisher-main/package.json", "version", newVersion)
  await syncVersion.parseJSON("plugins/publisher-main/public/plugin.json", "version", newVersion)
})()
