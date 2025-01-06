import * as UI from 'abm-ui';
import { WidgetColor } from 'abm-ui';
import { $panel } from './base';

export function widgetColor() {
	$panel(
		'color',
		UI.$new<WidgetColor>('w-color'),
		[
			{
				type: 'boolean',
				key: 'readOnly',
			},
			{
				type: 'boolean',
				key: 'alpha',
			},
			{
				type: 'color',
				key: 'value',
			},
		],
		['change'],
	);
}
