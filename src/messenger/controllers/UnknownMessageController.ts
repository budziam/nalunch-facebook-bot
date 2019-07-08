import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";
import { Bus } from "../Bus";
import { FallbackService } from "../FallbackService";

@injectable()
export class UnknownMessageController implements EventController {
    public constructor(
        private readonly bus: Bus,
        private readonly fallbackService: FallbackService,
    ) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        return this.fallbackService.unknownSituation(client);
    }
}
