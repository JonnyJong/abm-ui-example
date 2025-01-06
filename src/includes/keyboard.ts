import * as UI from 'abm-ui';

function bind(): Promise<Set<UI.KeysAllow> | null> {
	const binder = UI.keyboard.bind();
	if (!binder) return new Promise(() => null);
	const info = UI.$div();
	const dialog = new UI.Dialog({
		title: 'Press Key to Bind',
		content: info,
		actions: [],
	});
	dialog.open();
	binder.on('update', () => {
		info.textContent = [...binder.keys].join(' ');
	});
	return new Promise((resolve) => {
		binder.on('done', () => {
			dialog.close();
			resolve(binder.keys);
		});
	});
}

function refreshPanel(panel: HTMLElement) {
	const input = UI.$new<UI.WidgetText>('w-text');
	input.placeholder = 'ID';
	const btn = UI.$new<UI.WidgetBtn>('w-btn');
	btn.content.text = 'Add';
	btn.on('active', async () => {
		if (input.value.length === 0) return;
		const keys = await bind();
		if (!keys) return;
		UI.keyboard.add(input.value, keys);
		refreshPanel(panel);
	});

	panel.replaceChildren(
		...Object.entries(UI.keyboard.bindMap).map(([id, group]) => {
			return UI.$new(
				'tr',
				UI.$new('td', { data: { id } }, id),
				UI.$new(
					'td',
					...group.map((item) => {
						const btn = UI.$new<UI.WidgetBtn>('w-btn', { style: { display: 'inline-block' } });
						btn.content.text = [...item].join(' ');
						btn.on('active', async () => {
							const result = await UI.Dialog.confirm({
								title: `Unbind key "${[...item].join(' ')}" ?`,
								content: '',
							});
							if (!result) return;
							UI.keyboard.rm(id, item);
							refreshPanel(panel);
						});
						return btn;
					}),
				),
				UI.$new(
					'td',
					...(() => {
						const add = UI.$new<UI.WidgetBtn>('w-btn', { style: { display: 'inline-block' } });
						add.content.text = 'Add';
						add.on('active', async () => {
							const keys = await bind();
							if (!keys) return;
							UI.keyboard.add(id, keys);
							refreshPanel(panel);
						});
						const set = UI.$new<UI.WidgetBtn>('w-btn', { style: { display: 'inline-block' } });
						set.content.text = 'Set';
						set.on('active', async () => {
							const keys = await bind();
							if (!keys) return;
							UI.keyboard.set(id, [keys]);
							refreshPanel(panel);
						});
						const del = UI.$new<UI.WidgetBtn>('w-btn', { style: { display: 'inline-block' } });
						del.content.text = 'Delete';
						del.on('active', async () => {
							const result = await UI.Dialog.confirm({
								title: `Delete bind group "${id}" ?`,
								content: '',
							});
							if (!result) return;
							UI.keyboard.delete(id);
							refreshPanel(panel);
						});
						return [add, set, del];
					})(),
				),
			);
		}),
		UI.$new('tr', UI.$new('td', input), UI.$new('td'), UI.$new('td', btn)),
	);
}

export function initKeyboard() {
	const panel = UI.$('#dev-ui-keyboard')!;
	refreshPanel(panel);
	UI.keyboard.on('shortcut', (event) => {
		const tr = panel.querySelector<HTMLElement>(`[data-id="${event.key}"]`);
		if (!tr) return;
		tr.style.background = 'var(--theme)';
		setTimeout(() => {
			tr.style.background = '';
		}, 100);
	});
}
