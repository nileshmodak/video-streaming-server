import thumbsupply from 'thumbsupply';
import fs from 'fs';
import path from 'path';
import { EXTENSION, CACHE_THUMB_DIR} from './constants';

export const generatePoster = async (path: string) => {
    try {
        const thumb = await thumbsupply.generateThumbnail(path, {
            cacheDir: CACHE_THUMB_DIR
        });
        return thumb;
    } catch(e) {
        console.error(e.message);
        return `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;
    }
}

export const getVideoPoster = async (path: string) => {
    let thumb;
     try {
        thumb = await thumbsupply.lookupThumbnail(path);
        return thumb;
    } catch(e) {
        thumb = await generatePoster(path);
        return thumb;
    }
}

export const getVideoList = async(dirPath: string) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, function (err, files) {
            if (err) {
                console.log('Unable to scan directory: ' + err);
                reject([]);
            }

            const videoFiles = [];

            files.forEach((file, index) => {
                if(path.extname(file).toLowerCase() === EXTENSION) {
                    videoFiles.push({
                        id: index,
                        name: file
                    });
                }
            })
            
            resolve(videoFiles);
        });
    });
}

export const getFileName = (list, id) => {
    const item = list.find((item) => item.id == id);
    return item && item.name;
}