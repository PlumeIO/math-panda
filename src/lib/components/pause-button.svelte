<script lang="ts">
	export let onPause: () => void = () => {},
		onResume: () => void = () => {};
	import { Pause, X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	let pauseButton: HTMLLabelElement;

	function handlePause(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			pauseButton.click();
			onPause();
		}
	}
	document.addEventListener('keyup', handlePause);

	onDestroy(() => {
		document.removeEventListener('keyup', handlePause);
	});
</script>

<!-- The button to open modal -->
<button on:click={() => onPause()}>
	<label
		for="pause-modal"
		class="btn btn-circle btn-outline btn-primary fixed top-4 right-4"
		bind:this={pauseButton}><Pause /></label
	>
</button>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="pause-modal" class="modal-toggle" />
<div class="modal" role="dialog">
	<div class="modal-box flex flex-col items-center gap-4">
		<button class="modal-action -mb-10" on:click={onResume}>
			<label for="pause-modal" class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
				><X /></label
			>
		</button>
		<h3 class="text-lg font-bold text-center">Paused</h3>
		<div>
			<a href="/">
				<button class="btn btn-wide btn-neutral">Back to Home</button>
			</a>
		</div>
	</div>
</div>
