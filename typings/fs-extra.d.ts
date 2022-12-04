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

declare module "fs-extra" {
  export class Dir {
    constructor(...args: any[])

    close(...args: any[]): void

    closeSync(...args: any[]): void

    entries(...args: any[]): void

    read(...args: any[]): void

    readSync(...args: any[]): void
  }

  export class Dirent {
    constructor(...args: any[])

    isBlockDevice(...args: any[]): void

    isCharacterDevice(...args: any[]): void

    isDirectory(...args: any[]): void

    isFIFO(...args: any[]): void

    isFile(...args: any[]): void

    isSocket(...args: any[]): void

    isSymbolicLink(...args: any[]): void
  }

  export class Stats {
    constructor(
      dev: any,
      mode: any,
      nlink: any,
      uid: any,
      gid: any,
      rdev: any,
      blksize: any,
      ino: any,
      size: any,
      blocks: any,
      atimeMs: any,
      mtimeMs: any,
      ctimeMs: any,
      birthtimeMs: any
    )

    isFile(): any
  }

  export const F_OK: number

  export const R_OK: number

  export const W_OK: number

  export const X_OK: number

  export const constants: {
    COPYFILE_EXCL: number
    COPYFILE_FICLONE: number
    COPYFILE_FICLONE_FORCE: number
    F_OK: number
    O_APPEND: number
    O_CREAT: number
    O_DIRECTORY: number
    O_DSYNC: number
    O_EXCL: number
    O_NOCTTY: number
    O_NOFOLLOW: number
    O_NONBLOCK: number
    O_RDONLY: number
    O_RDWR: number
    O_SYMLINK: number
    O_SYNC: number
    O_TRUNC: number
    O_WRONLY: number
    R_OK: number
    S_IFBLK: number
    S_IFCHR: number
    S_IFDIR: number
    S_IFIFO: number
    S_IFLNK: number
    S_IFMT: number
    S_IFREG: number
    S_IFSOCK: number
    S_IRGRP: number
    S_IROTH: number
    S_IRUSR: number
    S_IRWXG: number
    S_IRWXO: number
    S_IRWXU: number
    S_IWGRP: number
    S_IWOTH: number
    S_IWUSR: number
    S_IXGRP: number
    S_IXOTH: number
    S_IXUSR: number
    UV_DIRENT_BLOCK: number
    UV_DIRENT_CHAR: number
    UV_DIRENT_DIR: number
    UV_DIRENT_FIFO: number
    UV_DIRENT_FILE: number
    UV_DIRENT_LINK: number
    UV_DIRENT_SOCKET: number
    UV_DIRENT_UNKNOWN: number
    UV_FS_COPYFILE_EXCL: number
    UV_FS_COPYFILE_FICLONE: number
    UV_FS_COPYFILE_FICLONE_FORCE: number
    UV_FS_O_FILEMAP: number
    UV_FS_SYMLINK_DIR: number
    UV_FS_SYMLINK_JUNCTION: number
    W_OK: number
    X_OK: number
  }

  export function FileReadStream(path: any, options: any, ...args: any[]): any

  export function FileWriteStream(path: any, options: any, ...args: any[]): any

  export function ReadStream(path: any, options: any, ...args: any[]): any

  export function WriteStream(path: any, options: any, ...args: any[]): any

  export function access(args: any): any

  export function accessSync(path: any, mode: any): void

  export function appendFile(args: any): any

  export function appendFileSync(path: any, data: any, options: any): void

  export function chmod(args: any): any

  export function chmodSync(target: any, mode: any): any

  export function chown(args: any): any

  export function chownSync(target: any, uid: any, gid: any): any

  export function close(args: any): any

  export function closeSync(fd: any, ...args: any[]): void

  export function copy(src: String, dest: String): any

  export function copyFile(args: any): any

  export function copyFileSync(src: any, dest: any, mode: any): void

  export function copySync(src: any, dest: any, opts: any): any

  export function cp(src: any, dest: any, options: any, callback: any): void

  export function cpSync(src: any, dest: any, options: any): void

  export function createFile(args: any): any

  export function createFileSync(file: any): void

  export function createLink(args: any): any

  export function createLinkSync(srcpath: any, dstpath: any): any

  export function createReadStream(path: any, options: any): any

  export function createSymlink(args: any): any

  export function createSymlinkSync(srcpath: any, dstpath: any, type: any): any

  export function createWriteStream(path: any, options: any): any

  export function emptyDir(args: any): any

  export function emptyDirSync(dir: any): any

  export function emptydir(args: any): any

  export function emptydirSync(dir: any): any

  export function ensureDir(args: any): any

  export function ensureDirSync(dir: any, options: any): any

  export function ensureFile(args: any): any

  export function ensureFileSync(file: any): void

  export function ensureLink(args: any): any

  export function ensureLinkSync(srcpath: any, dstpath: any): any

  export function ensureSymlink(args: any): any

  export function ensureSymlinkSync(srcpath: any, dstpath: any, type: any): any

  export function exists(filename: any, callback: any): any

  export function existsSync(path: any): any

  export function fchmod(args: any): any

  export function fchmodSync(target: any, mode: any): any

  export function fchown(args: any): any

  export function fchownSync(target: any, uid: any, gid: any): any

  export function fdatasync(args: any): any

  export function fdatasyncSync(fd: any): void

  export function fstat(args: any): any

  export function fstatSync(target: any, options: any): any

  export function fsync(args: any): any

  export function fsyncSync(fd: any): void

  export function ftruncate(args: any): any

  export function ftruncateSync(fd: any, len: any): void

  export function futimes(args: any): any

  export function futimesSync(fd: any, atime: any, mtime: any): void

  export function gracefulify(fs: any, ...args: any[]): any

  export function lchmod(args: any): any

  export function lchmodSync(target: any, mode: any): any

  export function lchown(args: any): any

  export function lchownSync(target: any, uid: any, gid: any): any

  export function link(args: any): any

  export function linkSync(existingPath: any, newPath: any): any

  export function lstat(args: any): any

  export function lstatSync(target: any, options: any): any

  export function lutimes(
    path: any,
    atime: any,
    mtime: any,
    callback: any
  ): void

  export function lutimesSync(path: any, atime: any, mtime: any): void

  export function mkdir(args: any): any

  export function mkdirSync(path: any, options: any): any

  export function mkdirp(args: any): any

  export function mkdirpSync(dir: any, options: any): any

  export function mkdirs(args: any): any

  export function mkdirsSync(dir: any, options: any): any

  export function mkdtemp(args: any): any

  export function mkdtempSync(prefix: any, options: any): any

  export function move(args: any): any

  export function moveSync(src: any, dest: any, opts: any): any

  export function open(args: any): any

  export function openSync(path: any, flags: any, mode: any): any

  export function opendir(args: any): any

  export function opendirSync(path: any, options: any): any

  export function outputFile(path: any, content: any): any

  export function outputFileSync(file: any, args: any): any

  export function outputJSON(args: any): any

  export function outputJSONSync(file: any, data: any, options: any): void

  export function outputJson(args: any): any

  export function outputJsonSync(file: any, data: any, options: any): void

  export function pathExists(args: any): any

  export function pathExistsSync(path: any): any

  export function read(
    fd: any,
    buffer: any,
    offset: any,
    length: any,
    position: any,
    callback: any
  ): any

  export function readFile(path: string, content: any): any

  export function readFileSync(path: any, options: any): any

  export function readJSON(args: any): any

  export function readJSONSync(file: any, options: any): any

  export function readJson(args: any): any

  export function readJsonSync(file: any, options: any): any

  export function readSync(
    fd: any,
    buffer: any,
    offset: any,
    length: any,
    position: any
  ): any

  export function readdir(args: any): any

  export function readdirSync(path: any, options: any): any

  export function readlink(args: any): any

  export function readlinkSync(path: any, options: any): any

  export function readv(fd: any, buffers: any, args: any): any

  export function readvSync(fd: any, buffers: any, position: any): any

  export function realpath(args: any): any

  export function realpathSync(p: any, options: any): any

  export function remove(args: any): any

  export function removeSync(path: any): void

  export function rename(args: any): any

  export function renameSync(oldPath: any, newPath: any): void

  export function rm(args: any): any

  export function rmSync(path: any, options: any): any

  export function rmdir(args: any): any

  export function rmdirSync(path: any, options: any): any

  export function stat(args: any): any

  export function statSync(target: any, options: any): any

  export function symlink(args: any): any

  export function symlinkSync(target: any, path: any, type: any): void

  export function truncate(args: any): any

  export function truncateSync(path: any, len: any): any

  export function unlink(args: any): any

  export function unlinkSync(path: any): void

  export function unwatchFile(filename: any, listener: any): void

  export function utimes(args: any): any

  export function utimesSync(path: any, atime: any, mtime: any): void

  export function watch(filename: any, options: any, listener: any): any

  export function watchFile(filename: any, options: any, listener: any): any

  export function write(fd: any, buffer: any, args: any): any

  export function writeFile(args: any): any

  export function writeFileSync(path: any, data: any, options: any): void

  export function writeJSON(args: any): any

  export function writeJSONSync(file: any, obj: any, options: any): any

  export function writeJson(args: any): any

  export function writeJsonSync(file: any, obj: any, options: any): any

  export function writeSync(
    fd: any,
    buffer: any,
    offsetOrOptions: any,
    length: any,
    position: any
  ): any

  export function writev(fd: any, buffers: any, args: any): any

  export function writevSync(fd: any, buffers: any, position: any): any

  export namespace promises {
    const constants: {
      COPYFILE_EXCL: number
      COPYFILE_FICLONE: number
      COPYFILE_FICLONE_FORCE: number
      F_OK: number
      O_APPEND: number
      O_CREAT: number
      O_DIRECTORY: number
      O_DSYNC: number
      O_EXCL: number
      O_NOCTTY: number
      O_NOFOLLOW: number
      O_NONBLOCK: number
      O_RDONLY: number
      O_RDWR: number
      O_SYMLINK: number
      O_SYNC: number
      O_TRUNC: number
      O_WRONLY: number
      R_OK: number
      S_IFBLK: number
      S_IFCHR: number
      S_IFDIR: number
      S_IFIFO: number
      S_IFLNK: number
      S_IFMT: number
      S_IFREG: number
      S_IFSOCK: number
      S_IRGRP: number
      S_IROTH: number
      S_IRUSR: number
      S_IRWXG: number
      S_IRWXO: number
      S_IRWXU: number
      S_IWGRP: number
      S_IWOTH: number
      S_IWUSR: number
      S_IXGRP: number
      S_IXOTH: number
      S_IXUSR: number
      UV_DIRENT_BLOCK: number
      UV_DIRENT_CHAR: number
      UV_DIRENT_DIR: number
      UV_DIRENT_FIFO: number
      UV_DIRENT_FILE: number
      UV_DIRENT_LINK: number
      UV_DIRENT_SOCKET: number
      UV_DIRENT_UNKNOWN: number
      UV_FS_COPYFILE_EXCL: number
      UV_FS_COPYFILE_FICLONE: number
      UV_FS_COPYFILE_FICLONE_FORCE: number
      UV_FS_O_FILEMAP: number
      UV_FS_SYMLINK_DIR: number
      UV_FS_SYMLINK_JUNCTION: number
      W_OK: number
      X_OK: number
    }

    function access(path: any, mode: any): any

    function appendFile(path: any, data: any, options: any): any

    function chmod(path: any, mode: any): any

    function chown(path: any, uid: any, gid: any): any

    function copyFile(src: any, dest: any, mode: any): any

    function cp(src: any, dest: any, options: any): any

    function lchmod(path: any, mode: any): any

    function lchown(path: any, uid: any, gid: any): any

    function link(existingPath: any, newPath: any): any

    function lstat(path: any, options: any): any

    function lutimes(path: any, atime: any, mtime: any): any

    function mkdir(path: any, options: any): any

    function mkdtemp(prefix: any, options: any): any

    function open(path: any, flags: any, mode: any): any

    function opendir(args: any): any

    function readFile(path: any, options: any): any

    function readdir(path: any, options: any): any

    function readlink(path: any, options: any): any

    function realpath(path: any, options: any): any

    function rename(oldPath: any, newPath: any): any

    function rm(path: any, options: any): any

    function rmdir(path: any, options: any): any

    function stat(path: any, options: any): any

    function symlink(target: any, path: any, type_: any): any

    function truncate(path: any, len: any): any

    function unlink(path: any): any

    function utimes(path: any, atime: any, mtime: any): any

    function watch(filename: any, options: any): void

    function writeFile(path: any, data: any, options: any): any
  }
}
