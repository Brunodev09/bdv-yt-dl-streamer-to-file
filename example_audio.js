
const Streamer = require("./tsc/Streamer").Streamer;

try {
    const link = "4oMJIyVOWL4";
    const outPath = "/home/bruno/Desktop/bdv-yt-dl-streamer-to-file/videos";
    const format = "Audio";
    const quality = "Highest";
    const pathToFfmpeg = "/snap/bin/ffmpeg";
    const timeoutBetweenProgressEmits = 1000;

    const ytStream = new Streamer(format, quality, outPath, timeoutBetweenProgressEmits, pathToFfmpeg);
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

