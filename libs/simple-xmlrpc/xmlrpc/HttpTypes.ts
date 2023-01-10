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

export type HttpRequest = {
  body: string
  method?: string
  url?: string
  socket?: {
    localAddress?: string
    localPort?: number
    remoteAddress?: string
    remotePort?: number
  }
}

export type HttpResponse = {
  statusCode: number
  statusMessage?: string
  headers?: Record<string, string>
  body?: string
  shouldKeepAlive?: boolean
}

export type HttpHandler = (req: HttpRequest) => Promise<HttpResponse>

export interface HttpServer {
  handler: HttpHandler

  url(): string | undefined

  port(): number | undefined

  listen(port?: number, hostname?: string, backlog?: number): Promise<void>

  close(): void
}
