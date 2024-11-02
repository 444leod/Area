import { Test } from "@nestjs/testing"
import { ServicesService } from "./services/services.service"
import { getModelToken } from "@nestjs/mongoose";
import { Service } from "./services/service.schema";
import { mock } from "node:test";
import { AppController } from "./app.controller"

describe('App Controller', () => {
  let mocked_values: Service[] = [];
  let serviceModel = {
    find: mock.fn(() => {
      return {
        exec: async () => {
          return mocked_values;
        }
      }
    }),
    deleteMany: mock.fn(() => mocked_values = []),
    create: mock.fn((s: Service) => mocked_values.push(s))
  };
  let controller: AppController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getModelToken(Service.name),
          useValue: serviceModel,
        },
      ],
      controllers: [AppController],
    }).compile();
    controller = module.get(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('about.json', () => {
    let about = {};
    beforeEach(async () => {
      about = await controller.getAboutJson(null);
    });

    it('should return an object with many fields', () => {
      expect(about).toBeDefined();
      expect(about).toBeInstanceOf(Object);
      expect(Object.entries(about).length).toBeGreaterThan(0);
    });
  });
});
