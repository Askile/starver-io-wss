"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movement = void 0;
class Movement {
    player;
    lastMovementUpdate = 0;
    constructor(player) {
        this.player = player;
    }
    tick() {
        if (Date.now() - this.lastMovementUpdate >= 250 && this.player.direction >= 1) {
            let angle = Math.atan2(this.player.direction & 4 ? 1 : this.player.direction & 8 ? -1 : 0, this.player.direction & 2 ? 1 : this.player.direction & 1 ? -1 : 0);
            this.player.velocity.x = Math.cos(angle) * 50;
            this.player.velocity.y = Math.sin(angle) * 50;
            this.lastMovementUpdate = Date.now();
        }
    }
}
exports.Movement = Movement;
