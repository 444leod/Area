import { AreaDTO } from "@shared/dtos/area.dto";
import { RabbitMQConnection } from "@shared/utils/RabbitMQConnection";

const connection = new RabbitMQConnection();

//Do mongodb connection here to not repeat the connection every time areaHandler is called

function areaHandler(area: AreaDTO) {
  // Put worker logic here
  console.log(area);
}


connection.connect().then(() => {
  connection.consumeArea(areaHandler)
});
