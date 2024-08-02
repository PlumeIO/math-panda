import type ClassicGameScene from '$lib/scenes/classic.scene';
import { random } from '$lib/utils';

export default class NumberHandler {
	scene!: ClassicGameScene;
	intervalSec: number = 24;
	numberPositions: [number, number][] = []; // Position of all the existing numbers
	sprites: Phaser.GameObjects.GameObject[] = [];

	constructor(scene: ClassicGameScene) {
		this.scene = scene;
	}

	createNumber = (x: number, y: number) => {
		const { uw, uh } = this.scene;
		const ellipse = this.scene.add.ellipse(x + uw / 2, y + uh / 2, 1.5 * uw, 1.5 * uh, 0x3d6e70);
		const text = this.scene.add.text(x + uw / 5, y, String(Math.floor(Math.random() * 9) + 1));

		this.scene.physics.add.existing(ellipse, true);
		this.scene.physics.add.existing(text, true);

		this.scene.players.forEach((player) => {
			this.scene.physics.add.overlap(
				player.sprite,
				ellipse,
				() => {
					const picks = player.pointHandler.picks;
					if (picks[0] === 0 || (picks[1] !== undefined && picks[2] === 0)) {
						console.log(text.text);
						if (picks[0] === 0) picks[0] = Number(text.text);
						else {
							picks[2] = Number(text.text);
						}

						ellipse.destroy();
						text.destroy();
						this.sprites = this.sprites.filter((s) => s !== ellipse && s !== text);
					}
				},
				undefined,
				this.scene
			);
		});

		this.sprites.push(ellipse, text);
	};

	spawnNumbers = () => {
		this.sprites.forEach((sprite) => sprite.destroy());
		this.numberPositions = [];
		this.sprites = [];

		const { uw, uh } = this.scene;
		const xPos = this.scene.numberConfig.xPos.map((x) => x * uw);
		const yPos = this.scene.numberConfig.yPos.map((y) => y * uh);

		xPos.forEach((x) => {
			for (let i = 0; i < 5; i++) {
				const pos = [x, random(yPos)] as [number, number];
				if (!this.numberPositions.some((nPos) => nPos[0] === pos[0] && nPos[1] === pos[1])) {
					this.createNumber(...pos);
					this.numberPositions.push(pos);
				} else i--;
			}
		});
	};

	handleNumbers = () => {
		// Initial spawn
		this.spawnNumbers();

		// Schedule respawn every 24 seconds
		this.scene.time.addEvent({
			delay: this.intervalSec * 1000,
			callback: this.spawnNumbers,
			loop: true
		});
	};
}
