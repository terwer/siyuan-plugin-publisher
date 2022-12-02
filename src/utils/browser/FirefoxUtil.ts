/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/**
 * 检测是否运行在Firefox插件中
 */
export function isInFirefoxExtension(): boolean {
  // @ts-expect-error
  return typeof InstallTrigger !== "undefined"
}

export const firefoxXmlHttpRequest = async (obj: any): Promise<any> => {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(obj.method || "GET", obj.url)
    if (obj.headers) {
      Object.keys(obj.headers).forEach((key) => {
        xhr.setRequestHeader(key, obj.headers[key])
      })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.statusText)
      }
    }
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send(obj.body)
  })
}
