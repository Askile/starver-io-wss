import express, {Express} from "express";
import * as http from "http";
import {Logger} from "./modules/Logger";
import * as fs from "fs";
import * as path from "path";
import {Server} from "./Server";

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
        fs.readdir("servers", (err, files) => {
            for (const file of files) {
                const config = JSON.parse(fs.readFileSync(path.join("servers", file), {encoding: "utf-8"}));
                this.servers.push(new Server(config, path.parse(file).name.replace(/\s/g, "-")));
            }

            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });
    }

    private writeServersData() {

        setInterval(() => {
            const stream = fs.createWriteStream("frontend/serversBound/index.html", {encoding: "utf-8"});
            const servers = [];
            for (const server of this.servers) {
                servers.push({
                    path: server.path,
                    a: server.path,
                    nu: server.players.length,
                    m: server.playerPool.maxId,
                    p: server.config.port
                });
            }

            stream.write(JSON.stringify(servers));
        }, 1000);
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
