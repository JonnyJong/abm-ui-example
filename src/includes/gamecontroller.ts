import * as UI from 'abm-ui';

function setup(id: number): HTMLElement {
	const pad = UI.GameController.getInstance(id);

	const connecting = UI.$new<UI.WidgetBtn>('w-btn');
	connecting.disabled = true;
	connecting.content.text = `${id} not connected`;
	pad.on('connectivity', (event) => {
		connecting.state = event.value ? 'primary' : '';
		connecting.content.text = `${id} ${event.value ? 'connected' : 'not connected'}`;
	});

	const lsPoint = UI.$div({
		style: {
			position: 'absolute',
			width: 3,
			height: 3,
			borderRadius: 3,
			background: 'var(--text)',
			translate: '99px 99px',
		},
	});
	const lsDirection = UI.$div({
		style: {
			position: 'absolute',
			background: 'var(--ui-panel-bg)',
			rotate: '45deg',
			width: 200,
			height: 200,
			top: -141.42,
			left: 0,
			opacity: '0',
		},
	});
	const ls = UI.$div(
		{
			style: {
				position: 'relative',
				width: 200,
				height: 200,
				borderRadius: 200,
				background: 'var(--ui-panel-bg)',
				overflow: 'hidden',
			},
		},
		lsDirection,
		lsPoint,
	);
	pad.on('ls', (event) => {
		lsPoint.style.left = `${event.x * 50}%`;
		lsPoint.style.top = `${event.y * 50}%`;
		const direction = pad.ls.direction;
		lsDirection.style.opacity = direction ? '1' : '0';
		let top = '';
		let left = '';
		switch (direction) {
			case 'up':
				top = '-141.42px';
				break;
			case 'right':
				left = '141.42px';
				break;
			case 'down':
				top = '141.42px';
				break;
			case 'left':
				left = '-141.42px';
				break;
		}
		lsDirection.style.top = top;
		lsDirection.style.left = left;
	});
	pad.on('lsb', () => {
		lsPoint.style.background = pad.lsb ? 'var(--theme)' : 'var(--text)';
	});
	const rsPoint = UI.$div({
		style: {
			position: 'absolute',
			width: 3,
			height: 3,
			borderRadius: 3,
			background: 'var(--text)',
			translate: '99px 99px',
		},
	});
	const rsDirection = UI.$div({
		style: {
			position: 'absolute',
			background: 'var(--ui-panel-bg)',
			rotate: '45deg',
			width: 200,
			height: 200,
			top: -141.42,
			left: 0,
			opacity: '0',
		},
	});
	const rs = UI.$div(
		{
			style: {
				position: 'relative',
				width: 200,
				height: 200,
				borderRadius: 200,
				background: 'var(--ui-panel-bg)',
				overflow: 'hidden',
			},
		},
		rsDirection,
		rsPoint,
	);
	pad.on('rs', (event) => {
		rsPoint.style.left = `${event.x * 50}%`;
		rsPoint.style.top = `${event.y * 50}%`;
		const direction = pad.rs.direction;
		rsDirection.style.opacity = direction ? '1' : '0';
		let top = '';
		let left = '';
		switch (direction) {
			case 'up':
				top = '-141.42px';
				break;
			case 'right':
				left = '141.42px';
				break;
			case 'down':
				top = '141.42px';
				break;
			case 'left':
				left = '-141.42px';
				break;
		}
		rsDirection.style.top = top;
		rsDirection.style.left = left;
	});
	pad.on('rsb', () => {
		rsPoint.style.background = pad.rsb ? 'var(--theme)' : 'var(--text)';
	});
	const lt = UI.$new<UI.WidgetProgressBar>('w-progress-bar');
	lt.value = 0;
	pad.on('lt', () => {
		lt.value = pad.lt * 100;
	});
	const lb = UI.$new<UI.WidgetBtn>('w-btn');
	lb.disabled = true;
	lb.content.text = 'LB';
	pad.on('lb', () => {
		lb.state = pad.lb ? 'primary' : '';
	});
	const left = UI.$div({ attr: { 'ui-layout': 'flow-column' } }, lt, lb, ls);
	const rt = UI.$new<UI.WidgetProgressBar>('w-progress-bar');
	rt.value = 0;
	pad.on('rt', () => {
		rt.value = pad.rt * 100;
	});
	const rb = UI.$new<UI.WidgetBtn>('w-btn');
	rb.disabled = true;
	rb.content.text = 'RB';
	pad.on('rb', () => {
		rb.state = pad.rb ? 'primary' : '';
	});
	const right = UI.$div({ attr: { 'ui-layout': 'flow-column' } }, rt, rb, rs);
	const upBtn = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'w' } });
	upBtn.disabled = true;
	upBtn.content.icon = 'ChevronUp';
	const rightBtn = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'd' } });
	rightBtn.disabled = true;
	rightBtn.content.icon = 'ChevronRight';
	const downBtn = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 's' } });
	downBtn.disabled = true;
	downBtn.content.icon = 'ChevronDown';
	const leftBtn = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'a' } });
	leftBtn.disabled = true;
	leftBtn.content.icon = 'ChevronLeft';
	pad.on('arrow', () => {
		upBtn.state = pad.up ? 'primary' : '';
		rightBtn.state = pad.right ? 'primary' : '';
		downBtn.state = pad.down ? 'primary' : '';
		leftBtn.state = pad.left ? 'primary' : '';
	});
	const arrows = UI.$div(upBtn, rightBtn, downBtn, leftBtn);
	arrows.style.cssText = `
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas:
			". w ."
			"a . d"
			". s .";
		height: max-content`;
	const y = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'w' } });
	y.disabled = true;
	y.content.text = 'Y';
	pad.on('y', () => {
		y.state = pad.y ? 'primary' : '';
	});
	const b = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'd' } });
	b.disabled = true;
	b.content.text = 'B';
	pad.on('b', () => {
		b.state = pad.b ? 'primary' : '';
	});
	const a = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 's' } });
	a.disabled = true;
	a.content.text = 'A';
	pad.on('a', () => {
		a.state = pad.a ? 'primary' : '';
	});
	const x = UI.$new<UI.WidgetBtn>('w-btn', { style: { gridArea: 'a' } });
	x.disabled = true;
	x.content.text = 'X';
	pad.on('x', () => {
		x.state = pad.x ? 'primary' : '';
	});
	const abxy = UI.$div(a, b, x, y);
	abxy.style.cssText = `
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas:
			". w ."
			"a . d"
			". s .";
		height: max-content`;
	const home = UI.$new<UI.WidgetBtn>('w-btn');
	home.content.text = 'Home';
	home.disabled = true;
	pad.on('home', () => {
		home.state = pad.home ? 'primary' : '';
	});
	const start = UI.$new<UI.WidgetBtn>('w-btn');
	start.content.text = 'Start';
	start.disabled = true;
	pad.on('start', () => {
		start.state = pad.start ? 'primary' : '';
	});
	const back = UI.$new<UI.WidgetBtn>('w-btn');
	back.content.text = 'Back';
	back.disabled = true;
	pad.on('back', () => {
		back.state = pad.back ? 'primary' : '';
	});
	const other = UI.$div({ attr: { 'ui-layout': 'flow-column' } }, home, start, back);
	const switchs = UI.$div({ attr: { 'ui-layout': 'flow' } }, left, right, arrows, abxy, other);
	const panel = UI.$div(connecting, switchs);

	return panel;
}

export function initGameController() {
	const panel = UI.$('#dev-ui-gamepad')!;
	panel.append(...[0, 1, 2, 3].map(setup));
}
