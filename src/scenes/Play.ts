import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
	fire?: Phaser.Input.Keyboard.Key;
	left?: Phaser.Input.Keyboard.Key;
	right?: Phaser.Input.Keyboard.Key;

	starfield?: Phaser.GameObjects.TileSprite;
	player?: Phaser.GameObjects.Shape;
	enemies: Phaser.GameObjects.Shape[] = [];
	playerScoreText?: Phaser.GameObjects.Text;

	rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

	// Variable to keep track of player score
	playerScore: number = 0;

	// Original firing position of the player
	originalFiringPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(320, 480);

	// Add the following line to declare isPlayerLaunching
	isPlayerLaunching: boolean = false;

	constructor() {
		super("play");
	}

	preload() {
		this.load.image("starfield", starfieldUrl);
	}

	#addKey(
		name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
	): Phaser.Input.Keyboard.Key {
		return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
	}

	create() {
		this.fire = this.#addKey("F");
		this.left = this.#addKey("LEFT");
		this.right = this.#addKey("RIGHT");

		this.starfield = this.add
		.tileSprite(
			0,
			0,
			this.game.config.width as number,
			this.game.config.height as number,
			"starfield",
		)
		.setOrigin(0, 0);

		// White rectangle at the top of the screen
		this.add.rectangle(0, 0, 640, 50, 0xffffff).setOrigin(0, 0);

		// Text to display player score
		this.playerScoreText = this.add.text(400, 10, "Player Score: 0", {
		fontSize: "20px",
		fill: "#000", // Why does it not like this?????
		});

		this.player = this.add.rectangle(320, 480, 50, 50, 0x7aa804);

		// Save the original firing position
		this.originalFiringPosition.set(this.player.x, this.player.y);

		// Start the enemy spawn loop
		this.time.addEvent({
		delay: 2000, // Adjust the delay as needed
		loop: true,
		callback: () => {
			// Randomly generate enemy positions and colors
			const enemyX = Phaser.Math.Between(800, 1200); // Adjust the range as needed
			const enemyY = Phaser.Math.Between(0, this.game.config.height as number);
			const enemyColor = Phaser.Display.Color.RandomRGB().color;

			this.createEnemy(enemyX, enemyY, enemyColor);
		},
		});
	}

	update(_timeMs: number, delta: number) {
		this.starfield!.tilePositionX -= 4;

		// Move the player left
		if (this.left!.isDown) {
		this.player!.x -= delta * 0.5; // Adjust the speed as needed
		}

		// Move the player right
		if (this.right!.isDown) {
		this.player!.x += delta * 0.5; // Adjust the speed as needed
		}

		// Ensure the player stays within the screen bounds
		this.clampPlayerToBounds();

		// Check for collisions with enemies
		this.enemies.forEach(enemy => {
		if (this.checkCollision(this.player!, enemy)) {
			// Collided with an enemy, increment the score, remove the enemy, and respawn the player
			this.playerScore += 10; // Adjust the score as needed
			this.updatePlayerScoreText();
			this.removeEnemy(enemy);
			this.respawnPlayer();
		}
		});

		// Enable player launch
		if (this.fire && this.fire.isDown && !this.isPlayerLaunching) {
		this.isPlayerLaunching = true;

		this.tweens.add({
			targets: this.player,
			y: 0,
			duration: 1000,
			onComplete: (tween, targets) => {
			// Respawn the player at the original firing position
			this.respawnPlayer();
			targets[0].y = this.originalFiringPosition.y; // Set y directly to avoid brief appearance at the top
			this.isPlayerLaunching = false; // Reset the flag after completion
			},
		});
		}

		// Update enemy positions and remove enemies off-screen
		this.enemies.forEach(enemy => {
		enemy.x -= delta * 0.3; // Adjust the speed as needed for scrolling

		// Check if enemy is off-screen
		if (enemy.x + enemy.width < 0) {
			// Remove enemy from the scene
			this.removeEnemy(enemy);
		}
		});
  }

	// Prototype method to create enemies
	createEnemy(x: number, y: number, color: number) {
		const enemy = this.add.rectangle(x, y, 50, 50, color);
		this.enemies.push(enemy);
	}

	// Check collision between two game objects
	checkCollision(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
		const bounds1 = object1.getBounds();
		const bounds2 = object2.getBounds();
		return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
	}

	// Remove an enemy from the array and scene
	removeEnemy(enemy: Phaser.GameObjects.Shape) {
		this.enemies.splice(this.enemies.indexOf(enemy), 1);
		enemy.destroy();
	}

	// Respawn the player at the original firing position
	respawnPlayer() {
		this.player!.setPosition(
		this.originalFiringPosition.x,
		this.originalFiringPosition.y
		);
	}

	// Clamp the player's position within the screen bounds
	clampPlayerToBounds() {
		if (this.player) {
		// Ensure the player doesn't go off the left edge
		this.player.x = Phaser.Math.Clamp(this.player.x, 0, 670);

		// Ensure the player doesn't go off the right edge
		const playerRightEdge = this.player.x + this.player.width;
		this.player.x = Phaser.Math.Clamp(
			playerRightEdge,
			0,
			670
		) - this.player.width;

		// Make sure player doesn't go off the top edge
		if (this.player.y < 0) {
			this.player.y = this.game.config.height as number;
		} else if (this.player.y > this.game.config.height) {
			this.player.y = 0;
		}
		}
	}

	// Update the player score text
	updatePlayerScoreText() {
		if (this.playerScoreText) {
		this.playerScoreText.text = `Player Score: ${this.playerScore}`;
		}
	}
}

///AHHHHHHHHHHHHHHHHHHHHHHHIOJJJJJJJGVSykculwiyu;ohpkq