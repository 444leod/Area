import { AreaDTO } from "@shared/dtos/area.dto";
import { RabbitMQService } from "@shared/utils/RabbitMQService";

const connection = new RabbitMQService();

//Do mongodb connection here to not repeat the connection every time handleArea is called

async function handleArea (area: AreaDTO) {
  // Put worker logic here
  console.log(area);
}


connection.connect().then(() => {
  connection.consumeArea(handleArea)
});
