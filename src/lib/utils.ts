import Player from './models/player';
import PointHandler from './models/points-handler';
import type ClassicGameScene from './scenes/classic.scene';

// Trigger the operator's state
export function triggerOperator(
	operator: Phaser.GameObjects.GameObject,
	state: 'on' | 'off' | undefined = undefined
) {
	// @ts-ignore
	if ((operator.texture.key.includes('0') && state === undefined) || state === 'on') {
		// @ts-ignore
		operator.setTexture(operator.texture.key.replace('0', '1'));
	} else {
		// @ts-ignore
		operator.setTexture(operator.texture.key.replace('1', '0'));
	}
}

// Return a random element from the given array
export const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const playerConstructor = {
	player1: (scene: ClassicGameScene) =>
		new Player(scene, 28, 21, 'dude', new PointHandler(scene, [27.75, 21]), {
			up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP)!,
			left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)!,
			down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)!,
			right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)!
		}),

	player2: (scene: ClassicGameScene) =>
		new Player(scene, 36, 21, 'dude', new PointHandler(scene, [35.75, 21]), {
			up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)!,
			left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)!,
			down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)!,
			right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)!
		}),

	player3: (scene: ClassicGameScene) =>
		new Player(scene, 16, 16, 'dude', new PointHandler(scene, [15.75, 16]), {
			up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I)!,
			left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.J)!,
			down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K)!,
			right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.L)!
		}),

	player4: (scene: ClassicGameScene) =>
		new Player(scene, 48, 16, 'dude', new PointHandler(scene, [47.75, 16]), {
			up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.T)!,
			left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F)!,
			down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.G)!,
			right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.H)!
		})
};
