import Player from '$lib/models/player';
import World from '$lib/models/world';
import NumberHandler from '$lib/models/number-handler';
import { type Operator } from '$lib/models/points-handler';
import { playerConstructor, triggerOperator } from '$lib/utils';
import { publish, subscribe } from '$lib/events';

export default class ClassicGameScene extends Phaser.Scene {
	players: Player[] = [];
	world!: World;
	targetValue!: Phaser.GameObjects.Text;

	uw: number = 0;
	uh: number = 0;

	constructor() {
		super('ClassicGameScene');
	}

	// Preload game assets
	preload = () => {
		this.uw = this.scale.width / 64;
		this.uh = this.scale.height / 36;

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
	};

	// Create game scene
	create = () => {
		// Set up the background
		this.add
			.image(0, 0, 'background')
			.setOrigin(0, 0)
			.setDisplaySize(this.scale.width, this.scale.height);

		this.players.push(
			playerConstructor.player1(this),
			playerConstructor.player2(this),
			playerConstructor.player3(this),
			playerConstructor.player4(this)
		);

		this.world = new World(this);
		this.world.create();

		this.targetValue = this.add
			.text(32 * this.uw, 16 * this.uh, String(Math.round(Math.random() * 99)), {
				fontStyle: 'bold',
				fontFamily: 'Sans Serif',
				fontSize: 16 * 4,
				color: '#8fde5d'
			})
			.setOrigin(0.5, 0.5);

		new NumberHandler(this).handleNumbers();

		this.players.forEach((player) => {
			// Add collision between player and platforms
			this.physics.add.collider(player.sprite, this.world.platforms);
			this.physics.add.collider(
				player.sprite,
				this.world.operators,
				this.eventHandler.onPlatformCollide,
				undefined,
				this
			);
			this.physics.add.overlap(
				player.sprite,
				this.world.bamboos,
				this.eventHandler.onBambooCollide,
				undefined,
				this
			);
		});

		subscribe('player-interact-with-world', () => {
			this.eventHandler.onPlayerInteractWithWorld();
		});
	};

	// Update game state
	update = () => {
		this.players.forEach((player) => {
			player.update();
		});
	};

	eventHandler = {
		// Callback for when player collides with bamboo
		// @ts-ignore
		onBambooCollide: (eventPlayerSprite, bamboo) => {
			const player = this.players.find((player) => player.sprite === eventPlayerSprite)!;

			player.bambooInUse = bamboo as Phaser.Types.Physics.Arcade.GameObjectWithBody;
			player.sprite.body.allowGravity = false;
			player.sprite.setVelocityY(0); // Stop any falling motion

			publish('player-interact-with-world');
		},

		// Callback for when player collides with platform
		// @ts-ignore
		onPlatformCollide: (eventPlayerSprite, operator) => {
			const player = this.players.find((player) => player.sprite === eventPlayerSprite)!;

			// @ts-ignore
			if (operator.texture.key.includes('0')) {
				const lastUsedOperator = this.world.operators.children
					.getArray()
					.find((operator) => operator.name.includes(player.pointHandler.operator ?? ''));

				if (lastUsedOperator) triggerOperator(lastUsedOperator, 'off');

				player.pointHandler.operator = (
					operator as Phaser.Types.Physics.Arcade.GameObjectWithBody
				).name.replace('oi-', '') as Operator;

				triggerOperator(operator as Phaser.Types.Physics.Arcade.GameObjectWithBody, 'on');
			}
		},

		onPlayerInteractWithWorld: () => {
			this.players.forEach((player) => {
				player.pointHandler.evaluate();
			});
		}
	};

	worldConfig = {
		platforms: [
			// Left side platforms
			{ x: 0, y: 4.5, width: 4, key: 'collector-left' },
			{ x: 6, y: 31.5, width: 8, height: 6, key: 'secondary-island' },
			{ x: 14, y: 18, width: 4, height: 1 },
			// Right side platforms
			{ x: 60, y: 4.5, width: 4 },
			{ x: 50, y: 31.5, width: 8, height: 6, key: 'secondary-island' },
			{ x: 46, y: 18, width: 4, height: 1 },
			// Center platforms
			{ x: 26, y: 22.5, width: 4, height: 1 },
			{ x: 34, y: 22.5, width: 4, height: 1 },
			{ x: 18, y: 31.5, width: 28, height: 6, key: 'primary-island' }
		],

		bamboos: [
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
		],

		operators: [
			{ x: 2, y: 13.5, key: 'oi-plus-0', name: 'oi-plus' },
			{ x: 2, y: 22.5, key: 'oi-multiply-0', name: 'oi-multiply' },
			{ x: 58, y: 13.5, key: 'oi-minus-0', name: 'oi-minus' },
			{ x: 58, y: 22.5, key: 'oi-divide-0', name: 'oi-divide' }
		]
	};

	numberConfig = {
		xPos: [8, 20, 43, 55],
		yPos: [5.75, 9.25, 12.75, 16.25, 19.75, 23.25, 26.75]
	};
}
