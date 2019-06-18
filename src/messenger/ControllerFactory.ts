import { Client } from "../client/Client";
import { EventController, IncomingEvent } from "./types";
import { Container, injectable } from "inversify";
import { MessageController } from "./controllers/MessageController";
import { PostbackController } from "./controllers/PostbackController";
import { FallbackController } from "./controllers/FallbackController";
import { ReferralController } from "./controllers/ReferralController";
import { PassControlController } from "./controllers/PassControlController";

@injectable()
export class ControllerFactory {
    public constructor(private readonly container: Container) {
        //
    }

    public create(client: Client, event: IncomingEvent): EventController {
        if (event.message) {
            return this.container.get(MessageController);
        }

        if (event.postback) {
            return this.container.get(PostbackController);
        }

        if (event.referral) {
            return this.container.get(ReferralController);
        }

        if (event.pass_thread_control) {
            return this.container.get(PassControlController);
        }

        return this.container.get(FallbackController);
    }
}
