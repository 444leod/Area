import { MongoDBService } from "./MongoDBService";
import {AuthorizationsTypes, TokenDto} from "../dtos";
import { ObjectId } from 'mongodb';
import { google } from 'googleapis';
import axios from "axios";

type NewTokenGetter = (oldToken: TokenDto) => Promise<TokenDto>;

const authorizationRegenerator: { [key in AuthorizationsTypes]: NewTokenGetter } = {
    GOOGLE: getNewGoogleTokens,
    ATLASSIAN: getNewAtlassianTokens,
    GITHUB: getNonRenewableToken,
    SPOTIFY: getNonRenewableToken
};

export async function getAuthorizationToken(userId: ObjectId, type: AuthorizationsTypes, database: MongoDBService): Promise<TokenDto> {
    const auth = await database.getAuthorization(userId, type);
    if (!auth) {
        throw new Error(`No token found for user ${userId} and type ${type}`);
    }

    const { data } = auth;

    const now = new Date();

    if (data.expiration_date && data.expiration_date < now) {
        if (!authorizationRegenerator[type]) {
            throw new Error(`No regenerator found for type ${type}`);
        }
        const regenerator = authorizationRegenerator[type];
        const newToken = await regenerator(data);

        await database.updateAuthorizationData(userId, type, newToken)

        return newToken;
    }
    return data;
}

async function getNewGoogleTokens(oldToken: TokenDto): Promise<TokenDto> {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: oldToken.token,
        refresh_token: oldToken.refresh_token
    });

    const newTokens = await oauth2Client.refreshAccessToken();
    return {
        token: newTokens.credentials.access_token,
        refresh_token: newTokens.credentials.refresh_token,
        expiration_date: new Date(newTokens.credentials.expiry_date),
        created_at: new Date()
    } as TokenDto;
}

async function getNewAtlassianTokens(oldToken: TokenDto): Promise<TokenDto> {
        const response = await axios.post('https://auth.atlassian.com/oauth/token', {
            grant_type: 'refresh_token',
            client_id: process.env.ATLASSIAN_CLIENT_ID,
            client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
            refresh_token: oldToken.refresh_token
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { access_token, refresh_token, expires_in } = response.data;

        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);
        const createdAt = new Date();

        return {
            token: access_token,
            refresh_token,
            expiration_date: expirationDate,
            created_at: createdAt
        };
}

function getNonRenewableToken(oldToken: TokenDto): Promise<TokenDto> {
    return new Promise((resolve, reject) => {
        if (oldToken) {
            resolve(oldToken);
        } else {
            reject(new Error('Invalid token'));
        }
    });
}