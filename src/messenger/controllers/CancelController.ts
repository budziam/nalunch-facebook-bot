import { injectable } from "inversify";
import { Client, ClientState } from "../../client/Client";
import { EventController, IncomingEvent } from "../types";
import { Bus } from "../Bus";
import { ACTION_CHOICE_REPLIES } from "../constants";

@injectable()
export class CancelController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        client.moveToState(ClientState.ActionChoice);

        await this.bus.send(client, {
            text: "Zacznijmy od początku. Jak mogę Ci pomóc?",
            quick_replies: ACTION_CHOICE_REPLIES,
        });
    }
}
