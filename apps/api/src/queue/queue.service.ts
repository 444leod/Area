import { Injectable } from "@nestjs/common";
import { Area, AreaPacket, RabbitMQService } from '@area/shared'
import { ObjectId } from "mongodb";

@Injectable()
export class QueueService {
    private rabbit_service: RabbitMQService = null;

    constructor() {
        this.rabbit_service = new RabbitMQService();
        this.rabbit_service.connect();
    }

    send(packet: AreaPacket) {
        this.rabbit_service.sendPacketToQueue(process.env.RMQ_WHREA_QUEUE, packet);
    }
}
