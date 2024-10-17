import { ApiResponseOptions } from '@nestjs/swagger';

export const UserUnauthorizedOptions: ApiResponseOptions = {
  description: "Invalid token",
  status: 401,  // Unauthorized
};

export const AuthorizationOkOptions: ApiResponseOptions = {
  description: "List of authorization types for the authenticated user.",
  status: 200,
  schema: {
    type: 'array',
    items: {
      type: 'string',
      example: 'Atlassian',
    },
  },
};

export const UserNotFoundOptions: ApiResponseOptions = {
  description: "User not found.",
  status: 404,
};
