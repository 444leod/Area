import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DateInput from '../../../../../lib/components/new-area/Inputs/DateInput.svelte';
import NumberInput from '../../../../../lib/components/new-area/Inputs/NumberInput.svelte';
import Select from '../../../../../lib/components/new-area/Inputs/Select.svelte';
import StringInput from '../../../../../lib/components/new-area/Inputs/StringInput.svelte';
import TextInput from '../../../../../lib/components/new-area/Inputs/TextInput.svelte';

// Mock variables pour tous les tests
const mockDynamicVariables = [
	{
		name: 'dateVar',
		type: 'date',
		description: 'A date variable',
		template: '2024-01-01'
	},
	{
		name: 'numberVar',
		type: 'number',
		description: 'A number variable',
		template: '42'
	},
	{
		name: 'stringVar',
		type: 'string',
		description: 'A string variable',
		template: 'example text'
	}
];

// Tests DateInput
describe('DateInput', () => {
	const defaultProps = {
		param: { name: 'testDate', details: 'Test date input' },
		value: '',
		required: false,
		dynamicVariables: mockDynamicVariables,
		updateParamValue: vi.fn()
	};

	it('should render in static mode by default', () => {
		const { container } = render(DateInput, defaultProps);
		expect(container.querySelector('input[type="datetime-local"]')).toBeTruthy();
	});

	it('should toggle between static and dynamic modes', async () => {
		const { container, getByText } = render(DateInput, defaultProps);

		const toggleButton = getByText('Static');
		await fireEvent.click(toggleButton);

		expect(container.querySelector('select')).toBeTruthy();
		expect(getByText('Dynamic')).toBeTruthy();
	});

	it('should update value when date is selected', async () => {
		const { container } = render(DateInput, defaultProps);
		const input = container.querySelector('input[type="datetime-local"]');

		await fireEvent.change(input!, { target: { value: '2024-01-01T12:00' } });
		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testDate', '2024-01-01T12:00');
	});

	it('should handle variable selection', async () => {
		const { getByText, container } = render(DateInput, defaultProps);

		// Switch to dynamic mode
		await fireEvent.click(getByText('Static'));

		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'dateVar' } });

		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testDate', '{{dateVar}}');
	});
});

// Tests NumberInput
describe('NumberInput', () => {
	const defaultProps = {
		param: { name: 'testNumber', details: 'Test number input' },
		value: 0,
		required: false,
		dynamicVariables: mockDynamicVariables,
		updateParamValue: vi.fn(),
		isAction: false
	};

	it('should render simple input in action mode', () => {
		const { container } = render(NumberInput, { ...defaultProps, isAction: true });
		expect(container.querySelector('input[type="number"]')).toBeTruthy();
		expect(container.querySelector('.variant-soft-primary')).toBeFalsy();
	});

	it('should handle number input', async () => {
		const { container } = render(NumberInput, defaultProps);
		const input = container.querySelector('input[type="number"]');

		await fireEvent.input(input!, { target: { value: '42' } });
		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testNumber', 42);
	});

	it('should handle variable selection in reaction mode', async () => {
		const { getByText, container } = render(NumberInput, defaultProps);

		await fireEvent.click(getByText('Static'));
		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'numberVar' } });

		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testNumber', '{{numberVar}}');
	});
});

// Tests Select
describe('Select', () => {
	const defaultProps = {
		options: ['Option 1', 'Option 2', 'Option 3'],
		value: '',
		required: false,
		dynamicVariables: mockDynamicVariables,
		isAction: false
	};

	it('should render options correctly', () => {
		const { getAllByRole } = render(Select, defaultProps);
		const options = getAllByRole('option');
		expect(options.length).toBe(defaultProps.options.length + 1); // +1 for default option
	});

	it('should emit change event when option selected', async () => {
		const { component, container } = render(Select, defaultProps);
		const mockChange = vi.fn();
		component.$on('change', mockChange);

		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'Option 1' } });

		expect(mockChange).toHaveBeenCalled();
	});

	it('should handle variable selection in reaction mode', async () => {
		const { getByText, container, component } = render(Select, defaultProps);
		const mockChange = vi.fn();
		component.$on('change', mockChange);

		await fireEvent.click(getByText('Static'));
		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'stringVar' } });

		expect(mockChange).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: '{{stringVar}}'
			})
		);
	});
});

// Tests StringInput
describe('StringInput', () => {
	const defaultProps = {
		param: { name: 'testString', details: 'Test string input' },
		value: '',
		required: false,
		dynamicVariables: mockDynamicVariables,
		updateParamValue: vi.fn(),
		isAction: false
	};

	it('should render simple input in action mode', () => {
		const { container } = render(StringInput, { ...defaultProps, isAction: true });
		expect(container.querySelector('input[type="text"]')).toBeTruthy();
		expect(container.querySelector('.variant-soft-primary')).toBeFalsy();
	});

	it('should handle text input', async () => {
		const { container } = render(StringInput, defaultProps);
		const input = container.querySelector('input[type="text"]');

		await fireEvent.input(input!, { target: { value: 'test text' } });
		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testString', 'test text');
	});

	it('should handle variable selection in reaction mode', async () => {
		const { getByText, container } = render(StringInput, defaultProps);

		await fireEvent.click(getByText('Static'));
		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'stringVar' } });

		expect(defaultProps.updateParamValue).toHaveBeenCalledWith('testString', '{{stringVar}}');
	});

	it('should filter variables correctly', async () => {
		const { getByText, container } = render(StringInput, defaultProps);

		await fireEvent.click(getByText('Static'));
		const options = container.querySelectorAll('option');

		// Should not include date/number variables in string selection
		const optionTexts = Array.from(options).map((opt) => opt.textContent);
		expect(optionTexts.join('')).not.toContain('numberVar');
		expect(optionTexts.join('')).not.toContain('dateVar');
	});

	it('should handle required attribute', () => {
		const { container } = render(StringInput, { ...defaultProps, required: true });
		const input = container.querySelector('input');
		expect(input?.required).toBe(true);
	});

	it('should show example template when variable selected', async () => {
		const { getByText, container } = render(StringInput, defaultProps);

		await fireEvent.click(getByText('Static'));
		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'stringVar' } });

		expect(container.textContent).toContain('example text');
	});
});

describe('TextInput', () => {
	const defaultProps = {
		param: { name: 'testParam', details: 'Test details' },
		value: '',
		required: false,
		updateParamValue: vi.fn(),
		dynamicVariables: [
			{
				name: 'testVar',
				type: 'text',
				description: 'Test variable',
				template: 'test template'
			},
			{
				name: 'numberVar',
				type: 'number',
				description: 'Number variable',
				template: '123'
			}
		],
		isAction: false
	};

	it('should render text input in action mode', () => {
		const { container, getByText } = render(TextInput, {
			...defaultProps,
			isAction: true
		});

		expect(container.querySelector('textarea')).toBeTruthy();
		expect(getByText('Text Input')).toBeTruthy();
	});

	it('should render text input with variables in reaction mode', async () => {
		const { container, getByText } = render(TextInput, defaultProps);

		expect(container.querySelector('textarea')).toBeTruthy();
		expect(getByText('Text Input with Variables')).toBeTruthy();
		expect(getByText('1 variables available')).toBeTruthy();
	});

	it('should handle text input changes', async () => {
		const updateParamValue = vi.fn();
		const { container } = render(TextInput, {
			...defaultProps,
			updateParamValue
		});

		const textarea = container.querySelector('textarea');
		await fireEvent.input(textarea!, { target: { value: 'test input' } });

		expect(updateParamValue).toHaveBeenCalledWith('testParam', 'test input');
	});

	it('should filter out non-text variables', () => {
		const { container } = render(TextInput, defaultProps);
		const select = container.querySelector('select');
		const options = select?.querySelectorAll('option');

		// Un pour l'option par défaut + une pour la variable texte
		expect(options?.length).toBe(2);
	});

	it('should insert variable at cursor position', async () => {
		const updateParamValue = vi.fn();
		const { container } = render(TextInput, {
			...defaultProps,
			updateParamValue,
			value: 'Hello  world' // Double espace pour la position du curseur
		});

		// Simuler la position du curseur
		const textarea = container.querySelector('textarea');
		Object.defineProperty(textarea, 'selectionStart', {
			value: 6
		});

		const select = container.querySelector('select');
		await fireEvent.change(select!, { target: { value: 'testVar' } });

		expect(updateParamValue).toHaveBeenCalledWith('testParam', 'Hello {{testVar}} world');
	});

	it('should handle required attribute', () => {
		const { container } = render(TextInput, {
			...defaultProps,
			required: true
		});

		const textarea = container.querySelector('textarea');
		expect(textarea?.required).toBe(true);
	});

	it('should show variable insertion tip in reaction mode', () => {
		const { getByText } = render(TextInput, defaultProps);

		expect(getByText(/Tip: Use the dropdown above/)).toBeTruthy();
	});

	it('should not show variables in action mode', () => {
		const { container, queryByText } = render(TextInput, {
			...defaultProps,
			isAction: true
		});

		expect(container.querySelector('select')).toBeFalsy();
		expect(queryByText(/variables available/)).toBeFalsy();
	});

	it('should update text value when external value changes', async () => {
		const { container, rerender } = render(TextInput, {
			...defaultProps,
			value: 'initial'
		});

		await rerender({ ...defaultProps, value: 'updated' });

		const textarea = container.querySelector('textarea');
		expect(textarea?.value).toBe('updated');
	});

	it('should handle placeholder text', () => {
		const { container } = render(TextInput, {
			...defaultProps,
			param: { name: 'test', details: 'Custom placeholder' }
		});

		const textarea = container.querySelector('textarea');
		expect(textarea?.placeholder).toBe('Custom placeholder');
	});
});

// Tests communs aux composants
describe('Common Input Features', () => {
	it('should handle empty dynamic variables array', () => {
		const { container } = render(StringInput, {
			param: { name: 'test', details: 'test' },
			value: '',
			required: false,
			dynamicVariables: [],
			updateParamValue: vi.fn(),
			isAction: false
		});

		expect(container.querySelector('select')).toBeFalsy();
	});
});
