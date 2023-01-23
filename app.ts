import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { getVideoPoster, getVideoList, getFileName } from './utils';
import { VIDEO_DIR, PORT} from './constants';

const app = express();
app.use(cors());

let videoList;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/videos', async (req, res) => {
    if(videoList) {
        res.json(videoList);
    } else {
        videoList = await getVideoList(VIDEO_DIR);
        res.json(videoList);
    }
});

app.get('/video/:id/poster', async(req, res) => {
    const fileName = getFileName(videoList, req.params.id);
    const thumb = await getVideoPoster(`${VIDEO_DIR}/${fileName}`);
    res.sendFile(thumb);
});

app.get('/video/:id', (req, res) => {
    const fileName = getFileName(videoList, req.params.id);
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
    videoStream.pipe(res);
    }
});

app.get('/train/video/:id', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['python3 detect.py --source ~/Desktop/assignment/video-streaming-app/server/assets/videos/video1.mp4  --weights weights/yolov5s.pt --conf-thres 0.4']);

    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
})

app.listen(PORT, async () => {
    videoList = await getVideoList(VIDEO_DIR);
  return console.log(`Express is listening at http://localhost:${PORT}`);
});