import {describe, expect, it} from "vitest";
import {render} from "@testing-library/svelte";
import Success from "../../../../lib/components/new-area/Success.svelte";

describe('Success', () => {
    it('should apply correct styling', () => {
        const { container } = render(Success);

        expect(container.querySelector('.text-success')).toBeTruthy();
        expect(container.querySelector('.h2')).toBeTruthy();
        expect(container.querySelector('.flex.flex-col')).toBeTruthy();
    });
});
