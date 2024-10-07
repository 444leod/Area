import { Test, TestingModule } from "@nestjs/testing";
import { AreasHelper } from "./areas.helper";
import {
  ActionTypes,
  AreaCreationDto,
  ReactionTypes,
  Area,
  AreaDto,
} from "@area/shared";
import { ObjectId } from "mongodb";
import { ExampleActionBuilder } from "./builders/actions/example.builder";
import { EachXSecondsActionBuilder } from "./builders/actions/each-x-sec.builder";

describe("AreasHelper", () => {
  let areasHelper: AreasHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasHelper],
    }).compile();

    areasHelper = module.get<AreasHelper>(AreasHelper);
  });

  describe("build", () => {
    it("should build an Area object from AreaCreationDto", () => {
      const dto: AreaCreationDto = {
        action: {
          type: ActionTypes.EXAMPLE_ACTION,
          exampleField: "exampleValue",
        },
        reaction: {
          type: ReactionTypes.EXAMPLE_REACTION,
          exampleField: "exampleValue",
        },
      };

      const area = areasHelper.build(dto);

      expect(area).toBeDefined();
      expect(area._id).toBeInstanceOf(ObjectId);
      expect(area.action).toBeDefined();
      expect(area.action.informations).toEqual(dto.action);
      expect(area.reaction).toBeDefined();
      expect(area.reaction.informations).toEqual(dto.reaction);
      expect(area.active).toBe(true);
    });
  });

  describe("toDto", () => {
    it("should convert an Area object to AreaDto", () => {
      const area: Area = {
        _id: new ObjectId(),
        action: {
          service_id: new ObjectId(),
          informations: {
            type: ActionTypes.EXAMPLE_ACTION,
            exampleField: "exampleValue",
          }
        } as any,
        reaction: {
          service_id: new ObjectId(),
          informations: {
            type: ReactionTypes.EXAMPLE_REACTION,
            exampleField: "exampleValue",
          }
        },
        active: true,
      };

      const dto = areasHelper.toDto(area);

      expect(dto).toBeDefined();
      expect(dto._id).toEqual(area._id);
      expect(dto.active).toBe(area.active);
      expect(dto.action.informations).toEqual(area.action.informations);
      expect(dto.reaction.informations).toEqual(area.reaction.informations);
    });
  });
});
