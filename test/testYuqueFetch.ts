export async function testYuqueFetch() {
    const token = ""

    const response = await fetch("https://www.yuque.com/api/v2/hello", {
        headers: {
            "X-Auth-Token": `${token}`
        }
    })
    const json = await response.json()
    console.log(json)
}