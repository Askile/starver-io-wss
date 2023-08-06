import * as uWS from "uWebSockets.js";
import {Client} from "./Client";
import {Server} from "../Server";
import {Logger} from "../modules/Logger";
import {IdPool} from "../modules/IdPool";
import {WebSocket} from "uWebSockets.js";

export class WebSocketServer {
    private readonly server: Server;
    private logger: Logger = new Logger("./logs", {console: true, file: true});
    public clients: Map<WebSocket<any>, Client> = new Map();
    public app: uWS.TemplatedApp = uWS.App();
    public socketsPool: IdPool = new IdPool(1, 1000);

    constructor(path: string, server: Server) {
        this.server = server;

        this.setupWebSocket(path);
        this.startListening();
    }

    private setupWebSocket(path: string) {
        this.app.ws("/" + path, {
            idleTimeout: 0,
            maxBackpressure: 1024,
            maxPayloadLength: 100,
            compression: uWS.DEDICATED_COMPRESSOR_3KB,
            open: this.handleWebSocketOpen.bind(this),
            message: this.handleWebSocketMessage.bind(this),
            close: this.handleWebSocketClose.bind(this)
        });
    }

    private handleWebSocketOpen(ws: uWS.WebSocket<any>) {
        const client = new Client(ws, this.server);
        this.clients.set(ws, client);
    }

    private handleWebSocketMessage(ws: uWS.WebSocket<any>, message: ArrayBuffer, isBinary: boolean) {
        const client = this.clients.get(ws);
        if (client) client.onMessage(message, isBinary);
    }

    private handleWebSocketClose(ws: uWS.WebSocket<any>) {
        this.logger.info("close");
        const client = this.clients.get(ws) as Client;
        client.onClose();
        this.clients.delete(ws);
    }

    private startListening() {
        this.app.listen(this.server.port, () => {
            this.logger.info("WebSocket server is listening on port " + this.server.port);
        });
    }
}
