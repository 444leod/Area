import { SetMetadata } from "@nestjs/common";
import { Role } from "@area/shared";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
