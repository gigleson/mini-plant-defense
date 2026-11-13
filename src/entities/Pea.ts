
export class Pea {
    x: number;
    y: number;
    radius: number;

    damage: number;
    speed: number;

    active: boolean;

    constructor(x: number, y: number, damage: number) {
        this.x = x;
        this.y = y;
        this.radius = 7;

        this.damage = damage;
        this.speed = 300;

        this.active = true;
    }

    update(deltaTime: number): void {
        this.x += this.speed * deltaTime;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#36c936";
        ctx.fill();

        ctx.strokeStyle = "#176b17";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
