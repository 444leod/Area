// src/lib/store/areaStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { areaStore } from '../../../lib/store/areaStore';
import type { App, Action } from '@area/shared';

describe('areaStore', () => {
    beforeEach(() => {
        // Reset store before each test
        areaStore.reset();
    });

    it('should have correct initial state', () => {
        const state = get(areaStore);

        expect(state).toEqual({
            currentStep: 0,
            triggerApp: null,
            actionApp: null,
            selectedTrigger: null,
            selectedAction: null,
            automationName: '',
            actionDetails: null,
            reactionDetails: null
        });
    });

    it('should set trigger app correctly', () => {
        const mockApp: App = {
            _id: '1',
            name: 'TestApp',
            actions: [],
            reactions: []
        };

        areaStore.setTriggerApp(mockApp);
        const state = get(areaStore);

        expect(state.triggerApp).toEqual(mockApp);
    });

    it('should set action app correctly', () => {
        const mockApp: App = {
            _id: '1',
            name: 'TestApp',
            actions: [],
            reactions: []
        };

        areaStore.setActionApp(mockApp);
        const state = get(areaStore);

        expect(state.actionApp).toEqual(mockApp);
    });

    it('should set selected trigger with action details', () => {
        const mockTrigger: Action = {
            name: 'TestTrigger',
            description: 'Test Description',
            type: 'test_type',
            params: [],
            authorizations: []
        };

        areaStore.setSelectedTrigger(mockTrigger);
        const state = get(areaStore);

        expect(state.selectedTrigger).toEqual(mockTrigger);
        expect(state.actionDetails).toEqual({
            type: mockTrigger.type,
            params: {}
        });
    });

    it('should set selected action with reaction details', () => {
        const mockAction: Action = {
            name: 'TestAction',
            description: 'Test Description',
            type: 'test_type',
            params: [],
            authorizations: []
        };

        areaStore.setSelectedAction(mockAction);
        const state = get(areaStore);

        expect(state.selectedAction).toEqual(mockAction);
        expect(state.reactionDetails).toEqual({
            type: mockAction.type,
            params: {}
        });
    });

    it('should update automation name', () => {
        const testName = 'Test Automation';

        areaStore.setAutomationName(testName);
        const state = get(areaStore);

        expect(state.automationName).toBe(testName);
    });

    it('should update action parameters', () => {
        const mockTrigger: Action = {
            name: 'TestTrigger',
            description: 'Test Description',
            type: 'test_type',
            params: [],
            authorizations: []
        };

        areaStore.setSelectedTrigger(mockTrigger);
        areaStore.updateActionParam('testParam', 'testValue');

        const state = get(areaStore);
        expect(state.actionDetails?.params).toEqual({
            testParam: 'testValue'
        });
    });

    it('should update reaction parameters', () => {
        const mockAction: Action = {
            name: 'TestAction',
            description: 'Test Description',
            type: 'test_type',
            params: [],
            authorizations: []
        };

        areaStore.setSelectedAction(mockAction);
        areaStore.updateReactionParam('testParam', 'testValue');

        const state = get(areaStore);
        expect(state.reactionDetails?.params).toEqual({
            testParam: 'testValue'
        });
    });

    it('should handle multiple parameter updates', () => {
        const mockAction: Action = {
            name: 'TestAction',
            description: 'Test Description',
            type: 'test_type',
            params: [],
            authorizations: []
        };

        areaStore.setSelectedAction(mockAction);
        areaStore.updateReactionParam('param1', 'value1');
        areaStore.updateReactionParam('param2', 'value2');

        const state = get(areaStore);
        expect(state.reactionDetails?.params).toEqual({
            param1: 'value1',
            param2: 'value2'
        });
    });

    it('should reset store to initial state', () => {
        // Set some values first
        const mockApp: App = {
            _id: '1',
            name: 'TestApp',
            actions: [],
            reactions: []
        };

        areaStore.setTriggerApp(mockApp);
        areaStore.setAutomationName('Test');

        // Then reset
        areaStore.reset();

        const state = get(areaStore);
        expect(state).toEqual({
            currentStep: 0,
            triggerApp: null,
            actionApp: null,
            selectedTrigger: null,
            selectedAction: null,
            automationName: '',
            actionDetails: null,
            reactionDetails: null
        });
    });
});