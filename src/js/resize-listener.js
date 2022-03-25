export const addResizeListener = () => {
	const mainHeader = document.getElementById('main-header');
	const algorithmContainer = document.getElementById('algorithm-container');
	const algorithmElement = document.getElementById('algorithm-select');
	const moveWidth = 800;
	let isMoved = false;

	const moveCheck = () => {
		if (!isMoved && window.innerWidth <= moveWidth) {
			algorithmContainer.classList.add('hide');
			algorithmElement.classList.add('header-state');
			mainHeader.appendChild(algorithmElement);
			isMoved = true;
		}

		if (isMoved && window.innerWidth > moveWidth) {
			algorithmContainer.classList.remove('hide');
			algorithmElement.classList.remove('header-state');
			algorithmContainer.appendChild(algorithmElement);
			isMoved = false;
		}
	}

	moveCheck();
	window.addEventListener('resize', moveCheck);
}