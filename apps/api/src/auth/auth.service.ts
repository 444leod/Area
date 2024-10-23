import { ConflictException, Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserLoginDto, UserRegistrationDto, AuthorizationsTypes } from '@area/shared';
import { JwtService } from '@nestjs/jwt';
import { ServicesService } from '../services/services.service';
import { ObjectId } from 'mongodb';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private webOAuth2Client: OAuth2Client;
    private mobileOAuth2Client: OAuth2Client;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly servicesService: ServicesService,
    ) {
        this.webOAuth2Client = new google.auth.OAuth2(
            this.configService.get('GOOGLE_CLIENT_ID'),
            this.configService.get('GOOGLE_CLIENT_SECRET'),
            this.configService.get('GOOGLE_CALLBACK_URL'),
        );

        this.mobileOAuth2Client = new google.auth.OAuth2(this.configService.get('GOOGLE_CLIENT_ID_MOBILE'));
    }

    async login(dto: UserLoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid password');

        const payload = { sub: user._id.toHexString(), email: user.email };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }

    async handleGoogleCallback(code: string) {
        try {
            const { tokens } = await this.webOAuth2Client.getToken(code);
            this.webOAuth2Client.setCredentials(tokens);

            const oauth2 = google.oauth2({ version: 'v2', auth: this.webOAuth2Client });
            const { data } = await oauth2.userinfo.get();
            const googleServiceId = new ObjectId('64ff2e8e2a6e4b3f78abcd12');

            const expiresIn = tokens.expiry_date ? (tokens.expiry_date - Date.now()) / 1000 : null;

            let expirationDate = null;
            if (expiresIn) {
                expirationDate = new Date();
                expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
            }

            const user = await this.usersService.findOrCreateUser({
                email: data.email,
                first_name: data.given_name,
                last_name: data.family_name,
                token: tokens.access_token,
                refreshToken: tokens.refresh_token,
                service_id: googleServiceId,
                expiration_date: expirationDate,
            });

            const payload = { sub: user._id.toHexString(), email: user.email };
            return {
                token: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            throw new InternalServerErrorException('Error processing Google callback');
        }
    }

    async handleGoogleMobileAuth(token: string, refreshToken: string, isMobile: boolean, expired_at: Date) {
        try {
            let ticket;
            if (isMobile) {
                ticket = await this.mobileOAuth2Client.verifyIdToken({
                    idToken: token,
                    audience: this.configService.get('GOOGLE_CLIENT_ID_MOBILE'),
                });
            } else {
                ticket = await this.webOAuth2Client.verifyIdToken({
                    idToken: token,
                    audience: this.configService.get('GOOGLE_CLIENT_ID'),
                });
            }
            const payload = ticket.getPayload();
            const googleServiceId = new ObjectId('64ff2e8e2a6e4b3f78abcd12');
            const user = await this.usersService.findOrCreateUser({
                email: payload.email,
                first_name: payload.given_name,
                last_name: payload.family_name,
                refreshToken: refreshToken,
                token: token,
                service_id: googleServiceId,
                expiration_date: expired_at,
            });

            const jwtPayload = { sub: user._id.toHexString(), email: user.email };
            return {
                token: await this.jwtService.signAsync(jwtPayload),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid Google token');
        }
    }

    async connectAtlassian(code: string, req: Request) {
        const clientId = this.configService.get('ATLASSIAN_CLIENT_ID');
        const clientSecret = this.configService.get('ATLASSIAN_CLIENT_SECRET');
        const redirectUri = `${process.env.FRONTEND_URL}/login/oauth/atlassian`;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('error token');
            throw new UnauthorizedException('invalid Token');
        }

        if (!clientId || !clientSecret || !code) {
            console.error('Client ID, Client Secret or Code undefined:', {
                clientId,
                clientSecret,
                code,
            });
            throw new UnauthorizedException('clientId or clientSecret invalide');
        }

        try {
            const response = await fetch('https://auth.atlassian.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    redirect_uri: redirectUri,
                }),
            });

            if (!response.ok) {
                console.error('Error on Altissian Request:', response.statusText);
                return 0;
            }

            const data = await response.json();

            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in;

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
            const createdAt = new Date();

            const AtlassianService = await this.servicesService.getServiceByName('Atlassian');
            try {
                await this.usersService.addOrUpdateAuthorizationWithToken(token, {
                    service_id: AtlassianService._id,
                    type: AuthorizationsTypes.ATLASSIAN,
                    data: {
                        token: accessToken,
                        refresh_token: refreshToken,
                        expiration_date: expirationDate,
                        created_at: createdAt,
                    },
                });

                return 1;
            } catch (error) {
                console.error('Error updating permission:', error);
                return 0;
            }
        } catch (error) {
            console.error('Error connecting to Atlassian:', error);
            return 0;
        }
    }

    async connectGithub(code: string, req: Request) {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const redirectUri = `${process.env.FRONTEND_URL}/login/oauth/github`;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('error token');
            throw new UnauthorizedException('invalid Token');
        }

        if (!clientId || !clientSecret || !code) {
            console.error('Client ID, Client Secret or Code missing');
            throw new Error('Invalid clientId, clientSecret, or code');
        }

        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    redirect_uri: redirectUri,
                }),
            });

            if (!response.ok) {
                console.error('Error on GitHub request:', response.statusText);
                return null;
            }

            const data = await response.json();

            const accessToken = data.access_token;

            if (!accessToken) {
                console.error('No access token received');
                return null;
            }

            const GithubService = await this.servicesService.getServiceByName('Github');

            const createdAt = new Date();

            const createdAt = new Date();

            try {
                const result = await this.usersService.addOrUpdateAuthorizationWithToken(token, {
                    service_id: GithubService._id,
                    type: AuthorizationsTypes.GITHUB,
                    data: {
                        token: accessToken,
                        refresh_token: null,
                        created_at: createdAt,
                        expiration_date: null,
                    },
                });

                return 1;
            } catch (error) {
                console.error('Error updating permission:', error);
                return 0;
            }
        } catch (error) {
            console.error('Error connecting to GitHub:', error);
            return null;
        }
    }

    async connectSpotify(code: string, req: Request) {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = `${process.env.FRONTEND_URL}/login/oauth/spotify`;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('error token');
            throw new UnauthorizedException('invalid Token');
        }

        if (!clientId || !clientSecret || !code) {
            console.error('Client ID, Client Secret or Code missing');
            throw new Error('Invalid clientId, clientSecret, or code');
        }

        try {
            const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${basicAuth}`
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri
                })
            });

            if (!response.ok) {
                console.error('Error on Spotify request:', response.statusText);
                return null;
            }

            const data = await response.json();

            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in;

            if (!accessToken) {
                console.error('No access token received');
                return null;
            }

            const SpotifyService = await this.adminService.getServiceByName('Spotify');

            const createdAt = new Date();
            const expirationDate = new Date(createdAt.getTime() + expiresIn * 1000);

            try {
                const result = await this.usersService.addOrUpdateAuthorizationWithToken(token, {
                    service_id: SpotifyService._id,
                    type: AuthorizationsTypes.SPOTIFY,
                    data: {
                        token: accessToken,
                        refresh_token: refreshToken,
                        created_at: createdAt,
                        expiration_date: expirationDate,
                    }
                });

                return 1;
            } catch (error) {
                console.error('Error updating permission:', error);
                return 0;
            }
        } catch (error) {
            console.error('Error connecting to Spotify:', error);
            return null;
        }
    }

    async connectGoogle(code: string, req: Request) {
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        const redirectUri = 'http://localhost:8081/login/oauth/google';
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('error token');
            throw new UnauthorizedException('invalid Token');
        }

        if (!clientId || !clientSecret || !code) {
            console.error('Client ID, Client Secret or Code undefined:', {
                clientId,
                clientSecret,
                code,
            });
            throw new UnauthorizedException('clientId or clientSecret invalide');
        }

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    redirect_uri: redirectUri,
                }),
            });

            if (!response.ok) {
                console.error('Error on Google Request:', response.statusText);
                return 0;
            }

            const data = await response.json();

            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in;

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

            const GoogleService = await this.servicesService.getServiceByName('Google task');

            const createdAt = new Date();

            const createdAt = new Date();

            try {
                await this.usersService.addOrUpdateAuthorizationWithToken(token, {
                    service_id: GoogleService._id,
                    type: AuthorizationsTypes.GOOGLE,
                    data: {
                        token: accessToken,
                        refresh_token: refreshToken,
                        created_at: createdAt,
                        expiration_date: expirationDate,
                    },
                });

                return 1;
            } catch (error) {
                console.error('Error updating permission:', error);
                return 0;
            }
        } catch (error) {
            console.error('Error connecting to Google:', error);
            return 0;
        }
    }

    async register(dto: UserRegistrationDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (user != undefined) throw new ConflictException('User already exists');
        const newUser = await this.usersService.createUser(dto);
        const payload = { sub: newUser._id.toHexString(), email: newUser.email };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
