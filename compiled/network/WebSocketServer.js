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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const uWS = __importStar(require("uWebSockets.js"));
const Client_1 = require("./Client");
const Logger_1 = require("../modules/Logger");
const IdPool_1 = require("../modules/IdPool");
class WebSocketServer {
    server;
    logger = new Logger_1.Logger("./logs", { console: true, file: true });
    clients = new Map();
    app = uWS.App();
    socketsPool = new IdPool_1.IdPool(1, 1000);
    constructor(path, server) {
        this.server = server;
        this.setupWebSocket(path);
        this.startListening();
    }
    setupWebSocket(path) {
        this.app.ws('/' + path, {
            idleTimeout: 0,
            maxBackpressure: 1024,
            maxPayloadLength: 100,
            compression: uWS.DEDICATED_COMPRESSOR_3KB,
            open: this.handleWebSocketOpen.bind(this),
            message: this.handleWebSocketMessage.bind(this),
            close: this.handleWebSocketClose.bind(this)
        });
    }
    handleWebSocketOpen(ws) {
        const client = new Client_1.Client(ws, this.server);
        this.clients.set(ws, client);
    }
    handleWebSocketMessage(ws, message, isBinary) {
        const client = this.clients.get(ws);
        if (client)
            client.onMessage(message, isBinary);
    }
    handleWebSocketClose(ws) {
        this.logger.info("close");
        const client = this.clients.get(ws);
        client.onClose();
        this.clients.delete(ws);
    }
    startListening() {
        this.app.listen(443, () => {
            this.logger.info('WebSocket server is listening on port 443');
        });
    }
}
exports.WebSocketServer = WebSocketServer;
