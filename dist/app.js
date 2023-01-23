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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
let videoList;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (videoList) {
        res.json(videoList);
    }
    else {
        videoList = yield (0, utils_1.getVideoList)(constants_1.VIDEO_DIR);
        res.json(videoList);
    }
}));
app.get('/video/:id/poster', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = (0, utils_1.getFileName)(videoList, req.params.id);
    const thumb = yield (0, utils_1.getVideoPoster)(`${constants_1.VIDEO_DIR}/${fileName}`);
    res.sendFile(thumb);
}));
app.get('/video/:id', (req, res) => {
    /*const fileName = getFileName(videoList, req.params.id);
    let range = req.headers.range;

    if(!range) {
        res.status(400).send('Requires range header');
    }

    const path = `${VIDEO_DIR}/${fileName}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const CHUNK_SIZE = 10 ** 6 // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start+CHUNK_SIZE, fileSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    }

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(path, { start, end });
    videoStream.pipe(res);*/
    const videoPath = `${constants_1.VIDEO_DIR}/${(0, utils_1.getFileName)(videoList, req.params.id)}`;
    const videoStat = fs_1.default.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;
    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs_1.default.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs_1.default.createReadStream(videoPath).pipe(res);
    }
});
app.get('/train/video/:id', (req, res) => {
    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['python3 detect.py --source ~/Desktop/assignment/video-streaming-app/server/assets/videos/video1.mp4  --weights weights/yolov5s.pt --conf-thres 0.4']);
    pyProg.stdout.on('data', function (data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
});
app.listen(constants_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    videoList = yield (0, utils_1.getVideoList)(constants_1.VIDEO_DIR);
    return console.log(`Express is listening at http://localhost:${constants_1.PORT}`);
}));
//# sourceMappingURL=app.js.map