import { Test } from "@nestjs/testing"
import { ServicesController } from "./services.controller"
import { ServicesService } from "./services.service"
import { getModelToken } from "@nestjs/mongoose";
import { Service } from "./service.schema";
import { mock } from "node:test";

describe('Services Controller', () => {
  let mocked_values: Service[] = [];
  let serviceModel = {
    find: mock.fn(() => { return {
      exec: async () => {
        return mocked_values;
      }
    }}),
    findById: mock.fn((id) => { return {
      exec: async () => {
        return mocked_values.find(s => s._id.equals(id));
      }
    }}),
    deleteMany: mock.fn(() => mocked_values = []),
    create: mock.fn((s: Service) => mocked_values.push(s))
  };
  let controller: ServicesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getModelToken(Service.name),
          useValue: serviceModel,
        },
      ],
      controllers: [ServicesController],
    }).compile();
    controller = module.get(ServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllServices', () => {
    it('should gather all the services', async () => {
      const services = await controller.getAllServices();
      expect(services).toBe(mocked_values);
    })
  })

  describe('getServiceById', () => {
    it('should get a precise service', async () => {
      const mocked = mocked_values[0];
      const service = await controller.getServiceById(mocked._id.toHexString());
      expect(service).toBe(mocked);
    });
  })
})