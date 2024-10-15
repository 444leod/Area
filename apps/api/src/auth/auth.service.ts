import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { JwtService } from "@nestjs/jwt";
import { ObjectId } from "mongodb";
import { google } from "googleapis";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get("GOOGLE_CLIENT_ID"),
      this.configService.get("GOOGLE_CLIENT_SECRET"),
      this.configService.get("GOOGLE_CALLBACK_URL"),
    );
  }

  async login(dto: UserLoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new NotFoundException("User not found");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid password");

    const payload = { sub: user._id.toHexString(), email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async handleGoogleCallback(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();
    const googleServiceId = new ObjectId("64ff2e8e2a6e4b3f78abcd12");

    const user = await this.usersService.findOrCreateUser({
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
      token: tokens.access_token,
      refreshToken: tokens.refresh_token,
      service_id: googleServiceId,
    });

    const payload = { sub: user._id.toHexString(), email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async connectJira(code: string, req: any) {
    const clientId = this.configService.get("JIRA_CLIENT_ID");
    const clientSecret = this.configService.get("JIRA_CLIENT_SECRET");
    const redirectUri = 'http://localhost:8081/login/oauth/jira';
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.debug("erreur token");
      return 0;  // Unauthorized
    }

    if (!clientId || !clientSecret || !code) {
      console.error("Client ID, Client Secret ou Code manquant:", {
        clientId, clientSecret, code
      });
      return 0;  // Bad Request
    }

    try {
      const response = await fetch('https://auth.atlassian.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri
        })
      });

      if (!response.ok) {
        console.error('Erreur lors de la requête vers Atlassian:', response.statusText);
        return 0;
      }

      const data = await response.json();

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      try {
        const result = await this.usersService.addOrUpdateAuthorizationWithToken(token, {
          service_id: new ObjectId("64ff2e8e2a6e2c9d78abcd12"),
          type: 'JIRA',
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        return 1;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'autorisation:', error);
        return 0;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion à Jira:', error);
      return 0;
    }
  }



  async register(dto: UserRegistrationDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user != undefined) throw new ConflictException();
    const newUser = await this.usersService.createUser(dto);
    const payload = { sub: newUser._id.toHexString(), email: newUser.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
