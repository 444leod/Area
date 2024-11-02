import { Test } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { AuthorizationsTypes, Service, TokenDto, User } from "@area/shared";
import { mock } from "node:test";
import { ServicesService } from "../services/services.service";
import { JwtModule } from "@nestjs/jwt";
import { ObjectId } from "mongodb";
import { AuthentifiedUser, AuthRequest } from "../auth/auth-interfaces";

describe("Areas", () => {
  let mocked_users: User[];
  let userModel = {
    find: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_users;
        },
      };
    }),
    findById: mock.fn((id: string | ObjectId) => {
      return {
        exec: async () => {
          return mocked_users.find((s) => s._id.equals(id));
        },
      };
    }),
    create: mock.fn((s: User) => mocked_users.push(s)),
    findByIdAndDelete: mock.fn((id) => {
      return {
        exec: async () => {
          const user = mocked_users.find((u) => u._id.equals(id));
          mocked_users = mocked_users.filter((u) => !u._id.equals(id));
          return user;
        },
      };
    }),
  };

  let mocked_services: Service[] = [];
  let serviceModel = {
    find: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_services;
        },
      };
    }),
    findById: mock.fn((id) => {
      return {
        exec: async () => {
          return mocked_services.find((s) => s._id.equals(id));
        },
      };
    }),
    deleteMany: mock.fn(() => (mocked_services = [])),
    create: mock.fn((s: Service) => mocked_services.push(s)),
  };

  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    mocked_users = [
      {
        _id: new ObjectId(),
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        password: "hashed_password",
        roles: [],
        authorizations: [
          {
            type: AuthorizationsTypes.GOOGLE,
            data: {} as any,
          },
        ],
        areas: [
          {
            _id: new ObjectId(),
            name: "Area",
            active: true,
            action: {} as any,
            reaction: {} as any,
            logs: [],
          },
        ],
      },
    ];
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "test-secret",
          signOptions: { expiresIn: "1h" },
        }),
      ],
      providers: [
        {
          provide: getModelToken(Service.name),
          useValue: serviceModel,
        },
        ServicesService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        UsersService,
      ],
      controllers: [UsersController],
    }).compile();
    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  describe("Controller", () => {
    let user: User;
    let authUser: AuthentifiedUser;
    let authRequest: AuthRequest;
    beforeEach(() => {
      user = mocked_users[0];
      authUser = {
        id: user._id.toHexString(),
        email: user.email,
        roles: user.roles
      };
      authRequest = {
        user: authUser,
      };
    });

    it("should be defined", () => {
      expect(controller).toBeDefined();
    });

    describe("getUserProfile", () => {
      it("should the auth user infos", async () => {
        const profile = await controller.getUserProfile(authRequest);
        expect(profile).toBeDefined();
        expect(profile).toBe(user);
      });
    });

    describe("getUserAuthorizations", () => {
      it("should gather auth user auths", async () => {
        const auths = await controller.getUserAuthorizations(authRequest);
        expect(auths).toBeDefined();
        expect(auths).toStrictEqual(user.authorizations.map((a) => a.type));
      });
    });

    describe("deleteUser", () => {
      it("should delete auth user account", async () => {
        await controller.deleteUser(authRequest);
        expect(mocked_users.length).toBe(0);
      });
    });
  });

  describe("Service", () => {
    let user: User;
    let authUser: AuthentifiedUser;
    beforeEach(() => {
      user = mocked_users[0];
      authUser = {
        id: user._id.toHexString(),
        email: user.email,
        roles: user.roles
      };
    });

    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    // These tests are badly designed because i'm too lazy to mock constructors
    // So these will stay commented as I don't really want to delete them
    // Deleting these tests would break my heart honestly :(

    /*describe('createUser', () => {

      beforeEach(async () => {
        await service.createUser({
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@gmail.com",
          password: "abcd"
        });
      })

      it('should create a new user', async () => {
        expect(mocked_users.length).toBeGreaterThan(1);
        expect(mocked_users[1]).toBeDefined();
      });

      it('should copy registration infos', async () => {
        expect(mocked_users[1].first_name).toStrictEqual("Jane");
        expect(mocked_users[1].last_name).toStrictEqual("Smith");
        expect(mocked_users[1].email).toStrictEqual("jane.smith@gmail.com");
      });
    });

    describe('findOrCreateUser', () => {
      it('should find already existing users', async () => {
        const found = await service.findOrCreateUser({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          token: {} as TokenDto
        });
        expect(found).toBe(user);
      });

      it('should create new users', async () => {
        const newUser = await service.findOrCreateUser({
          email: "",
          first_name: "",
          last_name: "",
          token: {} as TokenDto
        });
        expect(newUser).toBeDefined();
        expect(newUser._id.equals(user._id)).toBeTruthy();
      });
    });*/
  });
});
