const unit = 32;

export const createPlatforms = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unit;
	const uh = height / unit;
	const platforms = scene.physics.add.staticGroup();

	const createPlatform = (
		x: number,
		y: number,
		width: number,
		height: number,
		key: string | undefined = undefined
	) => platforms.create(x, y, key).setOrigin(0, 0).setDisplaySize(width, height).refreshBody();

	// left side platforms
	createPlatform(0, 7 * uh, 2 * uw, uh);
	createPlatform(uw, 14 * uh, 2 * uw, uh);
	createPlatform(uw, 21 * uh, 2 * uw, uh);
	createPlatform(7 * uw, 17.5 * uh, 2 * uw, uh);
	createPlatform(3 * uw, 28 * uh, 4 * uw, uh);

	// right side platforms
	createPlatform(30 * uw, 7 * uh, 2 * uw, uh);
	createPlatform(29 * uw, 14 * uh, 2 * uw, uh);
	createPlatform(29 * uw, 21 * uh, 2 * uw, uh);
	createPlatform(23 * uw, 17.5 * uh, 2 * uw, uh);
	createPlatform(25 * uw, 28 * uh, 4 * uw, uh);

	// center platforms
	createPlatform(13 * uw, 21 * uh, 2 * uw, uh);
	createPlatform(17 * uw, 21 * uh, 2 * uw, uh);
	createPlatform(9 * uw, 28 * uh, 14 * uw, uh);

	return platforms;
};

export const createBamboos = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unit;
	const uh = height / unit;
	const bamboos = scene.physics.add.staticGroup();

	const createBamboo = (
		x: number,
		y: number,
		width: number,
		height: number,
		key: string | undefined = undefined
	) => bamboos.create(x, y, key).setOrigin(0, 0).setDisplaySize(width, height).refreshBody();

	createBamboo(4.25 * uw, 7 * uh, uw / 4, 21 * uh);
	createBamboo(5.5 * uw, 14 * uh, uw / 4, 14 * uh);

	createBamboo(10.25 * uw, 7 * uh, uw / 4, 21 * uh);
	createBamboo(11.5 * uw, 14 * uh, uw / 4, 14 * uh);

	createBamboo(21.5 * uw, 7 * uh, uw / 4, 21 * uh);
	createBamboo(20.25 * uw, 14 * uh, uw / 4, 14 * uh);

	createBamboo(27.5 * uw, 7 * uh, uw / 4, 21 * uh);
	createBamboo(26.25 * uw, 14 * uh, uw / 4, 14 * uh);
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

	// player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.setScale(1.2);

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
	scene: Phaser.Scene,
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
) => {
	const { width, height } = scene.scale;
	const uw = width / unit;
	const uh = height / unit;

	if (cursors?.left.isDown) {
		player.setVelocityX(-uw * 4);
		player.anims.play('left', true);
	} else if (cursors?.right.isDown) {
		player.setVelocityX(uw * 4);
		player.anims.play('right', true);
	} else {
		player.setVelocityX(0);
		player.anims.play('turn');
	}

	if (cursors?.up.isDown && player.body.touching.down) {
		player.setVelocityY(-uh * 16);
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
