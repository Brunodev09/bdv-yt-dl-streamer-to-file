"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const progress_stream_1 = __importDefault(require("progress-stream"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const Constants_1 = require("./Constants");
const Queue_1 = require("./Queue");
const Video_1 = __importDefault(require("./Video"));
const Output_1 = __importDefault(require("./Output"));
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
class Streamer extends events_1.EventEmitter {
    constructor(format, quality, out, timeout, codecPath) {
        super();
        this.quality = "highest";
        this.timeout = 1000;
        this.baseURL = Constants_1.CONSTANTS.DEFAULT_YT_BASE_LINK;
        this.quality = quality.toLowerCase();
        this.out = out;
        this.timeout = timeout;
        this.fileNameReplacements = [[/"/g, ""], [/\|/g, ""], [/'/g, ""], [/\//g, ""], [/\?/g, ""], [/:/g, ""], [/;/g, ""]];
        if (codecPath && format.toLowerCase() === Constants_1.CONSTANTS.MP3)
            fluent_ffmpeg_1.default.setFfmpegPath(codecPath);
        if (format.toLowerCase().includes(Constants_1.CONSTANTS.AUDIO))
            this.ext = ".mp3";
        else if (format.toLowerCase().includes(Constants_1.CONSTANTS.VIDEO))
            this.ext = ".flv";
        try {
            fs_1.default.exists(out, (data) => { data ? null : fs_1.default.mkdir(out, () => null); });
        }
        catch (error) {
            console.error(error);
        }
        this.registerToQueue(this.streamDownload, "download");
    }
    cleanFileName(fileName) {
        for (let replacementArr of this.fileNameReplacements) {
            fileName = fileName.replace(replacementArr[0], String(replacementArr[1]));
        }
        return fileName;
    }
    pushToQueue(task) {
        Queue_1.queue.push(task);
    }
    registerToQueue(func, fid) {
        Queue_1.queue.registerFunction(func, fid);
    }
    download(videoId, fileName) {
        this.pushToQueue(new Queue_1.Task("download", [videoId], this));
    }
    async runQueue() {
        await Queue_1.queue.run();
    }
    async streamDownload(...args) {
        return new Promise((resolve, reject) => {
            let [videoId, _this, fileName] = args;
            const url = _this.baseURL + videoId;
            let result = new Output_1.default(videoId, null, null, null, null, null, null);
            ytdl_core_1.default.getInfo(url, (err, info) => {
                if (err)
                    reject(err.message);
                let videoDetailsResponse = info.player_response.videoDetails;
                const video = new Video_1.default(_this.cleanFileName(videoDetailsResponse.title), "Unknown", "Unknown", videoDetailsResponse.thumbnail.thumbnails[0].url || null);
                if (video.videoTitle.indexOf("-") > -1) {
                    var temp = video.videoTitle.split("-");
                    if (temp.length >= 2) {
                        video.artist = temp[0].trim();
                        video.title = temp[1].trim();
                    }
                }
                else {
                    video.title = video.videoTitle;
                }
                video.videoTitle = video.videoTitle.replace(/[^\w\s]/gi, '').replace(/'/g, '').replace(' ', '-');
                video.title = video.title.replace(/[^\w\s]/gi, '').replace(/'/g, '').replace(' ', '-');
                video.artist = video.artist.replace(/[^\w\s]/gi, '').replace(/'/g, '').replace(' ', '-');
                fileName = (fileName ? _this.out + "/" + fileName : _this.out + "/" + (sanitize_filename_1.default(video.videoTitle) || videoDetailsResponse.videoId) + _this.ext);
                result.fileName = fileName;
                result.url = url;
                result.title = video.videoTitle;
                result.artist = video.artist;
                result.title = video.title;
                result.thumbnail = video.thumbnail;
                ytdl_core_1.default.getInfo(url, { quality: _this.quality }, (err, infoNested) => {
                    if (err)
                        reject(err.message);
                    const stream = ytdl_core_1.default.downloadFromInfo(infoNested, {
                        quality: _this.quality,
                        requestOptions: { maxRedirects: 5 }
                    });
                    stream.on("response", (httpResponse) => {
                        const pStream = progress_stream_1.default({
                            length: parseInt(httpResponse.headers["content-length"]),
                            time: _this.timeout
                        });
                        pStream.on("progress", (progress) => {
                            if (progress.percentage === 100) {
                                result.stats = {
                                    transferredBytes: progress.transferred,
                                    runtime: progress.runtime,
                                    averageSpeed: parseFloat(progress.speed.toFixed(2))
                                };
                            }
                            _this.emit("progress", { videoId, progress });
                        });
                        if (_this.ext.includes(Constants_1.CONSTANTS.FLV)) {
                            stream
                                .pipe(pStream)
                                .pipe(fs_1.default.createWriteStream(fileName));
                        }
                        else {
                            const outputOptions = [
                                "-id3v2_version", "4",
                                "-metadata", "title=" + video.title,
                                "-metadata", "artist=" + video.artist
                            ];
                            new fluent_ffmpeg_1.default({
                                source: stream.pipe(pStream)
                            })
                                .audioBitrate(infoNested.formats[0].audioBitrate)
                                .withAudioCodec("libmp3lame")
                                .toFormat(Constants_1.CONSTANTS.MP3)
                                .outputOptions(outputOptions)
                                .on("error", (err) => {
                                reject(err.message);
                            })
                                .on("end", () => {
                                resolve(result);
                            })
                                .saveToFile(fileName);
                        }
                    });
                });
            });
        });
    }
}
exports.Streamer = Streamer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyZWFtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU3RyZWFtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRUFBbUM7QUFDbkMsMERBQTZCO0FBQzdCLHNFQUF1QztBQUN2QywwRUFBeUM7QUFFekMsMkNBQXdDO0FBQ3hDLG1DQUFzQztBQUN0QyxvREFBNEI7QUFDNUIsc0RBQThCO0FBQzlCLG1DQUFzQztBQUN0Qyw0Q0FBb0I7QUFFcEIsTUFBYSxRQUFTLFNBQVEscUJBQVk7SUFRdEMsWUFBWSxNQUFjLEVBQUUsT0FBZSxFQUFFLEdBQVcsRUFBRSxPQUFlLEVBQUUsU0FBa0I7UUFDekYsS0FBSyxFQUFFLENBQUM7UUFOWixZQUFPLEdBQVcsU0FBUyxDQUFDO1FBQzVCLFlBQU8sR0FBVyxJQUFJLENBQUM7UUFPbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBUyxDQUFDLG9CQUFvQixDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwSCxJQUFJLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUsscUJBQVMsQ0FBQyxHQUFHO1lBQUUsdUJBQU0sQ0FBQyxhQUFhLENB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