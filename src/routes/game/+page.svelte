<script lang="ts">
	// Import necessary modules and components
	import { AUTO, Game } from 'phaser';
	import { onDestroy } from 'svelte';
	import MenuButton from '$lib/components/pause-button.svelte';
	import ClassicGameScene from '$lib/scenes/classic.scene';

	// Get screen dimensions
	const { innerWidth: width, innerHeight: height } = window;

	// Configure the game
	const config: Phaser.Types.Core.GameConfig = {
		type: AUTO,
		// Maintains aspect ratio of 16:9 irrespective of width and height of window
		width: (16 * height) / 9 > width ? width : (16 * height) / 9,
		height: (16 * height) / 9 > width ? (9 * width) / 16 : height,
		parent: 'main-scene',
		backgroundColor: '#87CEEB',
		scene: [ClassicGameScene],
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 980, x: 0 },
				debug: false
			}
		}
	};

	// Initialize the game
	const game = new Game(config);

	// Clean up on component destruction
	onDestroy(() => {
		game.destroy(true);
	});
</script>

<!-- Menu button component and main scene container -->
<MenuButton />
<div id="main-scene"></div>
