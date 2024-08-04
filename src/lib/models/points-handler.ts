import type ClassicGameScene from '$lib/scenes/classic.scene';
import { triggerOperator } from '$lib/utils';

export type Operator = 'plus' | 'minus' | 'multiply' | 'divide';

export default class PointHandler {
	position: [number, number];
	scene: ClassicGameScene;
	picks: [number, Operator | undefined, number] = [0, undefined, 0];
	text!: Phaser.GameObjects.Text;

	constructor(scene: ClassicGameScene, position: PointHandler['position']) {
		this.scene = scene;
		this.position = position;
	}

	set operator(operator: Operator | undefined) {
		this.picks[1] = operator;
	}

	get operator() {
		return this.picks[1];
	}

	get points() {
		return this.picks[0];
	}

	create() {
		const { uw, uh } = this.scene;
		this.text = this.scene.add
			.text(this.position[0] * uw, this.position[1] * uh, String(this.picks[0]), {
				fontStyle: 'bold',
				fontFamily: 'Sans Serif',
				fontSize: 16 * 1.5,
				color: '#cfff70'
			})
			.setOrigin(0.5, 0.5);
	}

	evaluate = () => {
		const [no1, operator, no2] = this.picks;
		if (no1 && operator && no2) {
			const lastUsedOperator = this.scene.world.operators.children
				.getArray()
				.find((operator) => operator.name.includes(this.operator ?? ''))!;
			triggerOperator(lastUsedOperator, 'off');

			const value = {
				plus: no1 + no2,
				minus: no1 - no2,
				multiply: no1 * no2,
				divide: Math.round(no1 / no2)
			}[operator];
			this.picks[0] = value;
			this.picks[1] = undefined;
			this.picks[2] = 0;
		}
		this.text.setText(String(this.picks[0]));
	};
}
