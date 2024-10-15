import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
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
  private webOAuth2Client: OAuth2Client;
  private mobileOAuth2Client: OAuth2Client;

  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
  ) {
    this.webOAuth2Client = new google.auth.OAuth2(
        this.configService.get("GOOGLE_CLIENT_ID"),
        this.configService.get("GOOGLE_CLIENT_SECRET"),
        this.configService.get("GOOGLE_CALLBACK_URL")
    );

    this.mobileOAuth2Client = new google.auth.OAuth2(
        this.configService.get("GOOGLE_CLIENT_ID_MOBILE")
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
    try {
      const { tokens } = await this.webOAuth2Client.getToken(code);
      this.webOAuth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: this.webOAuth2Client });
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
    } catch (error) {
      throw new InternalServerErrorException("Error processing Google callback");
    }
  }

  async handleGoogleMobileAuth(token: string, refreshToken:string, isMobile: boolean) {
    try {
      let ticket;
      if (isMobile) {
        ticket = await this.mobileOAuth2Client.verifyIdToken({
          idToken: token,
          audience: this.configService.get("GOOGLE_CLIENT_ID_MOBILE"),
        });
      } else {
        ticket = await this.webOAuth2Client.verifyIdToken({
          idToken: token,
          audience: this.configService.get("GOOGLE_CLIENT_ID"),
        });
      }
      const payload = ticket.getPayload();
      console.log(JSON.stringify(payload));
      const googleServiceId = new ObjectId("64ff2e8e2a6e4b3f78abcd12");
      const user = await this.usersService.findOrCreateUser({
        email: payload.email,
        first_name: payload.given_name,
        last_name: payload.family_name,
        refreshToken: refreshToken,
        token: token,
        service_id: googleServiceId,
      });

      const jwtPayload = { sub: user._id.toHexString(), email: user.email };
      return {
        token: await this.jwtService.signAsync(jwtPayload),
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid Google token");
    }
  }

  async connectJira(code: string, req: Request) {
    const clientId = this.configService.get("JIRA_CLIENT_ID");
    const clientSecret = this.configService.get("JIRA_CLIENT_SECRET");
    const redirectUri = 'http://localhost:8081/login/oauth/jira';
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.error("error token");
      throw new UnauthorizedException("invalid Token");
    }

    if (!clientId || !clientSecret || !code) {
      console.error("Client ID, Client Secret or Code undefined:", {
        clientId, clientSecret, code
      });
      throw new UnauthorizedException("clientId or clientSecret invalide");
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
        console.error('Error on Altissian Request:', response.statusText);
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
        console.error('Error updating permission:', error);
        return 0;
      }
    } catch (error) {
      console.error('Error connecting to Jira:', error);
      return 0;
    }
  }



  async register(dto: UserRegistrationDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user != undefined) throw new ConflictException("User already exists");
    const newUser = await this.usersService.createUser(dto);
    const payload = { sub: newUser._id.toHexString(), email: newUser.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}