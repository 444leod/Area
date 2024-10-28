import {describe, expect, it} from "vitest";
import {render} from "@testing-library/svelte";
import ProgressBar from "../../../../lib/components/new-area/ProgressBar.svelte";

describe('ProgressBar', () => {
    const mockSteps = [
        { label: 'Step 1' },
        { label: 'Step 2' },
        { label: 'Step 3' }
    ];

    it('should render all steps', () => {
        const { container, getByText } = render(ProgressBar, {
            props: {
                steps: mockSteps,
                currentStep: 0
            }
        });

        mockSteps.forEach(step => {
            expect(getByText(step.label)).toBeTruthy();
        });
    });

    it('should highlight current and previous steps', () => {
        const { container } = render(ProgressBar, {
            props: {
                steps: mockSteps,
                currentStep: 1
            }
        });

        const stepElements = container.querySelectorAll('.flex-1');

        // Première étape devrait être surlignée
        expect(stepElements[0].querySelector('p')).toHaveClass('text-primary-500');
        // Étape courante devrait être surlignée
        expect(stepElements[1].querySelector('p')).toHaveClass('text-primary-500');
        // Étape suivante ne devrait pas être surlignée
        expect(stepElements[2].querySelector('p')).toHaveClass('text-surface-500');
    });

    it('should be hidden on mobile', () => {
        const { container } = render(ProgressBar, {
            props: {
                steps: mockSteps,
                currentStep: 0
            }
        });

        expect(container.firstChild).toHaveClass('hidden');
        expect(container.firstChild).toHaveClass('md:flex');
    });
});
