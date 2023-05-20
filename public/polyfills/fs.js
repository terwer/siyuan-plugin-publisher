import mimes from "./mimeDb.js"
import path from "./path.js"
export let readFile = async (file) => {
  let res = await fetch("/api/file/getFile", {
    method: "POST",
    body: JSON.stringify({
      path: file,
    }),
  })
  if (res.status !== 200) {
    console.error(`${file}读取错误`)
  }
  let mime = res.headers.get("Content-Type")
  if (isText(mime)) {
    return await res.text()
  } else {
    let buf = await res.arrayBuffer()
    return buf
  }
}
let mimetype = {}
Object.getOwnPropertyNames(mimes).forEach((type) => {
  let extensions = mimes[type]["extensions"]
  if (extensions) {
    extensions.forEach((extension) => {
      mimetype[extension] = type
    })
  }
})
export let writeFile = async (content, path, flag) => {
  if (!flag) {
    let extension = path.split(".").pop()
    let blob = new Blob([content], {
      type: mimetype[extension] || "text/plain",
    })
    let file = new File([blob], path.split("/").pop(), {
      lastModified: Date.now(),
    })
    return await writeFileDirectly(file, path)
  } else {
    return await writeFileDirectly(content, path)
  }
}
export let writeFileDirectly = async (file, path) => {
  let data = new FormData()
  data.append("path", path)
  data.append("file", file)
  data.append("isDir", false)
  data.append("modTime", Date.now())
  let res = await fetch("/api/file/putFile", {
    method: "POST",
    body: data,
  })
  return await res.json()
}
export let readDir = async (path) => {
  let res = await fetch("/api/file/readDir", {
    method: "POST",
    body: JSON.stringify({
      path: path,
    }),
  })
  if (res.status !== 200) {
    console.error(`${path}读取错误`)
  }
  let { data } = await res.json()
  return data
}
export let exists = async (name) => {
  try {
    let files = await readDir(path.dirname(name))
    let result = files.find((file) => {
      return path.join(path.dirname(name), file.name) === name
    })

    return result || undefined
  } catch (e) {
    console.warn(`工作空间内容读取错误:${e}`)
    return undefined
  }
}
export let mkdir = async (path) => {
  let data = new FormData()
  data.append("path", path)
  data.append("file", "")
  data.append("isDir", true)
  data.append("modTime", Date.now())
  let res = await fetch("/api/file/putFile", {
    method: "POST",
    body: data,
  })
  return await res.json()
}

export function isText(mime) {
  if (mime && mime.startsWith("text")) {
    return true
  }
  if (mime === "application/json") {
    return true
  }
  if (mime === "application/x-javascript") {
    return true
  } else return false
}
let fs = {
  readFile,
  writeFile,
  readDir,
  exists,
  mkdir,
}

export default fs
export let initFile = async (path, data) => {
  if (!(await exists(path))) {
    if (data === undefined) {
      await writeFile("", path)
    } else {
      await writeFile(data, path)
    }
  }
}
