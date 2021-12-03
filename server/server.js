const { emit } = require("process");
const { Server } = require("socket.io");
const { FRAME_RATES } = require("./constants");
const { createGameState, gameLoop } = require("./game");

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connection", (client) => {
    const state = createGameState();

    startGameInterval(client, state);
});

function startGameInterval(client, state) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
        console.log(winner);
        if (!winner) {
            client.emit("gameState", JSON.stringify(state));
        } else {
            client.emit("gameOver");
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATES);
}
io.listen(3001);