const unitX = 64;
const unitY = 36;

// Type definition for Operator
export type Operator = 'plus' | 'minus' | 'multiply' | 'divide';

// Array to hold the selected numbers and operator
const picks: [number, Operator | undefined, number] = [0, undefined, 0];

// Set the current operator
export const setOperator = (operator: Operator | undefined) => {
	picks[1] = operator;
};

// Create platforms for the game
export const createPlatforms = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const platforms = scene.physics.add.staticGroup();

	const platformData = [
		// Left side platforms
		{ x: 0, y: 4.5, width: 4, key: 'collector-left' },
		{ x: 2, y: 13.5, width: 4, key: 'oi-plus-0', name: 'oi-plus' },
		{ x: 2, y: 22.5, width: 4, key: 'oi-multiply-0', name: 'oi-multiply' },
		{ x: 6, y: 31.5, width: 8, height: 6, key: 'secondary-island' },
		{ x: 14, y: 18, width: 4, height: 1 },
		// Right side platforms
		{ x: 60, y: 4.5, width: 4 },
		{ x: 58, y: 13.5, width: 4, key: 'oi-minus-0', name: 'oi-minus' },
		{ x: 58, y: 22.5, width: 4, key: 'oi-divide-0', name: 'oi-divide' },
		{ x: 50, y: 31.5, width: 8, height: 6, key: 'secondary-island' },
		{ x: 46, y: 18, width: 4, height: 1 },
		// Center platforms
		{ x: 26, y: 22.5, width: 4, height: 1 },
		{ x: 34, y: 22.5, width: 4, height: 1 },
		{ x: 18, y: 31.5, width: 28, height: 6, key: 'primary-island' }
	];

	platformData.forEach(
		({ x, y, width, height = 2, key = 'floating-island', name = 'platform' }) => {
			const platform = platforms
				.create(x * uw, y * uh, key)
				.setName(name)
				.setOrigin(0, 0)
				.setDisplaySize(width * uw, height * uh)
				.refreshBody();

			if (name.includes('oi')) {
				platform.setBodySize(width * uw, 1.5 * uh);
			}
		}
	);

	return platforms;
};

// Create bamboos for the game
export const createBamboos = (scene: Phaser.Scene) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const bamboos = scene.physics.add.staticGroup();

	const bambooData = [
		// Left bamboos
		{ x: 8, y: 4.5, height: 27, key: 'bamboo-lg' },
		{ x: 11, y: 13.5, height: 18, key: 'bamboo' },
		// Center-left bamboos
		{ x: 20, y: 4.5, height: 27, key: 'bamboo-lg' },
		{ x: 23, y: 13.5, height: 18, key: 'bamboo' },
		// Center-right bamboos
		{ x: 43, y: 4.5, height: 27, key: 'bamboo-lg' },
		{ x: 40, y: 13.5, height: 18, key: 'bamboo' },
		// Right bamboos
		{ x: 55, y: 4.5, height: 27, key: 'bamboo-lg' },
		{ x: 52, y: 13.5, height: 18, key: 'bamboo' }
	];

	bambooData.forEach(({ x, y, height, key }) => {
		bamboos
			.create(x * uw, y * uh, key)
			.setOrigin(0, 0)
			.setDisplaySize(uw, height * uh)
			.refreshBody();
	});

	return bamboos;
};

// Handle spawning and collecting numbers in the game
export const handleNumbers = (
	scene: Phaser.Scene,
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;

	const xPos = [8, 20, 43, 55].map((x) => x * uw);
	const yPos = [5.75, 9.25, 12.75, 16.25, 19.75, 23.25, 26.75].map((y) => y * uh);
	let numberPos: [number, number][] = [];
	let numberSprites: Phaser.GameObjects.GameObject[] = [];

	const createNumber = (x: number, y: number) => {
		const ellipse = scene.add.ellipse(x + uw / 2, y + uh / 2, 1.5 * uw, 1.5 * uh, 0x3d6e70);
		const text = scene.add.text(x + uw / 5, y, String(Math.floor(Math.random() * 9) + 1));

		scene.physics.add.existing(ellipse, true);
		scene.physics.add.existing(text, true);

		scene.physics.add.overlap(
			player,
			ellipse,
			() => {
				if (picks[0] === 0 || (picks[1] !== undefined && picks[2] === 0)) {
					console.log(text.text);
					if (picks[0] === 0) picks[0] = Number(text.text);
					else {
						picks[2] = Number(text.text);
					}

					console.log(picks);
					document.dispatchEvent(new Event('evaluate-points'));
					ellipse.destroy();
					text.destroy();
					numberSprites = numberSprites.filter((s) => s !== ellipse && s !== text);
				}
			},
			undefined,
			scene
		);

		numberSprites.push(ellipse, text);
	};

	const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

	const spawnNumbers = () => {
		numberSprites.forEach((sprite) => sprite.destroy());
		numberPos = [];
		numberSprites = [];

		xPos.forEach((x) => {
			for (let i = 0; i < 5; i++) {
				const pos = [x, random(yPos)] as [number, number];
				if (!numberPos.some((nPos) => nPos[0] === pos[0] && nPos[1] === pos[1])) {
					createNumber(...pos);
					numberPos.push(pos);
				} else i--;
			}
		});
	};

	// Initial spawn
	spawnNumbers();

	// Schedule respawn every 24 seconds
	scene.time.addEvent({
		delay: 24000,
		callback: spawnNumbers,
		loop: true
	});
};

// Handle updating points based on operator and numbers collected
export const handlePoints = (scene: Phaser.Scene, operators: Phaser.GameObjects.GameObject[]) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;

	const text = scene.add.text(27.75 * uw, 21 * uh, String(picks[0]));

	document.addEventListener('evaluate-points', () => {
		operators.forEach((operator) => triggerOperator(operator, 'off'));
		const [no1, operator, no2] = picks;
		if (operator) {
			const value = {
				plus: no1 + no2,
				minus: no1 - no2,
				multiply: no1 * no2,
				divide: Math.round(no1 / no2)
			}[operator];
			picks[0] = value;
			picks[1] = undefined;
			picks[2] = 0;
		}
		text.setText(String(picks[0]));
	});
};

// Create the player sprite
export const createPlayer = (
	scene: Phaser.Scene,
	x: number,
	y: number,
	key: string,
	frame?: string | number
) => {
	const { width, height } = scene.scale;
	const uw = width / unitX;
	const uh = height / unitY;
	const player = scene.physics.add.sprite(x * uw, y * uh, key, frame);

	player.setBounce(0.2);
	player.setDisplaySize(2 * uw, 3 * uh);
	player.setSize(uw / 4, player.height);

	return player;
};

// Initialize player animations
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

// Handle world wrap-around for the player
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

// Handle player movement
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
		player.setVelocityY(-uh * 16);
	}
};

// Handle player movement on bamboo
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
};

// Trigger the operator's state
export const triggerOperator = (
	operator: Phaser.GameObjects.GameObject,
	state: 'on' | 'off' | undefined = undefined
) => {
	// @ts-ignore
	if ((operator.texture.key.includes('0') && state === undefined) || state === 'on') {
		// @ts-ignore
		operator.setTexture(operator.texture.key.replace('0', '1'));
	} else {
		// @ts-ignore
		operator.setTexture(operator.texture.key.replace('1', '0'));
	}
};
