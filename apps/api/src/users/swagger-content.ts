import { ApiResponseOptions } from "@nestjs/swagger";

export const UserUnauthorizedOptions: ApiResponseOptions = {
  description: "Bad user token.",
  status: 401,
};

export const ProfileOkOptions: ApiResponseOptions = {
  description: "A test route that returns a user's informations.",
  status: 200,
  example: {
    _id: "deadbeefdeadbeefdeadbeef",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@cia.com",
    password: "SOMEHASHEDPASSWORD",
    authorizations: [],
    areas: []
  }
};

export const AuthorizationsOkOptions: ApiResponseOptions = {
  description: "List of authorization types for the authenticated user.",
  status: 200,
  example: [
    "Atlassian",
    "Google",
    "Jira",
  ],
};
