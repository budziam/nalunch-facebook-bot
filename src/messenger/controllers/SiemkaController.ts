import { injectable } from "inversify";
import { Client } from "../../client/Client";
import { EventController, IncomingEvent } from "../types";
import { Bus } from "../Bus";

@injectable()
export class SiemkaController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        await this.bus.send(client, "Dzień dobry!");
    }
}
