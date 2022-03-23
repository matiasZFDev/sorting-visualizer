const speed = 30;

const sleep = (milis) => {
	return new Promise((resolve) => {
		setTimeout(resolve, milis);
	});
}

const swap = (arr, i, j) => {
	[arr[i], arr[j]] = [arr[j], arr[i]];
}

const bubbleSort = async (arr, speedMult, parent) => {
	const delay = speed / speedMult;
	let i, j;

	for (i = arr.length; i > 0; i--) {
		for (j = 0; j < i - 1; j++) {
			parent.children[j].classList.add('comparing');
			parent.children[j + 1].classList.add('comparing');

			await sleep(delay);

			parent.children[j].classList.remove('comparing');
			parent.children[j + 1].classList.remove('comparing');

			if (arr[j] > arr[j + 1]) {
				swap(arr, j, j + 1);
				parent.insertBefore(parent.children[j + 1], parent.children[j]);
			}
		}

		parent.children[j].classList.add('sorted');
	}
}

const selectionSort = async(arr, speedMult, parent) => {
	const delay = speed / speedMult;

	let i, j;

	for (i = 0; i < arr.length; i++) {
		let min = i;
		parent.children[i].classList.add('current');

		for (j = i + 1; j < arr.length; j++) {
			parent.children[j].classList.add('iterator');
			await sleep(delay);
			parent.children[j].classList.remove('iterator');

			if (arr[j] < arr[min]) {
				parent.children[min].classList.remove('swap');
				min = j;
				parent.children[j].classList.add('swap');
			}
		}

		const currentChild = parent.children[i];
		const nextSibling = parent.children[min].nextElementSibling;
		swap(arr, i, min);
		parent.children[min].classList.remove('swap');
		parent.children[min].classList.add('sorted');
		parent.children[i].classList.remove('current');
		parent.insertBefore(parent.children[min], parent.children[i]);
		parent.insertBefore(currentChild, nextSibling);
	}
}

const sortMap = {
	'bubble': bubbleSort,
	'selection': selectionSort,
}

const sort = (arr, type, speedMult, parent) => {
	return new Promise((resolve) => {
		sortMap[type](arr, speedMult, parent);
		resolve();
	});
}

export { sort, };