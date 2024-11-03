import { Injectable, OnModuleInit } from "@nestjs/common";
import { AreaPacket, RabbitMQService } from "@area/shared";

@Injectable()
export class QueueService implements OnModuleInit {
  private rabbit_service: RabbitMQService = null;

  onModuleInit() {
    this.rabbit_service.connect();
  }

  constructor() {
    this.rabbit_service = new RabbitMQService();
  }

  send(packet: AreaPacket) {
    this.rabbit_service.sendPacketToQueue(process.env.RMQ_WREA_QUEUE, packet);
  }
}
