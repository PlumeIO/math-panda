import type ClassicGameScene from '$lib/scenes/classic.scene';

export default class World {
	scene!: ClassicGameScene;
	bamboos!: Phaser.Physics.Arcade.StaticGroup;
	platforms!: Phaser.Physics.Arcade.StaticGroup;
	operators!: Phaser.Physics.Arcade.StaticGroup;

	constructor(scene: ClassicGameScene) {
		this.scene = scene;
		this.bamboos = scene.physics.add.staticGroup();
		this.platforms = scene.physics.add.staticGroup();
		this.operators = scene.physics.add.staticGroup();
	}

	create() {
		this.createBamboos();
		this.createPlatforms();
		this.createOperators();
	}

	createBamboos = () => {
		const { uw, uh } = this.scene;
		this.scene.worldConfig.bamboos.forEach(({ x, y, height, key }) => {
			this.bamboos
				.create(x * uw, y * uh, key)
				.setOrigin(0, 0)
				.setDisplaySize(uw, height * uh)
				.refreshBody();
		});
	};

	createPlatforms = () => {
		const { uw, uh } = this.scene;
		this.scene.worldConfig.platforms.forEach(
			({ x, y, width, height = 2, key = 'floating-island' }) => {
				this.platforms
					.create(x * uw, y * uh, key)
					.setOrigin(0, 0)
					.setDisplaySize(width * uw, height * uh)
					.refreshBody();
			}
		);
	};

	createOperators = () => {
		const { uw, uh } = this.scene;
		this.scene.worldConfig.operators.forEach(
			({ x, y, key = 'floating-island', name = 'platform' }) => {
				this.operators
					.create(x * uw, y * uh, key)
					.setName(name)
					.setOrigin(0, 0)
					.setDisplaySize(4 * uw, 2 * uh)
					.setBodySize(4 * uw, 1.5 * uh)
					.refreshBody();
			}
		);
	};
}
