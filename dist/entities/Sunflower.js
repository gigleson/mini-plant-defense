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
var _Sunflower_sunlightTimer;
import { Plant } from "./Plant.js";
import { PLANT_CONFIG } from "../config.js";
export class Sunflower extends Plant {
    constructor(row, column) {
        super("sunflower", row, column, PLANT_CONFIG.sunflower);
        _Sunflower_sunlightTimer.set(this, 0);
        this.sunlightAmount = 25;
        this.generationInterval = 5;
    }
    update(deltaTime) {
        if (!this.alive)
            return 0;
        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }
        __classPrivateFieldSet(this, _Sunflower_sunlightTimer, __classPrivateFieldGet(this, _Sunflower_sunlightTimer, "f") + deltaTime, "f");
        let generatedSunlight = 0;
        while (__classPrivateFieldGet(this, _Sunflower_sunlightTimer, "f") >= this.generationInterval) {
            __classPrivateFieldSet(this, _Sunflower_sunlightTimer, __classPrivateFieldGet(this, _Sunflower_sunlightTimer, "f") - this.generationInterval, "f");
            generatedSunlight += this.sunlightAmount;
        }
        return generatedSunlight;
    }
    generateSunlight() {
        return this.sunlightAmount;
    }
}
_Sunflower_sunlightTimer = new WeakMap();
