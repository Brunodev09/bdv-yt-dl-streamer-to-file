"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Task {
    constructor(key, args, reference) {
        this.key = key;
        this.args = args;
        this.ref = reference;
    }
}
exports.Task = Task;
class Queue extends events_1.EventEmitter {
    constructor() {
        super();
        this.tasks = [];
        this.length = this.tasks.length;
        this.running = false;
        this.funcMap = new Map();
    }
    async push(task) {
        this.tasks.unshift(task);
    }
    registerFunction(f, fId) {
        this.funcMap.set(fId, f);
    }
    async run() {
        this.running = true;
        const initialLength = this.tasks.length;
        let pCounter = 1;
        while (this.tasks.length) {
            for (let i = this.tasks.length - 1; i >= 0; i--) {
                try {
                    if (!this.funcMap.get(this.tasks[i].key)) {
                        pCounter++;
                        this.tasks.splice(i, 1);
                        continue;
                    }
                    await (this.funcMap.get(this.tasks[i].key))(this.tasks[i].args, this.tasks[i].ref);
                    this.emit("progress", { progress: (pCounter / initialLength) * 100 });
                    pCounter++;
                    this.tasks.splice(i, 1);
                }
                catch (e) {
                    this.emit("error", { error: e.message });
                    this.tasks.splice(i, 1);
                    pCounter++;
                    continue;
                }
            }
        }
        this.running = false;
    }
}
exports.queue = new Queue();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBc0M7QUFFdEMsTUFBYSxJQUFJO0lBSWIsWUFBWSxHQUFXLEVBQUUsSUFBVyxFQUFFLFNBQW1CO1FBQ3JELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7SUFDekIsQ0FBQztDQUNKO0FBVEQsb0JBU0M7QUFHRCxNQUFNLEtBQU0sU0FBUSxxQkFBWTtJQUs1QjtRQUNJLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBVTtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsQ0FBNEIsRUFBRSxHQUFXO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxJQUFJO29CQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUN0QyxRQUFRLEVBQUUsQ0FBQzt3QkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLFNBQVM7cUJBQ1o7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuRixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUN0RSxRQUFRLEVBQUUsQ0FBQztvQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzNCO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSxDQUFDO29CQUNYLFNBQVM7aUJBQ1o7YUFDSjtTQUNKO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztDQUNKO0FBRVksUUFBQSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyJ9