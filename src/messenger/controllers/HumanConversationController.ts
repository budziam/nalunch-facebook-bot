import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { equals } from "../utils";
import { ACTION_CHOICE_REPLIES } from "../constants";

@injectable()
export class HumanConversationController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const { message } = event;

        const text = message.quick_reply ? message.quick_reply.payload : message.text;

        if (equals(text, "tak")) {
            client.moveToState(ClientState.Start);
            // https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control
            await this.bus.send(
                client,
                "Niebawem ktoś bardziej ludzki niż ja się z Tobą skontaktuje 🙂",
            );
            return this.bus.passThreadControl(client);
        }

        client.moveToState(ClientState.ActionChoice);
        return this.bus.send(client, {
            text: "Ja też nie lubię rozmawiać z ludźmi 🤖 Jak mogę Ci pomóc?",
            quick_replies: ACTION_CHOICE_REPLIES,
        });
    }
}
