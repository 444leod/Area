// src/lib/modules/allServices.test.ts
import { describe, it, expect } from 'vitest';
import { allServices} from "../../../lib/modules/allServices";
import { oauthGoogle} from "../../../lib/modules/oauthGoogle";
import { oauthAtlassian} from "../../../lib/modules/oauthAtlassian";
import { oauthGithub } from "../../../lib/modules/oauthGithub";

describe('allServices', () => {
    it('should contain the correct services', () => {
        expect(allServices).toHaveLength(3);
    });

    it('should have Google service configured correctly', () => {
        const googleService = allServices.find(service => service.name === 'Google');
        expect(googleService).toBeDefined();
        expect(googleService).toEqual({
            name: 'Google',
            description: 'Connect to use Google services in your automations',
            icon: 'devicon:google',
            oauthFunction: oauthGoogle
        });
    });

    it('should have Atlassian service configured correctly', () => {
        const atlassianService = allServices.find(service => service.name === 'Atlassian');
        expect(atlassianService).toBeDefined();
        expect(atlassianService).toEqual({
            name: 'Atlassian',
            description: 'Connect to use Atlassian in your automations',
            icon: 'logos:atlassian',
            oauthFunction: oauthAtlassian
        });
    });

    it('should have Github service configured correctly', () => {
        const githubService = allServices.find(service => service.name === 'Github');
        expect(githubService).toBeDefined();
        expect(githubService).toEqual({
            name: 'Github',
            description: 'Connect to use Github in your automations',
            icon: 'logos:github-icon',
            oauthFunction: oauthGithub
        });
    });
});