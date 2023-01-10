/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable jest/no-done-callback */

import http from "http"
import { URL } from "url"

import { XmlRpcFault } from "./XmlRpcFault"
import { XmlRpcServer } from "./XmlRpcServer"
import { XmlRpcValue } from "./XmlRpcTypes"
import { HttpServerNodejs } from "./nodejs/HttpServerNodejs"

describe("XmlRpcServer", () => {
  it("can receive a chunked request", (done) => {
    let handledMethod = false
    const server = new XmlRpcServer(new HttpServerNodejs())
    server.setHandler(
      "testMethod",
      async (methodName, args): Promise<XmlRpcValue> => {
        handledMethod = true
        expect(methodName).toEqual("testMethod")
        expect(args).toEqual(["Param A", "Param B"])
        return await Promise.resolve([1, "test", undefined])
      }
    )
    server.listen().then(() => {
      const port = parseInt(new URL(server.server.url() as string).port)
      expect(port).not.toBeNaN()

      const options = { host: "localhost", port, path: "/", method: "POST" }
      const req = http.request(options)
      const chunk1 =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        "<methodCall>" +
        "<methodName>testMethod</methodName>" +
        "<params>" +
        "<param>" +
        "<value><string>Param A</string></value>" +
        "</param>" +
        "<param>"
      const chunk2 =
        "<value><string>Param B</string></value>" +
        "</param>" +
        "</params>" +
        "</methodCall>"

      req.on("error", (err) =>
        done.onTestFailed(function () {
          console.log(err)
        })
      )
      req.on("response", (res) => {
        expect(handledMethod).toEqual(true)
        let resData = ""
        expect(res.statusCode).toEqual(200)
        res.on("data", (chunk: string) => (resData += chunk))
        res.on("end", () => {
          expect(resData).toEqual(
            '<?xml version="1.0"?><methodResponse><params><param><value><array><data><value><int>1</int></value><value><string>test</string></value><value/></data></array></value></param></params></methodResponse>'
          )
          server.close()
          // done();
        })
      })

      req.write(chunk1)
      req.write(chunk2)
      req.end()
    })
  })

  it("handles inf/nan", (done) => {
    let handledMethod = false
    const server = new XmlRpcServer(new HttpServerNodejs())
    server.setHandler(
      "testMethod",
      async (methodName, args): Promise<XmlRpcValue> => {
        handledMethod = true
        expect(methodName).toEqual("testMethod")
        expect(args).toEqual([42, -Infinity, NaN])
        return await Promise.resolve([1, "test", "", undefined])
      }
    )
    server.listen().then(() => {
      const port = parseInt(new URL(server.server.url() as string).port)
      expect(port).not.toBeNaN()

      const options = { host: "localhost", port, path: "/", method: "POST" }
      const req = http.request(options)
      const body =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        "<methodCall>" +
        "<methodName>testMethod</methodName>" +
        "<params>" +
        "<param>" +
        "<value><double>42</double></value>" +
        "</param>" +
        "<param>" +
        "<value><double>-inf</double></value>" +
        "</param>" +
        "<param>" +
        "<value><double>NaN</double></value>" +
        "</param>" +
        "</params>" +
        "</methodCall>"

      req.on("error", (err) =>
        done.onTestFailed(function () {
          console.log(err)
        })
      )
      req.on("response", (res) => {
        expect(handledMethod).toEqual(true)
        let resData = ""
        expect(res.statusCode).toEqual(200)
        res.on("data", (chunk: string) => (resData += chunk))
        res.on("end", () => {
          expect(resData).toEqual(
            '<?xml version="1.0"?><methodResponse><params><param><value><array><data><value><int>1</int></value><value><string>test</string></value><value><string></string></value><value/></data></array></value></param></params></methodResponse>'
          )
          server.close()
          // done();
        })
      })

      req.end(body)
    })
  })

  it("serializes faults", async () => {
    const server = new XmlRpcServer(new HttpServerNodejs())
    server.setHandler(
      "testMethod1",
      async (methodName, _args): Promise<XmlRpcValue> => {
        expect(methodName).toEqual("testMethod1")
        throw new Error("Example error")
      }
    )
    server.setHandler(
      "testMethod2",
      async (methodName, _args): Promise<XmlRpcValue> => {
        expect(methodName).toEqual("testMethod2")
        throw new XmlRpcFault("Example error", 123)
      }
    )

    await server.listen()
    const port = parseInt(new URL(server.server.url() as string).port)
    expect(port).not.toBeNaN()

    const options = { host: "localhost", port, path: "/", method: "POST" }

    try {
      // Generic error produces generic fault code
      await new Promise<void>((resolve, reject) => {
        const req = http.request(options)
        req.on("error", (err) => reject(err))
        req.on("response", (res) => {
          let resData = ""
          expect(res.statusCode).toEqual(200)
          res.on("data", (chunk: string) => (resData += chunk))
          res.on("end", () => {
            resolve(
              (async () => {
                expect(resData).toContain(
                  `<?xml version="1.0"?><methodResponse><fault><value><struct><member>` +
                    `<name>faultCode</name><value><int>-32500</int></value></member>` +
                    `<member><name>faultString</name><value><string>Error: Example error`
                )
              })()
            )
          })
        })

        req.write(`
          <?xml version="1.0" encoding="UTF-8"?>
          <methodCall>
            <methodName>testMethod1</methodName>
          </methodCall>
        `)
        req.end()
      })

      // Custom XmlRpcFault code is passed through
      await new Promise<void>((resolve, reject) => {
        const req = http.request(options)
        req.on("error", (err) => reject(err))
        req.on("response", (res) => {
          let resData = ""
          expect(res.statusCode).toEqual(200)
          res.on("data", (chunk: string) => (resData += chunk))
          res.on("end", () => {
            resolve(
              (async () => {
                expect(resData).toContain(
                  `<?xml version="1.0"?><methodResponse><fault><value><struct>` +
                    `<member><name>faultCode</name><value><int>123</int></value></member>` +
                    `<member><name>faultString</name><value><string>Example error`
                )
              })()
            )
          })
        })

        req.write(`
          <?xml version="1.0" encoding="UTF-8"?>
          <methodCall>
            <methodName>testMethod2</methodName>
          </methodCall>
        `)
        req.end()
      })
    } finally {
      server.close()
    }
  })
})
