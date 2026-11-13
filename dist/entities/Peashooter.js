var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Peashooter_attackTimer;
import { Plant } from "./Plant.js";
import { PLANT_CONFIG } from "../config.js";
export class Peashooter extends Plant {
    constructor(row, column) {
        super("peashooter", row, column, PLANT_CONFIG.peashooter);
        _Peashooter_attackTimer.set(this, 0);
        this.damage = 20;
        this.attackInterval = 1.5;
    }
    update(deltaTime) {
        if (!this.alive)
            return false;
        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }
        __classPrivateFieldSet(this, _Peashooter_attackTimer, __classPrivateFieldGet(this, _Peashooter_attackTimer, "f") + deltaTime, "f");
        if (__classPrivateFieldGet(this, _Peashooter_attackTimer, "f") >= this.attackInterval) {
            __classPrivateFieldSet(this, _Peashooter_attackTimer, __classPrivateFieldGet(this, _Peashooter_attackTimer, "f") - this.attackInterval, "f");
            return true;
        }
        return false;
    }
    getAttackDamage() {
        return this.damage;
    }
}
_Peashooter_attackTimer = new WeakMap();
