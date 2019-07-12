import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { ACTION_CHOICE_REPLIES } from "../constants";

@injectable()
export class StartController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        client.moveToState(ClientState.ActionChoice);
        await this.bus.send(
            client,
            `Cześć ${client.profile.firstName}! Chętnie pomogę Ci znaleźć lunch 🍲 w Twojej okolicy. Wystarczy, że podasz mi swoją lokalizacje 📍`,
        );
        await this.bus.send(client, {
            text: "A może chcesz zrobić coś innego?",
            quick_replies: ACTION_CHOICE_REPLIES,
        });
    }
}
