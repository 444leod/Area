import { render, fireEvent } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import AvailableVariable from "../../../../lib/components/new-area/AvailableVariable.svelte";


describe('AvailableVariable', () => {
    const mockVariables = [
        {
            name: 'email',
            type: 'string',
            description: 'Email content',
            template: '{{email}}'
        }
    ];

    it('should render available variables', () => {
        const { getByText, container } = render(AvailableVariable, {
            props: {
                dynamicVariables: writable(mockVariables)
            }
        });

        expect(getByText('Available Variables')).toBeTruthy();
        expect(container.querySelector('.card')).toBeTruthy();
        expect(getByText('{{email}}')).toBeTruthy();
    });

    it('should handle variable expansion', async () => {
        const { getByText } = render(AvailableVariable, {
            props: {
                dynamicVariables: writable(mockVariables)
            }
        });

        const variableButton = getByText('{{email}}').closest('button');
        await fireEvent.click(variableButton!);
        expect(getByText('Email content')).toBeTruthy();
    });
});
