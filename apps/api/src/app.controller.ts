import { Controller, Get, Ip } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/about.json")
  getAboutJson(@Ip() ip): object {
    return {
      client: {
        ip: ip,
      },
      server: {
        current_time: new Date().getTime(),
        services: [
          {
            name: "internal",
            actions: [],
            reactions: [],
          },
        ],
      },
    };
  }
}
