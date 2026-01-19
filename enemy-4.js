// Enemy type 4
class Enemy4 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 2;
        this.color = 'rgba(110, 0, 0)';
        this.direction = 'right';
        this.extraPoints = 50;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        drawShape(ctx, this.x, this.y, this.size, 8, -Math.PI / 2);
    }

    update() {
        if (this.direction === 'right') {
            this.x += this.speed * 2;
        } else {
            this.x -= this.speed * 2 ;
        }
        if (this.x > canvas.width - this.size / 2 || this.x < 0 + this.size / 2) {
            this.direction = this.direction === 'right' ? 'left' : 'right';
        }
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
