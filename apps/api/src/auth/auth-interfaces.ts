import { Role } from "@area/shared";

export interface AuthentifiedUser {
  id: string;
  email: string;
  roles: Role[];
}

export interface AuthRequest {
  user: AuthentifiedUser;
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}
