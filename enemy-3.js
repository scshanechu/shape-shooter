// Enemy type 3
class Enemy3 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 2;
        this.color = 'rgba(0, 255, 0)';
    }

    draw(ctx) {
        // Square shape - can be edited to any shape
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
