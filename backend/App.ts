import express, {Express} from "express";
import * as http from "http";
import {Logger} from "./modules/Logger";
import * as fs from "fs";
import * as path from "path";
import {Server} from "./Server";
import {GameMode} from "./enums/GameMode";
import findFreePorts from "find-free-ports";

Math.clamp = (variable: number, min: number, max: number) => {
    return Math.max(min, Math.min(variable, max));
}

class App {
    private app: Express = express();
    private server: http.Server = http.createServer(this.app);
    public servers: Server[] = [];
    private logger: Logger = new Logger("./logs/", {console: true, file: true});
    constructor(public port: number) {
        this.setupStaticFiles();
        this.run();
        this.loadServers();
    }

    private loadServers() {
        fs.readdir("servers/normal", async (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const [port] = await findFreePorts(1, {startPort: 8084, endPort: 8085});
                const config = JSON.parse(fs.readFileSync(path.join(`servers/normal/`, file), {encoding: "utf-8"}));
                this.servers.push(new Server(config, "Normal-server-" + i, port, GameMode.normal));
            }
            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });
        fs.readdir("servers/community", async (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const [port] = await findFreePorts(1, {startPort: 443, endPort: 448});
                const config = JSON.parse(fs.readFileSync(path.join(`servers/community/`, file), {encoding: "utf-8"}));
                this.servers.push(new Server(config, "Private-server-" + i, port, GameMode.community));
            }
            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });

        setInterval(this.writeServersData.bind(this), 5000);
    }

    private writeServersData() {
        const stream = fs.createWriteStream("frontend/serversBound/index.html", {encoding: "utf-8"});
        const servers = [];
        for (const server of this.servers) {
            servers.push({
                path: server.path,
                a: server.path.replace(/-/g, " "),
                nu: server.players.length,
                m: server.playerPool.maxId,
                gm: GameMode[server.mode],
                p: server.port
            });
        }
        stream.write(JSON.stringify(servers));
    }

    private setupStaticFiles() {
        fs.readdir("frontend/img", (err, files) => {
            this.logger.info("Loaded " + files.length + " images");
        });
        fs.readdir("frontend/js", (err, files) => {
            this.logger.info("Loaded " + files.length + " scripts");
        });
        fs.readdir("frontend/css", (err, files) => {
            this.logger.info("Loaded " + files.length + " styles");
        });
        this.app.use(express.static("frontend"));
    }

    private run() {
        this.server.listen(this.port);
        this.logger.info("Server run at " + this.port + " port");
    }
}

new App(80);
