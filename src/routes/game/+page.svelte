<script lang="ts">
	import { AUTO, Game } from 'phaser';
	import { onDestroy } from 'svelte';
	import {
		createBamboos,
		createPlatforms,
		createPlayer,
		handlePlayerMovement,
		handlePlayerMovementonBamboo,
		handleWorldWrap,
		initPlayerAnimations
	} from './helpers';
	import MenuButton from '$lib/components/pause-button.svelte';

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
	let playerIsOnBamboo = false;

	const onBamboo: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
		playerIsOnBamboo = true;
		player.body.allowGravity = false;
		player.setVelocityY(0); // Stop any falling motion
	};

	function preload(this: Phaser.Scene) {
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	function create(this: Phaser.Scene) {
		player = createPlayer(this, 500, 500, 'dude');
		cursors = this.input.keyboard?.createCursorKeys();

		const platforms = createPlatforms(this);

		const bamboos = createBamboos(this);

		// Add collision between player and platforms
		this.physics.add.collider(player, platforms);
		this.physics.add.overlap(player, bamboos, onBamboo, undefined, this);

		initPlayerAnimations(this, 'dude');
	}

	function update(this: Phaser.Scene) {
		handleWorldWrap(this, player);
		handlePlayerMovement(this, player, cursors);

		if (playerIsOnBamboo) {
			handlePlayerMovementonBamboo(player, cursors);
		} else {
			player.body.allowGravity = true;
		}

		playerIsOnBamboo = false; // Reset the playerIsOnBamboo flag every frame
	}

	onDestroy(() => {
		game.destroy(true);
	});
</script>

<MenuButton />
<div id="main-scene"></div>
