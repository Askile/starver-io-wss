import express, {Express} from "express";
import * as http from "http";
import {Logger} from "./modules/Logger";
import * as fs from "fs";
import * as path from "path";
import {Server} from "./Server";

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
            this.logger.info("Loaded " + files.length + " configs");
            for (const file of files) {
                const config = JSON.parse(fs.readFileSync(path.join("servers", file), {encoding: "utf-8"}));
                new Server(config, path.parse(file).name);
            }
        });
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
