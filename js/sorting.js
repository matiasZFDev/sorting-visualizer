const speed = 100;

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

const insertionSort = async (arr, speedMult, parent) => {
	const delay = speed / speedMult;
	let i, j, cur;

	for (i = 1; i < arr.length; i++) {
		const curHeight = parent.children[i].style.height;
		cur = arr[i];
		j = i - 1;
		parent.children[i].classList.add('iterator');
		await sleep(delay);

		while (j >= 0 && arr[j] > cur) {
			arr[j + 1] = arr[j];
			parent.children[j].classList.add('comparing');
			parent.children[j + 1].classList.add('comparing');
			 // not according to the original
			parent.children[j + 1].style.height = parent.children[j].style.height;
			j--;
			await sleep(delay);
			parent.children[j + 2].classList.remove('comparing');
		}

		arr[j + 1] = cur;
		parent.children[j + 1].style.height = curHeight;
		parent.children[j + 1].classList.remove('comparing');
		parent.children[i].classList.remove('iterator');
	}

	while (i > 0) {
		parent.children[--i].classList.add('sorted');
		await sleep(delay);
	}
}

const merge = async (arr, speedMult, parent, left, right, leftStart, rightStart) => {
	const delay = speed / speedMult;
	const sorted = Array(left.length + right.length);
	let i = 0, j = 0, k = 0;

	while (j < left.length && k < right.length) {
		parent.children[leftStart + j].classList.add('comparing');
		parent.children[rightStart + k].classList.add('comparing');
		await sleep(delay);

		if (left[j] < right[k]) {
			sorted[i] = left[j];
			parent.children[leftStart + j].classList.remove('comparing');
			j++;
		} else {
			sorted[i] = right[k];
			parent.children[rightStart + k].classList.remove('comparing');
			parent.insertBefore(parent.children[rightStart + k], parent.children[leftStart + j]);
			leftStart++;
			k++;
		}

		i++;
	}

	if (j === left.length) {
		parent.children[leftStart + j - 1].classList.add('comparing');

		for (k; k < right.length - 1; k++, i++) {
			sorted[i] = right[k];
			parent.children[rightStart + k].classList.add('comparing');
			await sleep(delay);
			parent.children[rightStart + k].classList.remove('comparing');
		}

		sorted[i] = right[k];
		parent.children[rightStart + k].classList.add('comparing');
		await sleep(delay);
		parent.children[rightStart + k].classList.remove('comparing');
		parent.children[leftStart + j - 1].classList.remove	('comparing');
	}

	if (k === right.length) {
		parent.children[leftStart + j - 1].classList.add('comparing');

		for (j; j < left.length - 1; j++, i++) {
			sorted[i] = left[j];
			parent.children[leftStart + j].classList.add('comparing');
			await sleep(delay);
			parent.children[leftStart + j].classList.remove('comparing');
			console.log(parent.children[leftStart + j]);
		}

		sorted[i] = left[j];
		parent.children[leftStart + j - 1].classList.add('comparing');
		await sleep(delay);
		parent.children[leftStart + j - 1].classList.remove('comparing');
		parent.children[rightStart + k - 1].classList.remove('comparing');
		console.log(parent.children[leftStart + j - 1], parent.children[rightStart + k - 1]);
	}


	return sorted;
}

const mergeSort = async (arr, speedMult, parent, curArr, start = 0) => {
	if (arr.length < 2) return arr;
	const mid = Math.floor(arr.length / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);
	const sortedLeft = await mergeSort(left, speedMult, parent, curArr, start);
	const sortedRight = await mergeSort(right, speedMult, parent, curArr, start + mid);
	return await merge(curArr, speedMult, parent, sortedLeft, sortedRight, start, start + mid);
}

const sortMap = {
	bubble: bubbleSort,
	selection: selectionSort,
	insertion: insertionSort,
	merge: mergeSort,
}

const sort = async (arr, type, speedMult, parent) => {
	await sortMap[type](arr, speedMult, parent);
}

export { sort, };