import { Test } from "@nestjs/testing";
import { QueueService } from "./queue.service"

describe('Queue Service', () => {
  let service: QueueService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [QueueService]
    }).compile();
    service = module.get(QueueService);
  })

  it('should connect and be defined', () => {
    expect(service).toBeDefined()
  });
})