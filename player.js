// Player character
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40; // Generic size property
        this.speed = 5;
        this.color = '#00ff00';
        this.weaponLength = 20;
        this.weaponWidth = 6;
        this.angle = -Math.PI / 2; // Start pointing up
    }

    setAimAngle(mouseX, mouseY) {
        // Calculate angle from player to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.angle = Math.atan2(dy, dx);
    }

    draw(ctx) {
        // Circle shape - can be edited to any shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw weapon rectangle
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -this.weaponWidth / 2, this.weaponLength, this.weaponWidth);
        ctx.restore();
    }

    getWeaponTip() {
        // Calculate the position at the tip of the weapon
        return {
            x: this.x + Math.cos(this.angle) * this.weaponLength,
            y: this.y + Math.sin(this.angle) * this.weaponLength
        };
    }

    move(keys, canvas) {
        if (keys.ArrowUp && this.y - this.size / 2 > 0) {
            this.y -= this.speed;
        }
        if (keys.ArrowDown && this.y + this.size / 2 < canvas.height) {
            this.y += this.speed;
        }
        if (keys.ArrowLeft && this.x - this.size / 2 > 0) {
            this.x -= this.speed;
        }
        if (keys.ArrowRight && this.x + this.size / 2 < canvas.width) {
            this.x += this.speed;
        }
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

// Bullet class
class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.size = 10;
        this.speed = 8;
        this.color = '#ffff00';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    isOffScreen(canvas) {
        return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
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
