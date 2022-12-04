/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

declare module "js-yaml" {
  export class Schema {
    constructor(definition: any)
    extend(definition: any): any
  }

  export class YAMLException {
    constructor(reason: any, mark: any)
    toString(compact: any): any
  }

  export const types: {
    binary: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
        predicate: any
        represent: any
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    bool: {
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    float: {
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: any
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    int: {
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          binary: any
          decimal: any
          hexadecimal: any
          octal: any
        }
        resolve: any
        styleAliases: {
          binary: number[]
          decimal: number[]
          hexadecimal: number[]
          octal: number[]
        }
      }
      predicate: any
      represent: {
        binary: any
        decimal: any
        hexadecimal: any
        octal: any
      }
      representName: any
      resolve: any
      styleAliases: {
        "10": string
        "16": string
        "2": string
        "8": string
        bin: string
        dec: string
        hex: string
        oct: string
      }
      tag: string
    }
    map: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    merge: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        kind: string
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    null: {
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    omap: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    pairs: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    seq: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    set: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    str: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
    timestamp: {
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        instanceOf: any
        kind: string
        represent: any
        resolve: any
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }
  }

  export function Type(tag: any, options: any): any

  export function dump(input: any, options: any): any

  export function load(input: any, options: any): any

  export function loadAll(input: any, iterator: any, options: any): any

  export function safeDump(): void

  export function safeLoad(): void

  export function safeLoadAll(): void

  export namespace CORE_SCHEMA {
    const compiledExplicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledImplicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledTypeMap: {
      fallback: {
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      mapping: {
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      multi: {
        fallback: any[]
        mapping: any[]
        scalar: any[]
        sequence: any[]
      }
      scalar: {
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      sequence: {
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
    }

    const explicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const implicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    function extend(definition: any): any
  }

  export namespace DEFAULT_SCHEMA {
    const compiledExplicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledImplicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledTypeMap: {
      fallback: {
        "tag:yaml.org,2002:binary": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:merge": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:omap": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:pairs": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:set": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:timestamp": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            instanceOf: any
            kind: string
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      mapping: {
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:set": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      multi: {
        fallback: any[]
        mapping: any[]
        scalar: any[]
        sequence: any[]
      }
      scalar: {
        "tag:yaml.org,2002:binary": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:merge": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:timestamp": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            instanceOf: any
            kind: string
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      sequence: {
        "tag:yaml.org,2002:omap": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:pairs": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
    }

    const explicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const implicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    function extend(definition: any): any
  }

  export namespace FAILSAFE_SCHEMA {
    const compiledExplicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledImplicit: any[]

    const compiledTypeMap: {
      fallback: {
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      mapping: {
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      multi: {
        fallback: any[]
        mapping: any[]
        scalar: any[]
        sequence: any[]
      }
      scalar: {
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      sequence: {
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
    }

    const explicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const implicit: any[]

    function extend(definition: any): any
  }

  export namespace JSON_SCHEMA {
    const compiledExplicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledImplicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const compiledTypeMap: {
      fallback: {
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      mapping: {
        "tag:yaml.org,2002:map": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      multi: {
        fallback: any[]
        mapping: any[]
        scalar: any[]
        sequence: any[]
      }
      scalar: {
        "tag:yaml.org,2002:bool": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:float": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: any
            resolve: any
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:int": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              binary: any
              decimal: any
              hexadecimal: any
              octal: any
            }
            resolve: any
            styleAliases: {
              binary: number[]
              decimal: number[]
              hexadecimal: number[]
              octal: number[]
            }
          }
          predicate: any
          represent: {
            binary: any
            decimal: any
            hexadecimal: any
            octal: any
          }
          representName: any
          resolve: any
          styleAliases: {
            "10": string
            "16": string
            "2": string
            "8": string
            bin: string
            dec: string
            hex: string
            oct: string
          }
          tag: string
        }
        "tag:yaml.org,2002:null": {
          construct: any
          defaultStyle: string
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            defaultStyle: string
            kind: string
            predicate: any
            represent: {
              camelcase: any
              canonical: any
              empty: any
              lowercase: any
              uppercase: any
            }
            resolve: any
          }
          predicate: any
          represent: {
            camelcase: any
            canonical: any
            empty: any
            lowercase: any
            uppercase: any
          }
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
        "tag:yaml.org,2002:str": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
      sequence: {
        "tag:yaml.org,2002:seq": {
          construct: any
          defaultStyle: any
          instanceOf: any
          kind: string
          multi: boolean
          options: {
            construct: any
            kind: string
          }
          predicate: any
          represent: any
          representName: any
          resolve: any
          styleAliases: {}
          tag: string
        }
      }
    }

    const explicit: Array<{
      construct: any
      defaultStyle: any
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        kind: string
      }
      predicate: any
      represent: any
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    const implicit: Array<{
      construct: any
      defaultStyle: string
      instanceOf: any
      kind: string
      multi: boolean
      options: {
        construct: any
        defaultStyle: string
        kind: string
        predicate: any
        represent: {
          camelcase: any
          canonical: any
          empty: any
          lowercase: any
          uppercase: any
        }
        resolve: any
      }
      predicate: any
      represent: {
        camelcase: any
        canonical: any
        empty: any
        lowercase: any
        uppercase: any
      }
      representName: any
      resolve: any
      styleAliases: {}
      tag: string
    }>

    function extend(definition: any): any
  }
}
