import {Entity} from "../../entities/Entity";
import {Vector} from "../../modules/Vector";
import {ActionType} from "../../enums/types/ActionType";
import {Player} from "../../entities/Player";
import {Server} from "../../Server";

export class Movement {
    public entity: Entity;
    public server: Server
    constructor(entity: Entity) {
        this.entity = entity;
        this.server = entity.server;
    }

    public tick() {
        if(!this.entity.speed) return this.entity.realPosition.set(this.entity.position);

        let angle_ = this.entity.realPosition.get_std_angle(this.entity.position) + Math.PI;
        const delta = this.entity.speed * 1000 * (1 / this.server.settings.tps);
        const vector = this.entity.position.build(delta, angle_);

        if(angle_) {
            if (vector.magnitude() < this.entity.realPosition.subtract(this.entity.position).magnitude()) this.entity.realPosition = this.entity.realPosition.add(vector);
            else {
                this.entity.realPosition.x = this.entity.position.x;
                this.entity.realPosition.y = this.entity.position.y;
            }
        }

        if (!this.entity.direction && (this.entity instanceof Player)) {
            this.entity.velocity = Vector.zero();
            if (this.entity.action & ActionType.WALK) {
                this.entity.action &= ~ActionType.WALK;
                this.entity.action |= ActionType.IDLE;
            }
            return;
        }

        if (this.entity.action & ActionType.IDLE) {
            this.entity.action &= ~ActionType.IDLE;
            this.entity.action |= ActionType.WALK;
        }

        let angle = Math.atan2(
            this.entity.direction & 4 ? 1 : this.entity.direction & 8 ? -1 : 0,
            this.entity.direction & 2 ? 1 : this.entity.direction & 1 ? -1 : 0
        );

        if(this.entity instanceof Player) {
            this.entity.velocity.x = 50 * Math.cos(angle);
            this.entity.velocity.y = 50 * Math.sin(angle);
        }

        this.entity.updateSpeed();
        if (this.entity instanceof Player && !this.entity.isStunned) {
            this.entity.position = this.entity.realPosition.add(this.entity.velocity);

            this.server.collision.update(this.entity);
        }
    }
}