import { getGreatest } from './array-utils.js';
import { sort } from './sorting.js';

let arr = [];
const max = 200;
const template = document.getElementById('sort-element-template').content;
const sortAnimation = document.getElementById('sort-animation');

const render = () => {
	const fragment = document.createDocumentFragment();
	const displayStyle = getComputedStyle(sortAnimation);
	const greatestElement = getGreatest(arr);
	const displayWidth = parseInt(displayStyle.getPropertyValue('width').slice(0, -2));
	const displayHeight = parseInt(displayStyle.getPropertyValue('height').slice(0, -2));
	const elementWidth = displayWidth / arr.length;
	const baseHeight = displayHeight / greatestElement;

	for (const value of arr) {
		const element = template.cloneNode(true);
		element.firstElementChild.style.width = elementWidth + 'px';
		element.firstElementChild.style.height = (baseHeight * value) + 'px';
		fragment.appendChild(element);
	}

	sortAnimation.innerHTML = '';
	sortAnimation.appendChild(fragment)
}

const rerollArray = (length) => {
	arr = new Array(length);

	for (let i = 0; i < length; i++) {
		arr[i] = Math.floor(Math.random() * max) + 1;
	}

	render();
}

const startAnimation = (type, speedMult, parent) => {
	return sort(arr, type, speedMult, parent);
}

export { rerollArray, startAnimation, };