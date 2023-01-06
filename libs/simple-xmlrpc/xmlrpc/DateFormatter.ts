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

export type DateFormatterOptions = {
  colons?: boolean
  hyphens?: boolean
  ms?: boolean
}

export class DateFormatter {
  private _colons = true
  private _hyphens = true
  private _ms = true

  // Regular Expression that dissects an ISO 8601 formatted string into an array of parts
  static ISO8601 =
    /([0-9]{4})([-]?([0-9]{2}))([-]?([0-9]{2}))(T-?([0-9]{2})(((:?([0-9]{2}))?((:?([0-9]{2}))?(\.([0-9]+))?))?)(Z|([+-]([0-9]{2}(:?([0-9]{2}))?)))?)?/

  constructor(options?: DateFormatterOptions) {
    if (options != undefined) {
      this._colons = options.colons ?? this._colons
      this._hyphens = options.hyphens ?? this._hyphens
      this._ms = options.ms ?? this._ms
    }
  }

  /**
   * Converts a date time stamp following the ISO8601 format to a JavaScript Date
   * object.
   *
   * @param {string} time - String representation of timestamp.
   * @return {Date}       - Date object from timestamp.
   */
  decodeIso8601(time: string): Date {
    const dateParts = DateFormatter.ISO8601.exec(time.toString())
    if (dateParts == null) {
      throw new Error(`Expected a ISO8601 datetime but got "${time}"`)
    }

    let date = [
      [dateParts[1], dateParts[3] ?? "01", dateParts[5] ?? "01"].join("-"),
      "T",
      [dateParts[7] ?? "00", dateParts[11] ?? "00", dateParts[14] ?? "00"].join(
        ":"
      ),
      ".",
      dateParts[16] ?? "000",
    ].join("")

    date +=
      dateParts[17] != undefined
        ? dateParts[17] +
          (dateParts[19] != undefined && dateParts[20] == undefined ? "00" : "")
        : "Z"

    return new Date(date)
  }

  /**
   * Converts a JavaScript Date object to an ISO8601 timestamp.
   *
   * @param {Date} date - Date object.
   * @return {string}   - String representation of timestamp.
   */
  encodeIso8601(date: Date): string {
    const parts = DateFormatter.getUTCDateParts(date)

    return [
      [parts[0], parts[1], parts[2]].join(this._hyphens ? "-" : ""),
      "T",
      [parts[3], parts[4], parts[5]].join(this._colons ? ":" : ""),
      this._ms ? "." + parts[6] : "",
      "Z",
    ].join("")
  }

  /**
   * Helper function to get the current timezone to default decoding to
   * rather than UTC. (for backward compatibility)
   *
   * @return {string} - in the format /Z|[+-]\d{2}:\d{2}/
   */
  static formatCurrentOffset(d?: Date): string {
    const offset = (d ?? new Date()).getTimezoneOffset()
    return offset === 0
      ? "Z"
      : [
          offset < 0 ? "+" : "-",
          DateFormatter.zeroPad(Math.abs(Math.floor(offset / 60)), 2),
          ":",
          DateFormatter.zeroPad(Math.abs(offset % 60), 2),
        ].join("")
  }

  /**
   * Helper function to pad the digits with 0s to meet date formatting
   * requirements.
   *
   * @param {number} digit  - The number to pad.
   * @param {number} length - Length of digit string, prefix with 0s if not
   *                          already length.
   * @return {string}       - String with the padded digit
   */
  static zeroPad(digit: number, length: number): string {
    return digit.toString().padStart(length, "0")
  }

  /**
   * Helper function to get an array of zero-padded date parts,
   * in UTC
   *
   * @param {Date} date - Date Object
   * @return {[string, string, string, string, string, string, string]}
   */
  static getUTCDateParts(
    date: Date
  ): [string, string, string, string, string, string, string] {
    return [
      date.getUTCFullYear().toString(),
      DateFormatter.zeroPad(date.getUTCMonth() + 1, 2),
      DateFormatter.zeroPad(date.getUTCDate(), 2),
      DateFormatter.zeroPad(date.getUTCHours(), 2),
      DateFormatter.zeroPad(date.getUTCMinutes(), 2),
      DateFormatter.zeroPad(date.getUTCSeconds(), 2),
      DateFormatter.zeroPad(date.getUTCMilliseconds(), 3),
    ]
  }
}
