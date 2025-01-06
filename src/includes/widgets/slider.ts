import * as UI from 'abm-ui';
import { WidgetSlider } from 'abm-ui';
import { $panel } from './base';

export function widgetSlider() {
	$panel(
		'slider',
		UI.$new<WidgetSlider>('w-slider'),
		[
			{
				type: 'number',
				key: 'from',
			},
			{
				type: 'number',
				key: 'to',
			},
			{
				type: 'number',
				key: 'step',
			},
			{
				type: 'number',
				key: 'value',
			},
			{
				type: 'boolean',
				key: 'disabled',
			},
		],
		['change', 'input'],
	);
}
