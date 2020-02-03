# bdv-youtube-mp3

Script to capture yt-dl-core readable streams and write them to ".flv" or ".mp3" files on your disk.

## Description

Basically a module that downloads Youtube audio and/or video to your disk using progress-stream to show you the progress.

## Getting Started

### Dependencies
* Node.js
* progress-stream
* sanitize-filename
* ytdl-core
* fluent-ffmpeg (Optional, only for audio downloads)


### Installing

* Install Node.js and it's dependencies.
```
$: npm i
```

### Examples in Javascript

* Downloading a video:

```
const Streamer = require("./tsc/Streamer").Streamer;

try {
    const link = "4oMJIyVOWL4";
    const outPath = "/home/bgiannoti/Work/bdv-yt-dl-streamer-to-file/videos";
    const format = "Video";
    const quality = "Highest";
    const timeoutBetweenProgressEmits = 1000;

    const ytStream = new Streamer(format, quality, outPath, timeoutBetweenProgressEmits, null);
    ytStream.download(link);
    ytStream.runQueue();
    
    ytStream.on("finished", (err, data) => {
        console.log(JSON.stringify(data));
        process.exit(0);
    });

    ytStream.on("error", (error) => {
        console.log(error);
    });

    ytStream.on("progress", (progress) => {
        console.log(JSON.stringify(progress));
    });
} catch (e) {
    console.error(e)
    process.exit(1);
}

```

* Downloading a audio-only .mp3:

```
const Streamer = require("./tsc/Streamer").Streamer;

try {
    const link = "4oMJIyVOWL4";
    const outPath = "/home/bgiannoti/Work/bdv-yt-dl-streamer-to-file/videos";
    const format = "Audio";
    const quality = "Highest";
    const pathToFfmpeg = "/snap/bin/ffmpeg";
    const timeoutBetweenProgressEmits = 1000;

    const ytStream = new Streamer(format, quality, outPath, timeoutBetweenProgressEmits, pathToFfmpeg);
    ytStream.download(link);
    ytStream.runQueue();
    
    ytStream.on("finished", (err, data) => {
        console.log(data);
        process.exit(0);
    });

    ytStream.on("error", (error) => {
        console.log(error);
    });

    ytStream.on("progress", (progress) => {
        console.log(progress);
    });
} catch (e) {
    console.error(e)
    process.exit(1);
}
```


### Types and definitions

In Javascript:
```
const Streamer = require("./tsc/Streamer").Streamer;
```

In Typescript:
```
import Streamer from "./src/Streamer;
```
The Streamer class is instantiated by passing the following parameters:
 ```
    "format": <const string>,
    "quality": <const string>,
    "out": <string>,
    "timeout": <number>,
    "codecPath"?: <string>
```

- `format` accepts only two possible values: `'Audio'` or `'Video'`.
- `quality` - accepts only two possible values: `'highest'` or `'lowest'`
- `'out'` - the strigified path of the output on your disk you want files to be saved to. If you present a invalid path, the script will try to create it for you.
- `'timeout'` - the timeout between each progress log emit of your downloaded file.
- `'codecPath'` - Not mandatory, only if you want a .mp3 conversion. In that case you need to provide the path in your disk for the ffmpeg installation. (https://www.ffmpeg.org/download.html)


```[Streamer].download(link: <string>): null```
- `download` method is responsible for pushing your link to the download queue.

```[Streamer].runQueue(link: <string>): null```
- `runQueue` method is responsible for actively executing the binded download links in order.


### Events emitted

```[Streamer].on("progress", [Function])```
```[Streamer].on("finished", [Function])```
```[Streamer].on("error", [Function])```

## Authors

Brunodev09 - Bruno Mayol Giannotti

## License

MIT
