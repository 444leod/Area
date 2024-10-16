import { Injectable } from "@nestjs/common";
import { Area, RabbitMQService } from '@area/shared'

@Injectable()
export class QueueService {
    private rabbit_service: RabbitMQService = null;

    constructor() {
        this.rabbit_service = new RabbitMQService();
        this.rabbit_service.connect();
    }

    send(area: Area) { //! TODO: Create a DTO and give it actual type
        console.log(area)
        //this.rabbit_service.sendAreaToQueue(process.env.RMQ_WHREA_QUEUE, area);
    }
}
