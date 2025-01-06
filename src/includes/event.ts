import * as UI from 'abm-ui';
import { clamp } from 'abm-utils';

function getBox(element?: HTMLDivElement): HTMLDivElement {
	if (!element) element = UI.$div();
	UI.$apply(element, {
		style: {
			width: 100,
			height: 100,
			background: 'var(--text)',
		},
	});
	return element;
}

//#region Hover
function hover() {
	const box = getBox(UI.$<HTMLDivElement>('#dev-e-hover')!);
	UI.events.hover.on(box, (event) => {
		UI.$apply(box, {
			style: {
				background: `var(--${event.hover ? 'theme' : 'text'})`,
			},
		});
	});
}

//#region Active
function active() {
	const box = getBox(UI.$<HTMLDivElement>('#dev-e-active')!);
	UI.events.active.on(box, (event) => {
		UI.$apply(box, {
			style: {
				background: `var(--${event.active ? 'theme' : 'text'})`,
			},
		});
	});
}

//#region Slide
function slide() {
	const panel = UI.$('#dev-e-slide')!;
	const box1 = getBox();
	box1.style.position = 'absolute';
	const box2 = getBox();
	box2.style.position = 'absolute';
	const info1 = UI.$div({
		style: {
			position: 'absolute',
			fontSize: 20,
			top: 0,
			left: 0,
			color: '#888',
			pointerEvents: 'none',
		},
		html: 'X: 0<br>Y: 0',
	});
	const info2 = UI.$div({
		style: {
			position: 'absolute',
			fontSize: 20,
			bottom: 0,
			left: 0,
			color: '#888',
			pointerEvents: 'none',
		},
		html: 'X: 0<br>Y: 0',
	});
	const board = UI.$div(
		{
			style: {
				width: '100%',
				height: 300,
				background: 'var(--ui-panel-bg)',
				position: 'relative',
			},
		},
		box1,
		box2,
		info1,
		info2,
	);
	panel.append(board);
	let diffX1 = 0;
	let diffY1 = 0;
	UI.events.slide.on(box1, (event) => {
		box1.style.background = event.state === 'end' ? 'var(--text)' : 'var(--theme)';
		if (event.state === 'start') {
			const { x, y } = box1.getBoundingClientRect();
			diffX1 = event.x - x;
			diffY1 = event.y - y;
			return;
		}
		const { width, height, x, y } = board.getBoundingClientRect();
		const finalX = clamp(0, event.x - diffX1 - x, width - 100);
		const finalY = clamp(0, event.y - diffY1 - y, height - 100);
		UI.$apply(box1, {
			style: {
				left: `${(finalX / width) * 100}%`,
				top: `${(finalY / height) * 100}%`,
			},
		});
		info1.innerHTML = `X: ${finalX}<br>Y: ${finalY}`;
	});
	let diffX2 = 0;
	let diffY2 = 0;
	UI.events.slide.on(box2, (event) => {
		box2.style.background = event.state === 'end' ? 'var(--text)' : 'var(--theme)';
		if (event.state === 'start') {
			const { x, y } = box2.getBoundingClientRect();
			diffX2 = event.x - x;
			diffY2 = event.y - y;
			return;
		}
		const { width, height, x, y } = board.getBoundingClientRect();
		const finalX = clamp(0, event.x - diffX2 - x, width - 100);
		const finalY = clamp(0, event.y - diffY2 - y, height - 100);
		UI.$apply(box2, {
			style: {
				left: `${(finalX / width) * 100}%`,
				top: `${(finalY / height) * 100}%`,
			},
		});
		info2.innerHTML = `X: ${finalX}<br>Y: ${finalY}`;
	});
}

//#region Init
export function initTestEvents() {
	hover();
	active();
	slide();
}
