import {Base64} from 'js-base64';

export async function testKmsFetch() {
    const form = new URLSearchParams();
    form.append("fdDocTemplateId", "181f20dcfc5744e90b0b8254499b4af0")
    form.append('docSubject', '测试文档内容');
    form.append("docContent", "测试文档内容")
    form.append("fdDocCreator", "180f58069509ef61dd964994e4591dab")
    form.append("authorType", "1")
    form.append("docAuthor", "180f58069509ef61dd964994e4591dab")

    const kmsUsername = ""
    const kmsPassword = ""
    const basicToken = Base64.toBase64(`${kmsUsername}:${kmsPassword}`)

    const response = await fetch("http://localhost:9564/kms16_release/api/kms-multidoc/kmsMultidocKnowledgeRestService/addDoc", {
        body: form,
        headers: {
            Authorization: `Basic ${basicToken}`
        },
        method: "POST"
    })
    const json = await response.json()
    console.log(json)
}