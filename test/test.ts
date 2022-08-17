function pathJoin(path1: string, path2: string) {
    let path = path1
    const path1LastIdx = path1.lastIndexOf("/")
    // console.log("path1.length=>", path1.length)
    // console.log("path1LastIdx=>", path1LastIdx)
    if (path1LastIdx + 1 == path1.length) {
        path = path1.substring(0, path1LastIdx)
    }

    const path2Idx = path2.indexOf("/")
    // console.log("path2Idx=>", path2Idx)
    if (path2Idx > 0) {
        path = path + "/" + path2
    } else {
        path = path + path2
    }

    return path;
}

const result = pathJoin("https://v4.terwergreen.com/", "post/test.html")
console.log(result)

export default {}