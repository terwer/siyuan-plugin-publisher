export default blobFromSync;
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 */
export function blobFromSync(path: string, type?: string): Blob;
import { Blob } from "./index.js";
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 * @returns {Promise<Blob>}
 */
export function blobFrom(path: string, type?: string): Promise<Blob>;
/**
 * Creates a temporary blob backed by the filesystem.
 * NOTE: requires node.js v14 or higher to use FinalizationRegistry
 *
 * @param {*} data Same as fs.writeFile data
 * @param {BlobPropertyBag & {signal?: AbortSignal}} options
 * @param {AbortSignal} [signal] in case you wish to cancel the write operation
 * @returns {Promise<Blob>}
 */
export function createTemporaryBlob(data: any, { signal, type }?: BlobPropertyBag & {
    signal?: AbortSignal;
}): Promise<Blob>;
import { File } from "./file.js";
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 * @returns {Promise<File>}
 */
export function fileFrom(path: string, type?: string): Promise<File>;
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 */
export function fileFromSync(path: string, type?: string): File;
/**
 * Creates a temporary File backed by the filesystem.
 * Pretty much the same as constructing a new File(data, name, options)
 *
 * NOTE: requires node.js v14 or higher to use FinalizationRegistry
 * @param {*} data
 * @param {string} name
 * @param {FilePropertyBag & {signal?: AbortSignal}} opts
 * @returns {Promise<File>}
 */
export function createTemporaryFile(data: any, name: string, opts: FilePropertyBag & {
    signal?: AbortSignal;
}): Promise<File>;
export { Blob, File };
