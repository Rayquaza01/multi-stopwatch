const app = document.querySelector("#app");
const add = document.querySelector("#add-sw");

function save() {
    localStorage.setItem("stopwatches", JSON.stringify(stopwatches.filter(sw => !sw.delete).map(sw => sw.serialize())));
}

class StopWatch {
    constructor(name = "Stopwatch", offset = 0, running = false, startTime = new Date(0)) {
        this.container = document.createElement("div");
        this.container.classList.add("stopwatch");

        this.nameElement = document.createElement("input");
        this.nameElement.classList.add("name");
        this.nameElement.value = name;
        this.nameElement.addEventListener("input", save);
        this.container.appendChild(this.nameElement);

        this.offset = offset;
        this.running = false;
        this.startTime = new Date(startTime);

        this.timerElement = document.createElement("div");
        this.timerElement.classList.add("timer");
        this.container.appendChild(this.timerElement);
        this.updateTimer();

        this.startButton = document.createElement("button");
        this.startButton.innerText = "Start";
        this.startButton.addEventListener("click", () => this.toggleTimer(true));
        this.container.appendChild(this.startButton);

        this.resetButton = document.createElement("button");
        this.resetButton.innerText = "Reset";
        this.resetButton.addEventListener("click", () => this.resetTimer(true));
        this.container.appendChild(this.resetButton);

        this.deleteButton = document.createElement("button");
        this.deleteButton.innerText = "Delete";
        this.deleteButton.addEventListener("click", () => this.deleteTimer());
        this.container.appendChild(this.deleteButton);

        this.delete = false;
        this.timer = -1;
        if (running) this.toggleTimer();
    }

    updateTimer() {
        const timer = !this.running
            ? new Date(this.offset)
            : new Date(this.offset + (new Date() - this.startTime));
        this.timerElement.innerText = timer.getUTCHours().toString().padStart(2, "0") + ":"
            + timer.getUTCMinutes().toString().padStart(2, "0") + ":"
            + timer.getUTCSeconds().toString().padStart(2, "0") + ":"
            + timer.getUTCMilliseconds().toString().padStart(3, "0");

    }

    toggleTimer(toSave = false) {
        this.running = !this.running;

        if (this.running) {
            if (this.startTime.getTime() === 0) this.startTime = new Date();
            this.timer = setInterval(() => this.updateTimer(), 1);
            this.startButton.innerText = "Stop";
        }

        if (!this.running) {
            this.offset = this.offset + (Date.now() - this.startTime.getTime());
            this.startTime = new Date(0);
            clearInterval(this.timer);
            this.startButton.innerText = "Start";
        }

        if (toSave) save();
    }

    resetTimer(toSave = false) {
        if (this.running) this.toggleTimer()
        this.startTime = new Date(0);
        this.offset = 0;
        this.updateTimer();

        if (toSave) save();
    }

    deleteTimer() {
        app.removeChild(this.container);
        this.delete = true;
        save();
    }

    serialize() {
        return {
            name: this.nameElement.value,
            offset: this.offset,
            running: this.running,
            startTime: this.startTime.getTime()
        }
    }
}

const swLocalStorage = JSON.parse(localStorage.getItem("stopwatches") ?? "[]");
const stopwatches = swLocalStorage.map((item) => {
    console.log(item);
    const sw = new StopWatch(item.name, item.offset, item.running, new Date(item.startTime));

    app.appendChild(sw.container);

    return sw;
});


add.addEventListener("click", () => {
    const sw = new StopWatch();
    app.appendChild(sw.container);
    stopwatches.push(sw);
    save();
});

// const sw = new StopWatch();
// const sw2 = new StopWatch();
// document.querySelector("#app").appendChild(sw.container);
// document.querySelector("#app").appendChild(sw2.container);
