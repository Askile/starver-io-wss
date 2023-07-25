import express, {Express} from "express";
import * as http from "http";
import {Logger} from "./modules/Logger";
import * as fs from "fs";
import * as path from "path";
import {Server} from "./Server";
0;
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
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const config = JSON.parse(fs.readFileSync(path.join("servers", file), {encoding: "utf-8"}));

                let PATH = path.parse(file).name.replace(/\s/g, "-");
                this.servers.push(new Server(config, PATH, i + 443));
            }

            this.logger.info("Loaded " + files.length + " configs");
            this.writeServersData();
        });
    }

    private writeServersData() {
        const stream = fs.createWriteStream("./frontend/serversBound/index.html", {encoding: "utf-8"});
        const servers = [];
        for (const server of this.servers) {
            servers.push({
                a: server.path,
                path: server.path,
                nu: server.players.length,
                m: server.playerPool.maxId,
                p: server.port,
                ssl: 0
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
