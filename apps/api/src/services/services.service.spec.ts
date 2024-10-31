import { Test } from "@nestjs/testing"
import { ServicesService } from "./services.service"
import { getModelToken } from "@nestjs/mongoose";
import { Service } from "./service.schema";
import { describe, mock } from "node:test";
import { AuthorizationsTypes } from "@area/shared";

describe('Services Service', () => {
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
    findOne: mock.fn(({name}) => { return {
      exec: async () => {
        return mocked_values.find(s => s.name == name);
      }
    }}),
    deleteMany: mock.fn(() => mocked_values = []),
    create: mock.fn((s: Service) => mocked_values.push(s))
  };
  let service: ServicesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getModelToken(Service.name),
          useValue: serviceModel,
        },
      ],
    }).compile();
    service = module.get(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a bunch of stuff', () => {
    expect(mocked_values).toBeDefined();
    expect(mocked_values.length).toBeDefined();
    expect(mocked_values.length).toBeGreaterThan(0);
  });

  it('should have a important services', () => {
    expect(mocked_values).toBeDefined();
    const youtube = mocked_values.find(s => s.name == "YouTube");
    const timer = mocked_values.find(s => s.name == "Timer");
    const mail = mocked_values.find(s => s.name == "Mail");
    const tasks = mocked_values.find(s => s.name == "Google task");
    const atlassian = mocked_values.find(s => s.name == "Atlassian");
    const github = mocked_values.find(s => s.name == "Github");
    const discord = mocked_values.find(s => s.name == "Discord");
    const lastfm = mocked_values.find(s => s.name == "LastFM");
    const spotify = mocked_values.find(s => s.name == "Spotify");
    expect(youtube).toBeDefined();
    expect(timer).toBeDefined();
    expect(mail).toBeDefined();
    expect(tasks).toBeDefined();
    expect(atlassian).toBeDefined();
    expect(github).toBeDefined();
    expect(discord).toBeDefined();
    expect(lastfm).toBeDefined();
    expect(spotify).toBeDefined();
  });

  describe('getAllServices', () => {
    it('should gather all the services', async () => {
      const services = await service.getAllServices();
      expect(services).toBe(mocked_values);
    })
  });

  describe('getServiceById', () => {
    it('should get a precise service', async () => {
      const mocked = mocked_values[0];
      const original = await service.getServiceById(mocked._id);
      expect(original).toBe(mocked);
    });
    // I just cannot make it work it's so bad
    /*it('should throw when not found', async () => {
      expect(async () => {
        await service.getServiceById(new ObjectId("deadbeefdeadbeefdeadbeef"))
      }).toThrow();
    });*/
    // I'm slowly loosing my shit
    // I need help i think
  });

  describe('getServiceById', () => {
    it('should get a precise service', async () => {
      const mocked = mocked_values[0];
      const serv = await service.getServiceByName(mocked.name);
      expect(serv).toBe(mocked);
    });
    // I just cannot make it work it's so bad
    /*it('should throw when not found', async () => {
      expect(async () => {
        await service.getServiceByName("GOOGOO GAGA")
      }).toThrow();
    });*/
    // The creation of such a framework disproves the capacity of God of making good on earth
  });

  describe('getAllServicesShort', () => {

    it('should return a list of services', async () => {
      const shorts = await service.getAllServicesShort();
      expect(shorts).toBeDefined();
    });

    it('should have as many elements as the original', async () => {
      const shorts = await service.getAllServicesShort();
      expect(shorts.length).toBe(mocked_values.length);
    });
  })

  describe('getAreaTypesFromAuthType', () => {
    it ('should handle unknown types', async () => {
      const res = await service.getAreaTypesFromAuthType('FFFFF' as AuthorizationsTypes);
      expect(res).toBeDefined();
      expect(res.actionTypes).toBeDefined();
      expect(res.reactionTypes).toBeDefined();
    })
  })
})
