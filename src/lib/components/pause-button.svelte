<script lang="ts">
	export let onPause: () => void = () => {};
	import { Pause, X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	let pauseButton: HTMLLabelElement;

	function handleKeyup(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			pauseButton.click();
			onPause();
		}
	}
	document.addEventListener('keyup', handleKeyup);

	onDestroy(() => {
		document.removeEventListener('keyup', handleKeyup);
	});
</script>

<!-- The button to open modal -->
<label
	for="pause-modal"
	class="btn btn-circle btn-outline btn-primary fixed top-4 right-4"
	bind:this={pauseButton}><Pause /></label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="pause-modal" class="modal-toggle" />
<div class="modal" role="dialog">
	<div class="modal-box flex flex-col items-center gap-4">
		<div class="modal-action -mb-10">
			<label for="pause-modal" class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
				><X /></label
			>
		</div>
		<h3 class="text-lg font-bold text-center">Paused</h3>
		<div>
			<a href="/">
				<button class="btn btn-wide">Back to Home</button>
			</a>
		</div>
	</div>
</div>
