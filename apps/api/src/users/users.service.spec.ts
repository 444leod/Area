import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { UsersService } from "./users.service";
import { User } from "@area/shared";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { find } from "rxjs";

describe("UsersService", () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it("should find the user by id", async () => {
    const userId = new ObjectId();
    const user = { _id: userId, name: "Test User" } as any;

    jest.spyOn(userModel, "findById").mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    } as any);

    const result = await service.findById(userId.toHexString());

    expect(userModel.findById).toHaveBeenCalledWith(userId.toHexString());
    expect(result).toEqual(user);
  });

  it("should find the user by email", async () => {
    const email = "abc@gmail.com";
    const user = { _id: new ObjectId(), email } as any;

    jest.spyOn(userModel, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    } as any);

    const result = await service.findByEmail(email);

    expect(userModel.findOne).toHaveBeenCalledWith({ email });
    expect(result).toEqual(user);
  });

  it("should add an area to the user and save it", async () => {
    const userId = new ObjectId();
    const area = { _id: new ObjectId(), name: "Test Area" } as any;
    const user = {
      _id: userId,
      areas: [],
      save: jest.fn().mockResolvedValue({ _id: userId, areas: [area] }),
    } as any;

    jest.spyOn(userModel, "findById").mockResolvedValue(user);

    const result = await service.addAreaToUser(
      { sub: userId.toHexString() },
      area
    );

    expect(userModel.findById).toHaveBeenCalledWith(userId.toHexString());
    expect(user.areas).toContain(area);
    expect(user.save).toHaveBeenCalled();
    expect(result.areas).toContain(area);
  });

  it("should remove an area from the user and save it", async () => {
    const userId = new ObjectId();
    const area = { _id: new ObjectId(), name: "Test Area" } as any;
    const user = {
      _id: userId,
      areas: [area],
      save: jest.fn().mockResolvedValue({ _id: userId, areas: [] }),
    } as any;

    jest.spyOn(userModel, "findById").mockResolvedValue(user);

    const result = await service.removeAreaFromUser(
      { sub: userId.toHexString() },
      area._id
    );

    expect(userModel.findById).toHaveBeenCalledWith(userId.toHexString());
    expect(user.areas).not.toContain(area);
    expect(user.save).toHaveBeenCalled();
    expect(result.areas).not.toContain(area);
  });
});
