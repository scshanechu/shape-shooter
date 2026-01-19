// Enemy type 1
class Enemy1 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 4;
        this.color = 'rgba(15, 2, 112)';
        this.extraPoints = 30;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        drawShape(ctx, this.x, this.y, this.size, 5, -Math.PI / 2); // -Math.PI/2 starts the pentagon at the top
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

function drawShape(ctx, x, y, radius, sides, rotation) {
    // Calculate the angle step between each vertex
    const angleStep = (Math.PI * 2) / sides;

    ctx.beginPath();

    // Move to the first point
    for (let i = 0; i < sides; i++) {
        const currentAngle = (i * angleStep) + rotation;
        // Calculate the coordinates of the vertex using trigonometry
        const sx = x + Math.cos(currentAngle) * radius;
        const sy = y + Math.sin(currentAngle) * radius;

        if (i === 0) {
            ctx.moveTo(sx, sy);
        } else {
            ctx.lineTo(sx, sy);
        }
    }

    ctx.closePath(); // Connects the last point back to the first
    ctx.stroke();    // Draws the outline
    ctx.fill();   // Uncomment to fill the pentagon with color
}
