import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should return true when a valid token is provided", async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer validToken",
          },
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({ userId: 1 });

    const result = await authGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith("validToken", {
      secret: process.env.JWT_SECRET,
    });
  });

  it("should throw UnauthorizedException when no token is provided", async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException when an invalid token is provided", async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer invalidToken",
          },
        }),
      }),
    } as ExecutionContext;

    jest
      .spyOn(jwtService, "verifyAsync")
      .mockRejectedValue(new Error("Invalid token"));

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should correctly extract the token from the header", () => {
    const request = {
      headers: {
        authorization: "Bearer testToken",
      },
    };

    const token = authGuard.getTokenFromHeader(request);

    expect(token).toBe("testToken");
  });

  it("should return undefined if the authorization header is not Bearer", () => {
    const request = {
      headers: {
        authorization: "Basic testToken",
      },
    };

    const token = authGuard.getTokenFromHeader(request);

    expect(token).toBeUndefined();
  });
});
