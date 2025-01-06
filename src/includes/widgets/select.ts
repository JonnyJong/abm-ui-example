import * as UI from 'abm-ui';
import { WidgetSelect } from 'abm-ui';
import { range } from 'abm-utils';
import { numberToChinese } from '../../base';
import { $panel } from './base';

export function widgetSelect() {
	const select = UI.$new<WidgetSelect>('w-select');
	select.options = range(120).map((i) => {
		return {
			value: i,
			label: numberToChinese(i),
		};
	});
	$panel(
		'select',
		select,
		[
			{
				type: 'boolean',
				key: 'disabled',
			},
		],
		['change'],
	);
}
