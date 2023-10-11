"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    value;
    constructor(value) {
        this.value = value ?? 0;
    }
    get() {
        return this.value;
    }
}
exports.Action = Action;
