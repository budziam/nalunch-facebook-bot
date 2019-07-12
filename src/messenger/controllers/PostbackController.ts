import { injectable } from "inversify";
import * as winston from "winston";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";

@injectable()
export class PostbackController implements EventController {
    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        winston.info("Postback", {
            client_psid: client.psid,
            event,
        });
    }
}
