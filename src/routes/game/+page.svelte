<script lang="ts">
	import { AUTO, Game } from 'phaser';
	import { onDestroy } from 'svelte';

	let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

	const config: Phaser.Types.Core.GameConfig = {
		type: AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		parent: 'main-scene',
		backgroundColor: '#0f172a',
		scene: {
			preload,
			create,
			update
		},
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 980, x: 0 },
				debug: false
			}
		}
	};

	const game = new Game(config);
	let isOnVine = false;

	const onVine: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
		isOnVine = true;
		player.body.allowGravity = false;
		player.setVelocityY(0); // Stop any falling motion
	};

	function preload(this: Phaser.Scene) {
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	function create(this: Phaser.Scene) {
		const ground = this.add
			.rectangle(0, Number(config.height) - 50, Number(config.width), 50, 0xffffff)
			.setOrigin(0, 0);
		this.physics.add.existing(ground, true);

		const vine = this.add.rectangle(500, 0, 25, 500, 0x00ff22).setOrigin(0, 0);
		this.physics.add.existing(vine, true);

		player = this.physics.add.sprite(100, 450, 'dude');
		cursors = this.input.keyboard?.createCursorKeys();

		player.setBounce(0.2);
		player.setScale(1.5);
		// player.setCollideWorldBounds(true);

		// Add collision between player and platform
		this.physics.add.collider(player, ground);
		this.physics.add.overlap(player, vine, onVine, undefined, this);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	}

	function update(this: Phaser.Scene) {
		// Horizontal wrap-around
		if (player.x < 0) {
			player.x = this.scale.width;
		} else if (player.x > this.scale.width) {
			player.x = 0;
		}

		// Vertical wrap-around
		if (player.y < 0) {
			player.y = this.scale.height;
		} else if (player.y > this.scale.height) {
			player.y = 0;
		}

		if (cursors?.left.isDown) {
			player.setVelocityX(-160);

			player.anims.play('left', true);
		} else if (cursors?.right.isDown) {
			player.setVelocityX(160);

			player.anims.play('right', true);
		} else {
			player.setVelocityX(0);

			player.anims.play('turn');
		}

		if (cursors?.up.isDown && player.body.touching.down) {
			player.setVelocityY(-450);
		}

		if (isOnVine) {
			if (cursors?.up.isDown) {
				player.setVelocityY(-160);
			} else if (cursors?.down.isDown) {
				player.setVelocityY(160);
			} else {
				player.setVelocityY(0);
			}

			if (!cursors?.up.isDown && !cursors?.down.isDown) {
				player.setVelocityY(0);
			}
		} else {
			player.body.allowGravity = true;
		}

		isOnVine = false; // Reset the onLadder flag every frame
	}

	onDestroy(() => {
		game.destroy(true);
	});
</script>

<div id="main-scene"></div>
