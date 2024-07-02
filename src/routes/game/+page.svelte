<script lang="ts">
	import { AUTO, Game } from 'phaser';

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

	new Game(config);

	function preload(this: Phaser.Scene) {
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	function create(this: Phaser.Scene) {
		const ground = this.add
			.rectangle(0, Number(config.height) - 50, Number(config.width), 50, 0xffffff)
			.setOrigin(0, 0);
		this.physics.add.existing(ground, true);

		player = this.physics.add.sprite(100, 450, 'dude');
		cursors = this.input.keyboard?.createCursorKeys();

		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

		// Add collision between player and platform
		this.physics.add.collider(player, ground);

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

	function update() {
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
			player.setVelocityY(-330);
		}
	}
</script>

<div id="main-scene"></div>
