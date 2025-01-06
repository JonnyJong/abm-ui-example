import * as UI from 'abm-ui';
import { WidgetCheckbox } from 'abm-ui';
import { $panel } from './base';

export function widgetCheckbox() {
	$panel(
		'checkbox',
		UI.$new<WidgetCheckbox>('w-checkbox', 'Hello world'),
		[
			{
				type: 'boolean',
				key: 'disabled',
			},
			{
				type: 'boolean',
				key: 'checked',
			},
		],
		['change'],
	);
}
