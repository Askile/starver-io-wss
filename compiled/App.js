"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const Logger_1 = require("./modules/Logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Server_1 = require("./Server");
const GameMode_1 = require("./enums/GameMode");
const find_free_ports_1 = __importDefault(require("find-free-ports"));
Math.clamp = (variable, min, max) => {
    return Math.max(min, Math.min(variable, max));
};
class App {
    port;
    app = (0, express_1.default)();
    server = http.createServer(this.app);
    servers = [];
    logger = new Logger_1.Logger("./logs/", { console: true, file: true });
    constructor(port) {
        this.port = port;
        this.setupStaticFiles();
        this.run();
        this.loadServers();
    }
    loadServers() {
        fs.readdir("servers/normal", async (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const [port] = await (0, find_free_ports_1.default)(1, { startPort: 8084, endPort: 8085 });
                const config = JSON.parse(fs.readFileSync(path.join(`servers/normal/`, file), { encoding: "utf-8" }));
                this.servers.push(new Server_1.Server(config, "Normal-server-" + i, port, GameMode_1.GameMode.normal));
            }
            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });
        fs.readdir("servers/community", async (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const [port] = await (0, find_free_ports_1.default)(1, { startPort: 443, endPort: 448 });
                const config = JSON.parse(fs.readFileSync(path.join(`servers/community/`, file), { encoding: "utf-8" }));
                this.servers.push(new Server_1.Server(config, "Private-server-" + i, port, GameMode_1.GameMode.community));
            }
            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });
        setInterval(this.writeServersData.bind(this), 5000);
    }
    writeServersData() {
        const stream = fs.createWriteStream("frontend/serversBound/index.html", { encoding: "utf-8" });
        const servers = [];
        for (const server of this.servers) {
            servers.push({
                path: server.path,
                a: server.path.replace(/-/g, " "),
                nu: server.players.length,
                m: server.playerPool.maxId,
                gm: GameMode_1.GameMode[server.mode],
                p: server.port
            });
        }
        stream.write(JSON.stringify(servers));
    }
    setupStaticFiles() {
        fs.readdir("frontend/img", (err, files) => {
            this.logger.info("Loaded " + files.length + " images");
        });
        fs.readdir("frontend/js", (err, files) => {
            this.logger.info("Loaded " + files.length + " scripts");
        });
        fs.readdir("frontend/css", (err, files) => {
            this.logger.info("Loaded " + files.length + " styles");
        });
        this.app.use(express_1.default.static("frontend"));
    }
    run() {
        this.server.listen(this.port);
        this.logger.info("Server run at " + this.port + " port");
    }
}
new App(80);
