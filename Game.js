const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MenuScene, BunnyScene, CatScene, BirdScene],
    physics: { default: 'arcade', arcade: { gravity: { y: 600 }, debug: false } }
};

let game = new Phaser.Game(config);

// ==================== MENU ====================
class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    preload() {
        this.load.image('bunnyBg', 'Images/BunnyBg.jpg');
        this.load.image('catBg', 'Images/CatBg.jpg');
        this.load.image('birdBg', 'Images/BirdBg.jpg');

        this.load.spritesheet('bunny', 'Images/Bunny.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('cat', 'Images/Cat.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('bird', 'Images/Bird.png', { frameWidth: 512, frameHeight: 512 });
    }
    create() {
        this.add.text(220, 100, 'Choose Your Animal', { fontSize: '42px', fill: '#fff' });

        this.add.text(300, 250, '🐰 Bunny', { fontSize: '32px', fill: '#0f0' })
            .setInteractive().on('pointerdown', () => this.scene.start('BunnyScene'));

        this.add.text(300, 320, '🐱 Cat', { fontSize: '32px', fill: '#0f0' })
            .setInteractive().on('pointerdown', () => this.scene.start('CatScene'));

        this.add.text(300, 390, '🐦 Bird', { fontSize: '32px', fill: '#0f0' })
            .setInteractive().on('pointerdown', () => this.scene.start('BirdScene'));
    }
}

// ==================== BUNNY ====================
class BunnyScene extends Phaser.Scene {
    constructor() { super('BunnyScene'); }

    create() {
        this.add.image(400, 300, 'bunnyBg').setDisplaySize(800, 600);

        // יצירת אנימציה
        this.anims.create({
            key: 'bunny_anim',
            frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        // ניקוד + טיימר
        this.score = 0;
        this.timeLeft = 30; // 30 שניות למשחק
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '28px', fill: '#fff' });
        this.timerText = this.add.text(600, 20, 'Time: 30', { fontSize: '28px', fill: '#fff' });

        // מיקומים אפשריים של חורים
        this.holes = [
            { x: 200, y: 450 },
            { x: 400, y: 500 },
            { x: 600, y: 450 }
        ];

        // יצירת הארנב (מוסתר בהתחלה)
        this.bunny = this.add.sprite(400, 600, 'bunny').setScale(0.6);
        this.bunny.setInteractive();
        this.bunny.visible = false;

        this.bunny.on('pointerdown', () => {
            if (this.bunny.visible) {
                this.score++;
                this.scoreText.setText('Score: ' + this.score);
                this.hideBunny();
            }
        });

        // הופעה כל 1.5 שניות
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => this.showBunny()
        });

        // טיימר משחק
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText('Time: ' + this.timeLeft);
                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            }
        });
    }

    showBunny() {
        if (this.timeLeft <= 0) return;
        let pos = Phaser.Utils.Array.GetRandom(this.holes);
        this.bunny.setPosition(pos.x, pos.y);
        this.bunny.play('bunny_anim');
        this.bunny.visible = true;

        // מסתתר אחרי חצי שנייה
        this.time.delayedCall(700, () => this.hideBunny(), [], this);
    }

    hideBunny() {
        this.bunny.visible = false;
    }

    endGame() {
        this.bunny.visible = false;
        this.add.text(300, 300, 'Game Over\nScore: ' + this.score, 
            { fontSize: '40px', fill: '#ff0', align: 'center' });
        this.time.removeAllEvents();
    }
}

// ==================== CAT ====================
class CatScene extends Phaser.Scene {
    constructor() { super('CatScene'); }
    create() {
        this.add.image(400, 300, 'catBg').setDisplaySize(800, 600);

        this.anims.create({
            key: 'cat_run',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.cat = this.physics.add.sprite(100, 500, 'cat').setScale(0.7).play('cat_run');
        this.cat.setCollideWorldBounds(true);
        this.cat.setVelocityX(120); // ריצה קדימה

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        if (this.cursors.up.isDown && this.cat.body.touching.down) {
            this.cat.setVelocityY(-400);
        }
    }
}

// ==================== BIRD ====================
class BirdScene extends Phaser.Scene {
    constructor() { super('BirdScene'); }
    create() {
        this.add.image(400, 300, 'birdBg').setDisplaySize(800, 600);

        this.anims.create({
            key: 'bird_fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.bird = this.physics.add.sprite(200, 300, 'bird').setScale(0.7).play('bird_fly');
        this.bird.setCollideWorldBounds(true);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if (this.spaceKey.isDown) {
            this.bird.setVelocityY(-200); // עולה למעלה
        } else {
            this.bird.setVelocityY(200); // יורד
        }
    }
}
