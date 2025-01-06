import { WidgetBtn, WidgetColor, WidgetLang, WidgetNumber, WidgetSelect, WidgetText } from 'abm-ui';
import * as UI from 'abm-ui';

//#region Define
export interface PropertyItemBase {
	key: string;
	description?: string;
}
export interface PropertyItemString extends PropertyItemBase {
	type: 'string';
	default?: any;
}
export interface PropertyItemNumber extends PropertyItemBase {
	type: 'number';
	min?: number;
	max?: number;
	default?: number;
}
export interface PropertyItemBoolean extends PropertyItemBase {
	type: 'boolean';
}
export interface PropertyItemColor extends PropertyItemBase {
	type: 'color';
}
export interface PropertyItemEnum<V = any> extends PropertyItemBase {
	type: 'enum';
	options: V[];
}
export type PropertyItem =
	| PropertyItemString
	| PropertyItemNumber
	| PropertyItemBoolean
	| PropertyItemColor
	| PropertyItemEnum;

//#region Helper
function setValue(obj: any, key: string, value: any) {
	const keys = key.split('.');
	for (const key of keys.slice(0, keys.length - 1)) {
		obj = obj[key];
	}
	obj[keys.at(-1)!] = value;
}

function getValue(obj: any, key: string) {
	for (const k of key.split('.')) {
		obj = obj[k];
	}
	return obj;
}

function isIntersecting(target: HTMLElement): boolean {
	const { left, top, right, bottom } = target.getBoundingClientRect();
	const h = !(left > window.innerWidth || right < 0);
	const v = !(top > window.innerHeight || bottom < 0);
	return h && v;
}

function key2desc(key: string): string {
	return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, (a) => ` ${a}`);
}

//#region Prop
interface Prop {
	update(): void;
	readonly element: HTMLElement;
}
class PropString implements Prop {
	#target: HTMLElement;
	#key: string;
	#default: any;
	#element = UI.$new<WidgetText>('w-text', {
		event: {
			focus: () => {
				this.#block = true;
			},
			blur: () => {
				this.#block = false;
			},
		},
	});
	constructor(target: HTMLElement, options: PropertyItemString) {
		this.#target = target;
		this.#key = options.key;
		this.#default = options.default;
		this.update();
		this.#element.on('input', () => this.#set());
		this.#element.on('confirm', () => this.#set());
	}
	#block = false;
	update(): void {
		if (this.#block) return;
		let value = getValue(this.#target, this.#key);
		if (value === this.#default) value = '';
		this.#element.value = value;
	}
	#set() {
		let value = this.#element.value;
		if (value === '') value = this.#default;
		setValue(this.#target, this.#key, value);
	}
	get element() {
		return this.#element;
	}
}
class PropNumber implements Prop {
	#target: HTMLElement;
	#key: string;
	#element = UI.$new<WidgetNumber>('w-number', {
		event: {
			focus: () => {
				this.#block = true;
			},
			blur: () => {
				this.#block = false;
			},
		},
	});
	constructor(target: HTMLElement, options: PropertyItemNumber) {
		this.#target = target;
		this.#key = options.key;
		if (typeof options.min === 'number') this.#element.min = options.min;
		if (typeof options.max === 'number') this.#element.max = options.max;
		if (typeof options.default === 'number') this.#element.default = options.default;
		this.update();
		this.#element.on('input', () => setValue(this.#target, this.#key, this.#element.value));
		this.#element.on('confirm', () => setValue(this.#target, this.#key, this.#element.value));
	}
	#block = false;
	update(): void {
		if (this.#block) return;
		this.#element.value = getValue(this.#target, this.#key);
	}
	get element() {
		return this.#element;
	}
}
class PropBoolean implements Prop {
	#target: HTMLElement;
	#key: string;
	#element = UI.$new<WidgetBtn>('w-btn', { prop: { state: 'toggle' } });
	constructor(target: HTMLElement, options: PropertyItemBoolean) {
		this.#target = target;
		this.#key = options.key;
		this.#element.content = options.description ?? options.key;
		this.update();
		this.#element.on('active', () => setValue(this.#target, this.#key, this.#element.checked));
	}
	update(): void {
		this.#element.checked = getValue(this.#target, this.#key);
	}
	get element() {
		return this.#element;
	}
}
class PropColor implements Prop {
	#target: HTMLElement;
	#key: string;
	#element = UI.$new<WidgetColor>('w-color');
	constructor(target: HTMLElement, options: PropertyItemColor) {
		this.#target = target;
		this.#key = options.key;
		this.update();
		this.#element.on('change', () => setValue(this.#target, this.#key, this.#element.value));
	}
	update(): void {
		this.#element.value = getValue(this.#target, this.#key);
	}
	get element() {
		return this.#element;
	}
}
class PropEnum implements Prop {
	#target: HTMLElement;
	#key: string;
	#element = UI.$new<WidgetSelect>('w-select');
	constructor(target: HTMLElement, options: PropertyItemEnum) {
		this.#target = target;
		this.#key = options.key;
		this.update();
		this.#element.on('change', () => setValue(this.#target, this.#key, this.#element.value));
		this.#element.options = options.options.map((v) => {
			return {
				value: v,
				label: String(v),
			};
		});
	}
	update(): void {
		this.#element.value = getValue(this.#target, this.#key);
	}
	get element() {
		return this.#element;
	}
}

function createProp(target: HTMLElement, property: PropertyItem): Prop {
	switch (property.type) {
		case 'string':
			return new PropString(target, property);
		case 'number':
			return new PropNumber(target, property);
		case 'boolean':
			return new PropBoolean(target, property);
		case 'color':
			return new PropColor(target, property);
		case 'enum':
			return new PropEnum(target, property);
	}
}

//#region API
export function $propertiesPanel(target: HTMLElement, properties: PropertyItem[]): HTMLElement {
	const elements: HTMLElement[] = [];
	const props: Prop[] = [];
	const toggles: PropBoolean[] = [];

	for (const property of properties) {
		const prop = createProp(target, property);
		if (property.type === 'boolean') {
			toggles.push(prop as PropBoolean);
			continue;
		}
		props.push(prop);
		elements.push(UI.$div(property.description ?? key2desc(property.key)), prop.element);
	}
	if (toggles.length > 0) elements.push(UI.$div({ attr: { 'ui-layout': 'flow' } }, ...toggles.map((v) => v.element)));

	const frameController = new UI.AnimationFrameController(() => {
		for (const prop of [...props, ...toggles]) {
			prop.update();
		}
	});
	new IntersectionObserver((entries) => {
		entries[0].isIntersecting ? frameController.start() : frameController.stop();
	}).observe(target);

	setTimeout(() => {
		if (isIntersecting(target)) frameController.start();
	}, 1000);

	return UI.$div(
		{ attr: { 'ui-layout': 'flow-column' } },
		UI.$new('h6', UI.$new<WidgetLang>('w-lang', 'dev.properties')),
		...elements,
	);
}

export function $eventsPanel(target: HTMLElement, events: string[]): HTMLElement {
	return UI.$div(
		{ attr: { 'ui-layout': 'flow-column' } },
		UI.$new('h6', UI.$new<WidgetLang>('w-lang', 'dev.events')),
		UI.$div(
			{ attr: { 'ui-layout': 'flow' } },
			...events.map((type) => {
				const indicator = UI.$new<WidgetBtn>('w-btn', { prop: { state: 'toggle', disabled: true, content: type } });
				(target as any).on(type, () => {
					indicator.checked = true;
					setTimeout(() => {
						indicator.checked = false;
					}, 100);
				});
				return indicator;
			}),
		),
	);
}

export function $panel(id: string, target: HTMLElement, properties: PropertyItem[], events: string[]): HTMLElement {
	const panel = UI.$(`#dev-${id}`)!;
	panel.append(
		UI.$div({ style: { flex: '1' } }, target),
		UI.$div(
			{ attr: { 'ui-layout': 'flow-column' }, style: { maxWidth: 300, width: '100%' } },
			$propertiesPanel(target, properties),
			$eventsPanel(target, events),
		),
	);
	return panel;
}
