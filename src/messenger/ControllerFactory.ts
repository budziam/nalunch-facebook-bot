import { Client, ClientState } from "../client/Client";
import { EventController, IncomingEvent } from "./types";
import { Container, injectable } from "inversify";
import { PostbackController } from "./controllers/PostbackController";
import { FallbackController } from "./controllers/FallbackController";
import { ReferralController } from "./controllers/ReferralController";
import { PassControlController } from "./controllers/PassControlController";
import { equals } from "./utils";
import { SiemkaController } from "./controllers/SiemkaController";
import { UnknownMessageController } from "./controllers/UnknownMessageController";
import { ActionChoiceController } from "./controllers/ActionChoiceController";
import { BusinessChoiceController } from "./controllers/BusinessChoiceController";
import { HumanConversationController } from "./controllers/HumanConversationController";
import { StartController } from "./controllers/StartController";

@injectable()
export class ControllerFactory {
    public constructor(private readonly container: Container) {
        //
    }

    public create(client: Client, event: IncomingEvent): EventController {
        if (event.message) {
            event.message.text = event.message.text ? event.message.text.trim() : "";

            if (equals(event.message.text, "siemka")) {
                return this.container.get(SiemkaController);
            }

            if (equals(event.message.text, "anuluj")) {
                client.moveToState(ClientState.Start);
            }

            if (client.state === ClientState.Start) {
                return this.container.get(StartController);
            }

            if (client.state === ClientState.ActionChoice) {
                return this.container.get(ActionChoiceController);
            }

            if (client.state === ClientState.ListBusinesses) {
                return this.container.get(BusinessChoiceController);
            }

            if (client.state === ClientState.HumanConversation) {
                return this.container.get(HumanConversationController);
            }

            return this.container.get(UnknownMessageController);
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
