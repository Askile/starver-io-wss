import NanoTimer from "nanotimer";
import { Server } from "../../Server";

interface GameEvent {
    type: string;
    repeat: number;
    commands: string[];
}

interface InventoryEvent extends GameEvent {
    item: string;
    amount: number;
}

interface LocationEvent extends GameEvent {
    x: number;
    y: number;
}
interface LocationInventoryEvent extends GameEvent, InventoryEvent {}
interface TimeEvent extends GameEvent {}
interface KillEvent extends GameEvent {kill: number}
interface ScoreEvent extends GameEvent {score: number;}

export class EventSystem {
    private server: Server;
    private locationInventoryEvents: LocationInventoryEvent[] = [];
    private inventoryEvents: InventoryEvent[] = [];
    private locationEvents: LocationEvent[] = [];
    private killEvents: KillEvent[] = [];
    private timeEvents: TimeEvent[] = [];
    private scoreEvents: ScoreEvent[] = [];
    private readonly events: any;
    constructor(server: Server) {
        this.server = server;
        this.events = server.config.important.events;
        this.initEvents();
        this.setupEvents();
    }

    private initEvents(){
        if(this.events.length > 0)
        for (const event of this.events) {
            switch(event.type) {
                case "inventory":
                    this.inventoryEvents.push(event);
                    break;
                case "location":
                    this.locationEvents.push(event);
                    break;
                case "score":
                    this.scoreEvents.push(event);
                    break;
                case "kill":
                    this.killEvents.push(event);
                    break;
                case "locationInventory":
                    this.locationInventoryEvents.push(event);
                    break;
                case "time":
                    this.timeEvents.push(event);
                    break;
                default:
                    break;
            }
        }
    }

    public setupEvents() {
        for (const event of this.scoreEvents) {
            new NanoTimer().setInterval(() => {
                for (const player of this.server.players) {
                    if(player.stats.score > event.score) {

                    }
                }
            }, [], event.repeat + "s");
        }
    }
}