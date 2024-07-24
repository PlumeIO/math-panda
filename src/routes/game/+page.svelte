<script lang="ts">
	import { AUTO, Game } from 'phaser';
	import { onDestroy } from 'svelte';
	import {
		createBamboos,
		handleNumbers,
		createPlatforms,
		createPlayer,
		handlePlayerMovement,
		handlePlayerMovementOnBamboo,
		handleWorldWrap,
		initPlayerAnimations,
		triggerOperator,
		handlePoints,
		setOperator,
		type Operator
	} from './helpers';
	import MenuButton from '$lib/components/pause-button.svelte';

	let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined,
		bamboos: Phaser.Physics.Arcade.StaticGroup,
		platforms: Phaser.Physics.Arcade.StaticGroup,
		operators: Phaser.GameObjects.GameObject[];

	const { innerWidth: width, innerHeight: height } = window;

	const config: Phaser.Types.Core.GameConfig = {
		type: AUTO,
		width: (16 * height) / 9 > width ? width : (16 * height) / 9,
		height: (16 * height) / 9 > width ? (9 * width) / 16 : height,
		parent: 'main-scene',
		backgroundColor: '#87CEEB',
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
	let bambooInUse: Phaser.Types.Physics.Arcade.GameObjectWithBody | undefined = undefined;

	const onBambooCollide: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_, bamboo) => {
		bambooInUse = bamboo as Phaser.Types.Physics.Arcade.GameObjectWithBody;
		player.body.allowGravity = false;
		player.setVelocityY(0); // Stop any falling motion
	};

	const onPlatformCollide: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_, platform) => {
		// @ts-ignore
		if (platform.name.includes('oi') && platform.texture.key.includes('0')) {
			operators.forEach((operator) => triggerOperator(operator, 'off'));
			setOperator(
				(platform as Phaser.Types.Physics.Arcade.GameObjectWithBody).name.replace(
					'oi-',
					''
				) as Operator
			);
			triggerOperator(platform as Phaser.Types.Physics.Arcade.GameObjectWithBody, 'on');
		}
	};

	function preload(this: Phaser.Scene) {
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.image('background', 'assets/background.webp');

		this.load.image('bamboo-lg', 'assets/bamboo-lg.png');
		this.load.image('bamboo', 'assets/bamboo.png');

		this.load.image('floating-island', 'assets/floating-island.png');
		this.load.image('secondary-island', 'assets/secondary-island.png');
		this.load.image('primary-island', 'assets/primary-island.png');

		this.load.image('collector-left', 'assets/collector-left.png');

		this.load.image('oi-plus-0', 'assets/operator-islands/oi-plus-0.png');
		this.load.image('oi-minus-0', 'assets/operator-islands/oi-minus-0.png');
		this.load.image('oi-multiply-0', 'assets/operator-islands/oi-multiply-0.png');
		this.load.image('oi-divide-0', 'assets/operator-islands/oi-divide-0.png');

		this.load.image('oi-plus-1', 'assets/operator-islands/oi-plus-1.png');
		this.load.image('oi-minus-1', 'assets/operator-islands/oi-minus-1.png');
		this.load.image('oi-multiply-1', 'assets/operator-islands/oi-multiply-1.png');
		this.load.image('oi-divide-1', 'assets/operator-islands/oi-divide-1.png');
	}

	function create(this: Phaser.Scene) {
		this.add
			.image(0, 0, 'background')
			.setOrigin(0, 0)
			.setDisplaySize(this.scale.width, this.scale.height);

		player = createPlayer(this, 16, 16, 'dude');
		cursors = this.input.keyboard?.createCursorKeys();

		platforms = createPlatforms(this);
		operators = platforms.children.getArray().filter((child) => child.name.includes('oi'));

		bamboos = createBamboos(this);

		handleNumbers(this, player);
		handlePoints(this, operators);

		// Add collision between player and platforms
		this.physics.add.collider(player, platforms, onPlatformCollide, undefined, this);
		this.physics.add.overlap(player, bamboos, onBambooCollide, undefined, this);

		initPlayerAnimations(this, 'dude');
	}

	function update(this: Phaser.Scene) {
		handleWorldWrap(this, player);
		handlePlayerMovement(this, player, cursors);

		if (bambooInUse) {
			handlePlayerMovementOnBamboo(this, player, cursors, bambooInUse);
		} else {
			player.body.allowGravity = true;
		}

		bambooInUse = undefined; // Reset the playerIsOnBamboo flag every frame
	}

	onDestroy(() => {
		game.destroy(true);
	});
</script>

<MenuButton />
<div id="main-scene"></div>
