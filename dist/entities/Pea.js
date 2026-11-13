export class Pea {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.damage = damage;
        this.speed = 300;
        this.active = true;
    }
    update(deltaTime) {
        this.x += this.speed * deltaTime;
    }
    render(ctx) {
        if (!this.active)
            return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#36c936";
        ctx.fill();
        ctx.strokeStyle = "#176b17";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
