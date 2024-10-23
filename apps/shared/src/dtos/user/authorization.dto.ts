export class TokenDto {
    token: string;
    refresh_token: string;
    created_at: Date;
    expiration_date: Date | null;
}

export class AuthorizationDto {
    type: string;
    data: TokenDto;
}
