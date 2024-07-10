const unitX = 64;
const unitY = 36;

export const createPlatforms = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const platforms = scene.physics.add.staticGroup();

	const createPlatform = (
		x: number,
		y: number,
		width: number,
		height: number = 2,
		key: string | undefined = 'floating-island'
	) =>
		platforms
			.create(x * uw, y * uh, key)
			.setOrigin(0, 0)
			.setDisplaySize(width * uw, height * uh)
			.refreshBody();

	// // left side platforms
	createPlatform(0, 4.5, 4, 2);
	createPlatform(2, 13.5, 4, 2);
	createPlatform(2, 22.5, 4, 2);
	createPlatform(6, 31.5, 8, 6, 'secondary-island');
	createPlatform(14, 18, 4, 1);

	// // right side platforms
	createPlatform(60, 4.5, 4, 2);
	createPlatform(58, 13.5, 4, 2);
	createPlatform(58, 22.5, 4, 2);
	createPlatform(50, 31.5, 8, 6, 'secondary-island');
	createPlatform(46, 18, 4, 1);

	// // center platforms
	createPlatform(18, 31.5, 28, 6, 'secondary-island');
	createPlatform(26, 22.5, 4, 1);
	createPlatform(34, 22.5, 4, 1);

	return platforms;
};

export const createBamboos = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const bamboos = scene.physics.add.staticGroup();

	const createBamboo = (
		x: number,
		y: number,
		width: number = 1,
		height: number,
		key: string | undefined = undefined
	) => {
		bamboos
			.create(x * uw, y * uh, key)
			.setOrigin(0, 0)
			.setDisplaySize(width * uw, height * uh)
			.refreshBody();
	};

	createBamboo(8, 4.5, undefined, 27, 'bamboo-lg');
	createBamboo(11, 13.5, undefined, 18, 'bamboo');

	createBamboo(20, 4.5, undefined, 27, 'bamboo-lg');
	createBamboo(23, 13.5, undefined, 18, 'bamboo');

	createBamboo(43, 4.5, undefined, 27, 'bamboo-lg');
	createBamboo(40, 13.5, undefined, 18, 'bamboo');

	createBamboo(55, 4.5, undefined, 27, 'bamboo-lg');
	createBamboo(52, 13.5, undefined, 18, 'bamboo');

	appendNumbersOnBamboos(scene, [8, 20, 43, 55], [5.75, 9.25, 12.75, 16.25, 19.75, 23.25, 26.75]);

	return bamboos;
};

function appendNumbersOnBamboos(scene: Phaser.Scene, bamboosXPos: number[], numbersYPos: number[]) {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;

	bamboosXPos.forEach((x) => {
		x *= uw;
		numbersYPos.forEach((y) => {
			y *= uh;
			scene.add.ellipse(x + uw / 2, y + uh / 2, 1.5 * uw, 1.5 * uh, 0x3d6e70);
			scene.add.text(x + uw / 5, y, String(Math.floor(Math.random() * 9) + 1));
		});
	});
}

export const createPlayer = (
	scene: Phaser.Scene,
	x: number,
	y: number,
	key: string,
	frame?: string | number | undefined
) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const player = scene.physics.add.sprite(x * uw, y * uh, key, frame);

	// player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.setDisplaySize(2 * uw, 3 * uh);
	player.setSize(uw / 3, player.height);
	player.setOffset(uw / 1.25, 0);

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
	const uw = width / unitX;
	const uh = height / unitY;

	if (cursors?.left.isDown) {
		player.setVelocityX(-uw * 8);
		player.anims.play('left', true);
	} else if (cursors?.right.isDown) {
		player.setVelocityX(uw * 8);
		player.anims.play('right', true);
	} else {
		player.setVelocityX(0);
		player.anims.play('turn');
	}

	if (cursors?.up.isDown && player.body.touching.down) {
		// if (cursors?.up.isDown) {
		player.setVelocityY(-uh * 16);
	}
};

export const handlePlayerMovementOnBamboo = (
	scene: Phaser.Scene,
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined,
	bamboo: Phaser.Types.Physics.Arcade.GameObjectWithBody
) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;

	// Handle vertical movement
	if (cursors?.up.isDown) {
		player.setVelocityY(-uh * 8);
	} else if (cursors?.down.isDown) {
		player.setVelocityY(uh * 8);
	} else {
		player.setVelocityY(0);
	}

	// console.log(bamboo);
	// // Handle horizontal movement
	// if (cursors?.left.isDown) {
	// 	player.setX(bamboo.x - uw);
	// } else if (cursors?.right.isDown) {
	// 	player.setX(bamboo.x + uw);
	// } else {
	// 	player.setX(bamboo.x + uw / 2);
	// }
};
