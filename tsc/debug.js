"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncTimeout(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Resolved" + t);
            resolve();
        }, t);
    });
}
// queue.registerFunction(asyncTimeout, "time");
// queue.push(new Task("time", [1000]));
// queue.push(new Task("time", [1000]));
// queue.push(new Task("time", [1000]));
// queue.push(new Task("time", [1000]));
// queue.push(new Task("time", [1000]));
// queue.on("progress", (data) => {
//     console.log(data, 'oi')
// })
// await queue.run();
// (async () => {
//     const ytStream = new Streamer("highest", "/home/bgiannoti/Work/bdv-youtube-mp3/videos", 1000,
//         "/snap/bin/ffmpeg", "MP3");
//     const link = "4oMJIyVOWL4";
//     ytStream.download(link);
//     ytStream.runQueue();
//     ytStream.on("finished", (err, data) => {
//         console.log(JSON.stringify(data));
//     });
//     ytStream.on("error", (error) => {
//         console.log(error);
//     });
//     ytStream.on("progress", (progress) => {
//         console.log(JSON.stringify(progress));
//     });
// })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxTQUFTLFlBQVksQ0FBQyxDQUFNO0lBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsZ0RBQWdEO0FBRWhELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFFeEMsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixLQUFLO0FBRUwscUJBQXFCO0FBRXJCLGlCQUFpQjtBQUVqQixvR0FBb0c7QUFDcEcsc0NBQXNDO0FBQ3RDLGtDQUFrQztBQUVsQywrQkFBK0I7QUFDL0IsMkJBQTJCO0FBRTNCLCtDQUErQztBQUMvQyw2Q0FBNkM7QUFDN0MsVUFBVTtBQUVWLHdDQUF3QztBQUN4Qyw4QkFBOEI7QUFDOUIsVUFBVTtBQUVWLDhDQUE4QztBQUM5QyxpREFBaUQ7QUFDakQsVUFBVTtBQUdWLFFBQVEifQ==