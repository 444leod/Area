import { Injectable } from "@nestjs/common";
import { AreaPacket, RabbitMQService } from '@area/shared';

@Injectable()
export class QueueService {
    private rabbit_service: RabbitMQService = null;

    constructor() {
        this.rabbit_service = new RabbitMQService();
        this.rabbit_service.connect();
    }

    send(packet: AreaPacket) {
        this.rabbit_service.sendPacketToQueue(process.env.RMQ_WREA_QUEUE, packet);
    }
}
