import { injectable } from "inversify";
import * as winston from "winston";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";

@injectable()
export class ReferralController implements EventController {
    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        winston.info("Referral", {
            client_psid: client.psid,
            event,
        });
    }
}
