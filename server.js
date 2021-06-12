const http = require("http");
const app = require("./app");

function normalizePort(val) {
    const validPort = parseInt(val, 10);
    if (isNaN(validPort)) return val;
    if (validPort >= 0) return validPort;
    return false;
}

const port = normalizePort(process.env.PORT);
app.set("port", port);

const server = http.createServer(app);

const address = server.address();
const bind = typeof address === "string" ? "pipe " + address : "port :" + port;

function errorHandler(error) {
    try {
        if (error.syscall !== "listen") {
            throw error;
        }
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges.");
                process.exit(1); // exit with failure
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use.");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    catch(err) {
        console.error("error: " + err);
    }
}

server.on("error", errorHandler);
server.on("listening", () => {
    console.log("Listening on " + bind);
});
server.listen(port);
