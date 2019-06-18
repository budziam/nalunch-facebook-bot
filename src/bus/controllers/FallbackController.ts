import { injectable } from "inversify";
import * as winston from "winston";
import { Client } from "../../client/Client";
import { EventController, IncomingEvent } from "../types";

@injectable()
export class FallbackController implements EventController {
    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        winston.error("Unknown event", {
            client_psid: client.psid,
            event,
        });
    }
}
