/// <reference types="node" />
/**
 * 媒体文件
 *
 * ```ts
 *  const url = "./testdata/photo.jpg";
 *  const file = fs.readFileSync(url)
 *  const data = {
 *    name: "20220616-132401-001.jpg",
 *    type: "image/jpeg",
 *    bits: file,
 *    overwrite: true
 *  }
 *
 *  // return
 *  {
 *     attachment_id: '4108',
 *     date_created_gmt: 2022-06-15T21:25:23.000Z,
 *     parent: 0,
 *     link: 'https://terwergreen.files.wordpress.com/2022/06/20220616-132401-001.jpg',
 *     title: '20220616-132401-001.jpg',
 *     caption: '',
 *     description: '',
 *     metadata: { filesize: 113032 },
 *     type: 'image/jpeg',
 *     thumbnail: 'https://terwergreen.files.wordpress.com/2022/06/20220616-132401-001.jpg?w=150',
 *     id: '4108',
 *     file: '20220616-132401-001.jpg',
 *     url: 'http://terwergreen.files.wordpress.com/2022/06/20220616-132401-001.jpg'
 *  }
 * ```
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class MediaObject {
    name: string;
    type: string;
    bits: Buffer;
    constructor(name: string, type: string, bits: Buffer);
}
export default MediaObject;
