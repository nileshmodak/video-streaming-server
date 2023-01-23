"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileName = exports.getVideoList = exports.getVideoPoster = exports.generatePoster = void 0;
const thumbsupply_1 = __importDefault(require("thumbsupply"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const generatePoster = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thumb = yield thumbsupply_1.default.generateThumbnail(path, {
            cacheDir: constants_1.CACHE_THUMB_DIR
        });
        return thumb;
    }
    catch (e) {
        console.error(e.message);
        return `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;
    }
});
exports.generatePoster = generatePoster;
const getVideoPoster = (path) => __awaiter(void 0, void 0, void 0, function* () {
    let thumb;
    try {
        thumb = yield thumbsupply_1.default.lookupThumbnail(path);
        return thumb;
    }
    catch (e) {
        thumb = yield (0, exports.generatePoster)(path);
        return thumb;
    }
});
exports.getVideoPoster = getVideoPoster;
const getVideoList = (dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dirPath, function (err, files) {
            if (err) {
                console.log('Unable to scan directory: ' + err);
                reject([]);
            }
            const videoFiles = [];
            files.forEach((file, index) => {
                if (path_1.default.extname(file).toLowerCase() === constants_1.EXTENSION) {
                    videoFiles.push({
                        id: index,
                        name: file
                    });
                }
            });
            resolve(videoFiles);
        });
    });
});
exports.getVideoList = getVideoList;
const getFileName = (list, id) => {
    const item = list.find((item) => item.id == id);
    return item && item.name;
};
exports.getFileName = getFileName;
//# sourceMappingURL=utils.js.map