// Enemy type 2
class Enemy2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 3;
        this.color = '#ff00ff';
    }

    draw(ctx) {
        // Triangle shape - can be edited to any shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.y += this.speed;
    }

    isOffScreen(canvas) {
        return this.y - this.size / 2 > canvas.height;
    }

    getBounds() {
        return {
            x: this.x - this.size / 2,
            y: this.y - this.size / 2,
            width: this.size,
            height: this.size,
            centerX: this.x,
            centerY: this.y
        };
    }
}
