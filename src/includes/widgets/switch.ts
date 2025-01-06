import * as UI from 'abm-ui';
import { WidgetSwitch } from 'abm-ui';
import { $panel } from './base';

export function widgetSwitch() {
	$panel(
		'switch',
		UI.$new<WidgetSwitch>('w-switch'),
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
