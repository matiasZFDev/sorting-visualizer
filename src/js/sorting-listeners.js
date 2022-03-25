import { rerollArray, startAnimation } from './visualizer.js';

export const addSortingListeners = () => {
	const setupContainer = document.getElementById('setup');
	const arrayLengthSlider = document.getElementById('array-length-slider');
	const lengthOutput = document.getElementById('length-value');
	const displaySpeedSlider = document.getElementById('speed-slider');
	const speedOutput = document.getElementById('speed-value');
	const algorithmElement = document.getElementById('algorithm-select');
	const sortSelect = document.getElementById('sort-select');
	const sortDisplay = document.getElementById('sort-animation');
	const alreadySorted = document.getElementById('already-sorted');
	let sorted = false;

	rerollArray(arrayLengthSlider.valueAsNumber);
	alreadySorted.classList.add('hide');

	/* Refill */
	document.addEventListener('click', (e) => {
		if (e.target.id === 'refill-array-btn') {
			rerollArray(arrayLengthSlider.valueAsNumber);

			if (sorted) {
				alreadySorted.classList.add('hide');
				sorted = false;
			}
		}
	});

	/* Slider output */
	document.addEventListener('input', (e) => {
		if (e.target.id === 'array-length-slider') {
			lengthOutput.textContent = e.target.value;
			rerollArray(e.target.valueAsNumber);
			
			if (sorted) {
				alreadySorted.classList.add('hide');
				sorted = false;
			}
		}

		if (e.target.id === 'speed-slider') {
			speedOutput.textContent = e.target.value;
		}

		if (e.target.id === 'sort-select') {
			rerollArray(arrayLengthSlider.valueAsNumber);
			
			if (sorted) {
				alreadySorted.classList.add('hide');
				sorted = false;
			}
		}
	});

	/* Toggle animation */
	document.addEventListener('click', (e) => {
		if (e.target.id === 'toggle-animation') {
			if (sorted) {
				alreadySorted.classList.remove('hide');
				return;
			}

			startAnimation(
				sortSelect.value, 
				displaySpeedSlider.valueAsNumber,
				sortDisplay
			);
		}
	});

	/* Handle sorting */
	document.addEventListener('sorting-start', () => {
		setupContainer.classList.add('disable-blur');
		algorithmElement.classList.add('disable-blur');
	});

	document.addEventListener('sorting-end', () => {
		setupContainer.classList.remove('disable-blur');
		algorithmElement.classList.remove('disable-blur');
		sorted = true;
	});
}