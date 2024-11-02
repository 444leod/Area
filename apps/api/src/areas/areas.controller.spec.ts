import { Test } from "@nestjs/testing"
import { AreasController } from "./areas.controller"
import { AreasService } from "./areas.service"
import { getModelToken } from "@nestjs/mongoose";
import { ActionTypes, Service, User } from "@area/shared"
import { mock } from "node:test";
import { AreasHelper } from "./areas.helper";
import { ServicesService } from "../services/services.service";
import { JwtModule } from "@nestjs/jwt";
import { ObjectId } from "mongodb";
import { AuthentifiedUser, AuthRequest } from "../auth/auth.guard";

describe('Area', () => {
  let mocked_users: User[] = [
    {
      _id: new ObjectId(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      password: "hashed_password",
      authorizations: [],
      areas: [
        {
          _id: new ObjectId(),
          name: "Area",
          active: true,
          action: {} as any,
          reaction: {} as any,
          logs: []
        }
      ]
    }
  ];
  let userModel = {
    find: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_users;
        }
      }
    }),
    findById: mock.fn((id: string | ObjectId) => {
      return {
        exec: async () => {
          const user = mocked_users.find(s => s._id.equals(id));
          // Add save method to the found document
          if (user) {
            user['save'] = mock.fn(async () => {
              // Find and update the user in mocked_users array
              const index = mocked_users.findIndex(u => u._id.equals(id));
              if (index !== -1) {
                mocked_users[index] = { ...user };
              }
              return user;
            });
          }
          return user;
        }
      }
    }),
    create: mock.fn((s: User) => mocked_users.push(s)),
  };

  let mocked_services: Service[] = [];
  let serviceModel = {
    find: mock.fn(() => { return {
      exec: async () => {
        return mocked_services;
      }
    }}),
    findById: mock.fn((id) => { return {
      exec: async () => {
        return mocked_services.find(s => s._id.equals(id));
      }
    }}),
    deleteMany: mock.fn(() => mocked_services = []),
    create: mock.fn((s: Service) => mocked_services.push(s))
  };
  let controller: AreasController;
  let service: AreasService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
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
        AreasHelper,
        AreasService,
      ],
      controllers: [AreasController],
    }).compile();
    controller = module.get(AreasController);
    service = module.get(AreasService);
  });

  describe('Controller', () => {

    let user: User;
    let authUser: AuthentifiedUser;
    let authRequest: AuthRequest;
    beforeEach(() => {
      user = mocked_users[0];
      authUser = {
        id: user._id.toHexString(),
        email: user.email
      }
      authRequest = {
        user: authUser
      }
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('getUserAreas', () => {
      it('should return an array containing areas', async () => {
        const res = await controller.getUserAreas(authRequest);
        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(0);
      });
    });

    describe('getUserArea', () => {
      it('should get one area', async () => {
        const res = await controller.getAreaById(authRequest, user.areas[0]._id.toHexString());
        expect(res).toBeDefined();
        expect(res).toBe(user.areas[0]);
      });
    });

    describe('toggleArea', () => {
      it('should toggle area activty', async () => {
        const res = await controller.toggleArea(authRequest, user.areas[0]._id.toHexString());
        expect(res).toBeDefined();
        expect(res.active).toBeFalsy();
        expect(user.areas[0].active).toBeFalsy();
      });
    });
  });

  describe('Service', () => {

    let user: User;
    let authUser: AuthentifiedUser;
    beforeEach(() => {
      user = mocked_users[0];
      authUser = {
        id: user._id.toHexString(),
        email: user.email
      }
    })

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

})