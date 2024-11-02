import { Test, TestingModule } from "@nestjs/testing";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { UsersService } from "../users/users.service";
import { ActionTypes, ReactionTypes, Service, User } from "@area/shared";
import { mock } from "node:test";
import { ObjectId } from "mongodb";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ServicesService } from "../services/services.service";
import { AreasService } from "../areas/areas.service";

describe("Admin", () => {
  let mocked_users: User[] = [
    {
      _id: new ObjectId(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      password: "hashed_password",
      authorizations: [],
      roles: [],
      areas: [
        {
          _id: new ObjectId(),
          name: "Area",
          active: true,
          action: {
            informations: {
              type: ActionTypes.EXAMPLE_ACTION,
            },
          } as any,
          reaction: {
            informations: {
              type: ReactionTypes.EXAMPLE_REACTION,
            },
          } as any,
          logs: [],
        },
      ],
    },
  ];
  let userModel = {
    find: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_users;
        },
      };
    }),
    countDocuments: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_users.length;
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

  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        AreasService,
        AdminService,
      ],
      controllers: [AdminController],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  describe("Controller", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
    });

    describe("getAdminDashboardInfos", () => {
      it("should gather infos for admin dashboard", async () => {
        const infos = await controller.getDashboardInformations();
        expect(infos).toBeDefined();
        expect(infos.user_count).toBeGreaterThan(0);
      });
    });
  });

  describe("Service", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });
  });
});
