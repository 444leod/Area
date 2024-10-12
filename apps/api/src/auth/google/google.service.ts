import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleTokenService {
    constructor(private readonly configService: ConfigService) {}

    async getRefreshToken(code: string): Promise<string> {
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        const redirectUri = this.configService.get('GOOGLE_CALLBACK_URL');

        try {
            const response = await axios.post(tokenEndpoint, null, {
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                },
            });

            return response.data.refresh_token;
        } catch (error) {
            throw new Error('Failed to fetch refresh token');
        }
    }
}