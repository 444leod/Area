import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthentifiedUser, TokenPayload } from "./auth-interfaces";
import { Role } from "@area/shared";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  getTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user: AuthentifiedUser = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles?.map(v => Role[v])
      };
      request["user"] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
