const getGreatest = (arr) => {
	let greatest = arr[0];

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] > greatest) {
			greatest = arr[i];
		}
	}

	return greatest;
}

export { getGreatest, };