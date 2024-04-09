const doFetch = async (moduleBase, url, headers, formData) => {
  ReadableStream.prototype[Symbol.asyncIterator] ??= async function* () {
    const reader = this.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) return
        yield value
      }
    } finally {
      reader.releaseLock()
    }
  }

  const nodeFetch = window.require(`${moduleBase}libs/node-fetch-cjs/dist/index.js`).default
  const { Headers } = window.require(`${moduleBase}libs/node-fetch-cjs/dist/index.js`)

  // headers
  const myHeaders = new Headers()
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      // console.log(`nodeFetch add header ${key}=>${headers[key]}`)
      myHeaders.append(key, headers[key])
    }
  }

  // options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formData,
  }
  console.log("nodeFetch url=>", url)
  console.log("nodeFetch requestOptions=>", requestOptions)

  const response = await nodeFetch(url, requestOptions)
  const resText = await response.text()
  return resText
}

module.exports = doFetch
