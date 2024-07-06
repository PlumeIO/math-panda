export const createGround = (scene: Phaser.Scene) => {
	const ground = scene.add
		.rectangle(0, Number(scene.scale.height) - 50, Number(scene.scale.width), 50, 0xffffff)
		.setOrigin(0, 0);

	return ground;
};

export const createBamboos = (scene: Phaser.Scene) => {
	const bamboos = scene.add
		.rectangle(500, scene.scale.height - 550, 25, 500, 0x00ff22)
		.setOrigin(0, 0);
	return bamboos;
};

export const createPlayer = (
	scene: Phaser.Scene,
	x: number,
	y: number,
	key: string,
	frame?: string | number | undefined
) => {
	const player = scene.physics.add.sprite(x, y, key, frame);

	player.setBounce(0.2);
	player.setScale(1.5);

	return player;
};

export const initPlayerAnimations = (scene: Phaser.Scene, key: string) => {
	scene.anims.create({
		key: 'left',
		frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	scene.anims.create({
		key: 'turn',
		frames: [{ key, frame: 4 }],
		frameRate: 20
	});

	scene.anims.create({
		key: 'right',
		frames: scene.anims.generateFrameNumbers(key, { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});
};

export const handleWorldWrap = (
	scene: Phaser.Scene,
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
) => {
	// Horizontal wrap-around
	if (player.x < 0) {
		player.x = scene.scale.width;
	} else if (player.x > scene.scale.width) {
		player.x = 0;
	}

	// Vertical wrap-around
	if (player.y < 0) {
		player.y = scene.scale.height;
	} else if (player.y > scene.scale.height) {
		player.y = 0;
	}
};

export const handlePlayerMovement = (
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
) => {
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
};

export const handlePlayerMovementonBamboo = (
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
) => {
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
};
