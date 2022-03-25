const speed = 60;

const sleep = (milis) => {
	return new Promise((resolve) => {
		setTimeout(resolve, milis);
	});
}

const swap = (arr, i, j) => {
	[arr[i], arr[j]] = [arr[j], arr[i]];
}

const swapHeight = (parent, i, j) => {
	const height = parent.children[i].style.height;
	parent.children[i].style.height = parent.children[j].style.height;
	parent.children[j].style.height = height;
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
		for (k; k < right.length - 1; k++, i++) {
			sorted[i] = right[k];
			parent.children[rightStart + k].classList.add('comparing');
			parent.children[leftStart + j - 1].classList.add('comparing');
			await sleep(delay);
			parent.children[rightStart + k].classList.remove('comparing');
			parent.children[leftStart + j - 1].classList.remove('comparing');

			leftStart++;
		}

		sorted[i] = right[k];
		parent.children[rightStart + k].classList.add('comparing');
		parent.children[leftStart + j - 1].classList.add('comparing');
		await sleep(delay);
		parent.children[rightStart + k].classList.remove('comparing');
		parent.children[leftStart + j - 1].classList.remove	('comparing');
	}

	if (i < sorted.length && k === right.length) {
		for (j; j < left.length - 1; j++, i++) {
			sorted[i] = left[j];
			parent.children[rightStart + k - 1].classList.add('comparing');
			parent.children[leftStart + j].classList.add('comparing');
			await sleep(delay);
			parent.children[rightStart + k - 1].classList.remove('comparing');
			parent.children[leftStart + j].classList.remove('comparing');
		}

		sorted[i] = left[j];
		parent.children[leftStart + j - 1].classList.add('comparing');
		parent.children[rightStart + k - 1].classList.add('comparing');
		await sleep(delay);
		parent.children[leftStart + j - 1].classList.remove('comparing');
		parent.children[rightStart + k - 1].classList.remove('comparing');
	}

	return sorted;
}

const mergeSort = async (arr, speedMult, parent, start = 0) => {
	if (arr.length < 2) return arr;
	const mid = Math.floor(arr.length / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);
	const sortedLeft = await mergeSort(left, speedMult, parent, start);
	const sortedRight = await mergeSort(right, speedMult, parent, start + mid);
	return await merge(arr, speedMult, parent, sortedLeft, sortedRight, start, start + mid);
}

const partition = async (arr, speedMult, parent, left, right) => {
	const delay = speed / speedMult;
	const mid = Math.floor((left + right) / 2);
	const pivot = arr[mid];
	const pivotChild = parent.children[mid];
	pivotChild.classList.add('pivot');

	while (left <= right) {
		parent.children[left].classList.add('comparing');
		parent.children[right].classList.add('waiting');

		while (arr[left] < pivot) {
			await sleep(delay);
			parent.children[left].classList.remove('comparing');
			left++;
			parent.children[left].classList.add('comparing');
		}

		await sleep(delay);
		parent.children[left].classList.remove('comparing');
		parent.children[left].classList.add('waiting');
		parent.children[right].classList.remove('waiting');
		parent.children[right].classList.add('comparing');

		while (arr[right] > pivot) {
			await sleep(delay);
			parent.children[right].classList.remove('comparing');
			right--;
			parent.children[right].classList.add('comparing');
		}

		parent.children[left].classList.remove('waiting');
		parent.children[left].classList.add('comparing');
		await sleep(delay);

		/* left > right: 
			could happen when one pointer stays at pivot
			and the other one stays two positions back
			to the pivot.
	
			o l o p+r o o

			so when its time to swap, the
			respectives increment and decrement, lets left and right
			in the same index and, the same time, one position back 
			or forward to the pivot.

			o o l+r p o o

			the thing is that left pointer could be lower than
			pivot (because that the current index has not been pointed before)
			or right pointer could be higher than pivot.
		*/

		parent.children[left].classList.remove('comparing');
		parent.children[right].classList.remove('comparing');

		if (left <= right) {
			swap(arr, left, right);
			swapHeight(parent, left, right);
			left++;
			right--;
		}
	}

	pivotChild.classList.remove('pivot');
	return left;
}

const quickSort = async (arr, speedMult, parent, left = 0, right = arr.length - 1) => {
	const pivot = await partition(arr, speedMult, parent, left, right);

	if (left < pivot - 1) {
		await quickSort(arr, speedMult, parent, left, pivot - 1);
	}

	if (right > pivot) {
		await quickSort(arr, speedMult, parent, pivot, right); //palomita
	}
}

const sortMap = {
	bubble: bubbleSort,
	selection: selectionSort,
	insertion: insertionSort,
	merge: mergeSort,
	quick: quickSort,
}

const sort = async (arr, type, speedMult, parent) => {
	const delay = speed / speedMult;
	await sortMap[type](arr, speedMult, parent);

	for (let i = 0; i < arr.length; i++) {
		parent.children[i].classList.add('sorted');
		await sleep(delay);
	}
}

export { sort, };