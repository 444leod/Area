import { ApiResponseOptions } from '@nestjs/swagger';

export const UserUnauthorizedOptions: ApiResponseOptions = {
  description: "Invalid token",
  status: 401,  // Unauthorized
};

export const AuthorizationOkOptions: ApiResponseOptions = {
  description: "List of authorization types for the authenticated user.",
  status: 200,  // Success
  schema: {
    type: 'array',
    items: {
      type: 'string',
      example: 'Atlassian',  // Exemple de type d'autorisation
    },
  },
};

export const UserNotFoundOptions: ApiResponseOptions = {
  description: "User not found.",
  status: 404,  // Not Found
};
