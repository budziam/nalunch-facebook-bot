import { injectable } from "inversify";
import * as winston from "winston";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";

@injectable()
export class PassControlController implements EventController {
    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        winston.info("Pass thread control", {
            client_psid: client.psid,
            event,
        });
    }
}
