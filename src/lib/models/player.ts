import type ClassicGameScene from '$lib/scenes/classic.scene';
import Phaser from 'phaser';
import type PointHandler from './points-handler';

export default class Player {
	scene: ClassicGameScene;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

	bambooInUse: Phaser.Types.Physics.Arcade.GameObjectWithBody | undefined = undefined;
	pointHandler: PointHandler;

	constructor(
		scene: ClassicGameScene,
		x: number,
		y: number,
		key: string,
		pointHandler: PointHandler
	) {
		const { uw, uh } = scene;

		this.scene = scene;
		this.pointHandler = pointHandler;
		this.pointHandler.create();

		this.sprite = scene.physics.add.sprite(x * uw, y * uh, key);
		this.sprite.setBounce(0.2);
		this.sprite.setDisplaySize(2 * uw, 3 * uh);
		this.sprite.setSize(uw / 4, this.sprite.height);

		this.cursors = scene.input.keyboard?.createCursorKeys();
		this.initAnimations(key);
	}

	initAnimations(key: string) {
		this.scene.anims.create({
			key: 'left',
			frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.create({
			key: 'turn',
			frames: [{ key, frame: 4 }],
			frameRate: 20
		});

		this.scene.anims.create({
			key: 'right',
			frames: this.scene.anims.generateFrameNumbers(key, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	}

	update() {
		this.pointHandler.evaluate();
		this.handleWorldWrap();
		this.handlePlayerMovement();

		if (this.bambooInUse) {
			this.handlePlayerMovementOnBamboo();
		} else {
			this.sprite.body.allowGravity = true;
		}

		this.bambooInUse = undefined;
	}

	handlePlayerMovement = () => {
		const { cursors, uw, uh } = this.scene;
		if (cursors?.left.isDown) {
			this.sprite.setVelocityX(-uw * 8);
			this.sprite.anims.play('left', true);
		} else if (cursors?.right.isDown) {
			this.sprite.setVelocityX(uw * 8);
			this.sprite.anims.play('right', true);
		} else {
			this.sprite.setVelocityX(0);
			this.sprite.anims.play('turn');
		}

		if (cursors?.up.isDown && this.sprite.body.touching.down) {
			this.sprite.setVelocityY(-uh * 16);
		}
	};

	handlePlayerMovementOnBamboo = () => {
		const { cursors, uh } = this.scene;
		// Handle vertical movement
		if (cursors?.up.isDown) {
			this.sprite.setVelocityY(-uh * 8);
		} else if (cursors?.down.isDown) {
			this.sprite.setVelocityY(uh * 8);
		} else {
			this.sprite.setVelocityY(0);
		}
	};

	handleWorldWrap() {
		if (this.sprite.x < 0) {
			this.sprite.x = this.scene.scale.width;
		} else if (this.sprite.x > this.scene.scale.width) {
			this.sprite.x = 0;
		}

		if (this.sprite.y < 0) {
			this.sprite.y = this.scene.scale.height;
		} else if (this.sprite.y > this.scene.scale.height) {
			this.sprite.y = 0;
		}
	}
}
