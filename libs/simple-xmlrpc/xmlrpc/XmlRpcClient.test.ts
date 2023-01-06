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

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable jest/no-done-callback */

import http from "http"
import type { AddressInfo } from "net"

import { XmlRpcClient } from "./XmlRpcClient"
import { XmlRpcFault } from "./XmlRpcFault"

describe("XmlRpcClient", () => {
  it("Can call a method on a live server", (done) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/xml" })
        const data =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><value><string>more.listMethods</string></value></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(data)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}`)
        const res = await client.methodCall("listMethods")
        expect(res).toEqual("more.listMethods")
        server.close()
        // done();
      })
  })

  it("Can call a method with a chunked response", (done) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/xml" })
        const chunk1 =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><value><array><data>" +
          "<value><string>system.listMethods</string></value>" +
          "<value><string>system.methodSignature</string></value>"
        const chunk2 =
          "<value><string>xmlrpc_dialect</string></value>" +
          "</data></array></value></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(chunk1)
        res.write(chunk2)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}/`)
        const res = await client.methodCall("listMethods")
        expect(res).toEqual([
          "system.listMethods",
          "system.methodSignature",
          "xmlrpc_dialect",
        ])
        server.close()
        // done();
      })
  })

  it("Can call a method with UTF-8 encoding", (done) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/xml" })
        const data =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><value><string>here is mr. Snowman: ☃</string></value></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(data)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}`)
        const res = await client.methodCall("listMethods")
        expect(res).toEqual("here is mr. Snowman: ☃")
        server.close()
        // done();
      })
  })

  it("Can call a method with ISO-8859-1 encoding", () => {
    let requestBody = ""
    const server = http
      .createServer((req, res) => {
        req.setEncoding("utf-8")
        req.on("data", (chunk: string) => {
          requestBody += chunk
        })
        res.writeHead(200, { "Content-Type": "text/xml" })
        const data =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><value><string>ok</string></value></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(data)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}`)
        await client.methodCall("multiByte", ["ö"])
        const data =
          '<?xml version="1.0"?>' +
          "<methodCall>" +
          "<methodName>multiByte</methodName>" +
          "<params><param><value><string>ö</string></value></param></params>" +
          "</methodCall>"
        expect(requestBody).toEqual(data)
        server.close()
      })
  })

  it("Can make a multicall", (done) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/xml" })
        const data =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><array><data>" +
          "<array><data><value><string>more.listMethods</string></value></data></array>" +
          "<fault><value><struct>" +
          "<member><name>code</name><value><int>42</int></value></member>" +
          "<member><name>message</name><value><string>Fault Message</string></value></member>" +
          "</struct></value></fault>" +
          "<array><data><value><string>third</string></value></data></array>" +
          "</data></array></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(data)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}`)
        const res = await client.multiMethodCall([
          { methodName: "listMethods", params: [] },
          { methodName: "notFound", params: [] },
          { methodName: "withParams", params: ["a", 1, true] },
        ])
        expect(Array.isArray(res)).toEqual(true)
        expect(res).toHaveLength(3)
        const [res1, res2, res3] = res
        expect(res1).toEqual("more.listMethods")
        expect(res2).toBeInstanceOf(XmlRpcFault)
        expect(res3).toEqual("third")
        server.close()
        // done();
      })
  })

  it("Handles inf/nan", (done) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/xml" })
        const data =
          '<?xml version="2.0" encoding="UTF-8"?>' +
          "<methodResponse>" +
          "<params>" +
          "<param><value><array><data>" +
          "<value><double>42</double></value>" +
          "<value><double>inf</double></value>" +
          "<value><double>-Infinity</double></value>" +
          "<value><double>NaN</double></value>" +
          "<value><double>nan</double></value>" +
          "</data></array></value></param>" +
          "</params>" +
          "</methodResponse>"
        res.write(data)
        res.end()
      })
      .listen(undefined, "localhost", async () => {
        const port = (server.address() as AddressInfo).port
        const client = new XmlRpcClient(`http://localhost:${port}`)
        const res = await client.methodCall("doubleTest")
        const array = res as number[]
        expect(Array.isArray(array)).toBe(true)
        expect(array).toHaveLength(5)
        expect(array[0]).toEqual(42)
        expect(array[1]).toEqual(Infinity)
        expect(array[2]).toEqual(-Infinity)
        expect(array[3]).toEqual(NaN)
        expect(array[4]).toEqual(NaN)
        server.close()
        // done();
      })
  })
})
