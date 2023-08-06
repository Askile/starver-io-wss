"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spike = void 0;
const Entity_1 = require("./Entity");
const Vector_1 = require("../modules/Vector");
class Spike extends Entity_1.Entity {
    durability = 1000;
    constructor(server, type, angle, owner) {
        super(type, server);
        // Ensure the angle is within a valid range (0 to 255)
        angle = angle < 0 ? 0 : angle > 255 ? 255 : angle;
        const offset = new Vector_1.Vector(120 * Math.cos((angle / 255) * (Math.PI * 2)), 120 * Math.sin((angle / 255) * (Math.PI * 2)));
        this.position = owner.position.add(offset);
        this.angle = angle;
        if (this.canSpawn()) {
            this.info = this.durability;
            this.server.entities.push(this);
        }
    }
    // Helper method to check if the Spike can be spawned at the current position
    canSpawn() {
        const chunks = this.server.map.getChunks(this.position.x, this.position.y, 3);
        if (chunks.length > 1) {
            for (const chunk of chunks) {
                const tilePos = chunk.position.multiply(100).add(new Vector_1.Vector(50, 50));
                if (tilePos.distance(this.position) < chunk.radius + 25) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.Spike = Spike;
