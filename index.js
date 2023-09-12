const stopwatch = document.querySelector(".stopwatch");
const timer = document.querySelector(".timer");
const startStop = document.querySelector(".start-stop");
const reset = document.querySelector(".reset");

class StopWatch {
    constructor(name = "Stopwatch", offset = 0, running = false, startTime = new Date(0)) {
        this.container = document.createElement("div");
        this.container.classList.add("stopwatch");

        this.name = name;
        this.nameElement = document.createElement("input");
        this.nameElement.classList.add("name");
        this.nameElement.value = name;
        this.container.appendChild(this.nameElement);

        this.offset = offset;
        this.running = running;
        this.startTime = new Date(startTime);

        this.timerElement = document.createElement("div");
        this.timerElement.classList.add("timer");
        this.container.appendChild(this.timerElement);
        this.updateTimer();

        this.startButton = document.createElement("button");
        this.startButton.innerText = "Start";
        this.startButton.addEventListener("click", () => this.toggleTimer());
        this.container.appendChild(this.startButton);

        this.resetButton = document.createElement("button");
        this.resetButton.innerText = "Reset";
        this.resetButton.addEventListener("click", () => this.resetTimer());
        this.container.appendChild(this.resetButton);

        this.timer = -1;
    }

    updateTimer() {
        const timer = (this.offset === 0 && !this.running)
            ? new Date(0)
            : new Date(this.offset + (new Date() - this.startTime));
        this.timerElement.innerText = timer.getUTCHours().toString().padStart(2, "0") + ":"
            + timer.getUTCMinutes().toString().padStart(2, "0") + ":"
            + timer.getUTCSeconds().toString().padStart(2, "0") + ":"
            + timer.getUTCMilliseconds().toString().padStart(3, "0");

    }

    toggleTimer() {
        this.running = !this.running;

        if (this.running) {
            this.startTime = new Date();
            this.timer = setInterval(() => this.updateTimer(), 1);
            this.startButton.innerText = "Stop";
        }

        if (!this.running) {
            this.offset = this.offset + (Date.now() - this.startTime.getTime());
            clearInterval(this.timer);
            this.startButton.innerText = "Start";
        }
    }

    resetTimer() {
        if (this.running) this.toggleTimer()
        this.startTime = new Date(0);
        this.offset = 0;
        this.updateTimer();
    }
}

const sw = new StopWatch();
const sw2 = new StopWatch();
document.querySelector("#app").appendChild(sw.container);
document.querySelector("#app").appendChild(sw2.container);
