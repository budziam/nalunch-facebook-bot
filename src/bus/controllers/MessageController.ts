import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";
import { Bus } from "../Bus";

@injectable()
export class MessageController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const text = event.message.text ? event.message.text.trim() : "";

        if (text === "Siemka") {
            await this.bus.send(client, "Witam!");
        }

        await this.bus.send(client, "Nie wiem co zrobić :|");
    }
}
