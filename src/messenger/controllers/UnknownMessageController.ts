import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";
import { Bus } from "../Bus";

@injectable()
export class UnknownMessageController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        await this.bus.send(client, "Nie wiem co zrobić :|");
    }
}
