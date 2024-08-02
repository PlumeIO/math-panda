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
