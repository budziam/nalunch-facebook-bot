import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { ACTION_CHOICE_REPLIES, ActionChoicePayload } from "../constants";
import { equals } from "../utils";
import { Coordinates } from "chunk";
import { LunchOfferComposerFactory } from "../../lunchOffer/LunchOfferComposerFactory";

const extractLocation = (event: IncomingEvent): Coordinates | undefined => {
    const attachments = event.message.attachments;

    if (attachments && attachments[0] && attachments[0].type === "location") {
        return {
            latitude: attachments[0].payload.coordinates.lat,
            longitude: attachments[0].payload.coordinates.long,
        };
    }

    return undefined;
};

@injectable()
export class ActionChoiceController implements EventController {
    public constructor(
        private readonly bus: Bus,
        private readonly lunchOfferComposerFactory: LunchOfferComposerFactory,
    ) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const { message } = event;
        const text = message.quick_reply ? message.quick_reply.payload : message.text;

        if (equals(text, ActionChoicePayload.Conversation)) {
            return this.conversationChosen(client);
        }

        const location = extractLocation(event);
        if (location) {
            return this.locationChosen(client, location);
        }

        await this.displayActions(client);
    }

    private async conversationChosen(client: Client): Promise<void> {
        // https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control
        client.moveToState(ClientState.ActionChoice);
        return this.bus.passThreadControl(client);
    }

    private async locationChosen(client: Client, location: Coordinates): Promise<void> {
        client.moveToState(ClientState.ListBusinesses);
        client.position = location;

        const message = await this.lunchOfferComposerFactory.create(client).compose();

        return this.bus.send(client, message);
    }

    private async displayActions(client: Client): Promise<void> {
        await this.bus.send(
            client,
            `Cześć ${client.profile.firstName}! Chętnie pomogę Ci znaleźć lunch 🍲 w Twojej okolicy. Wystarczy, że podasz mi swoją lokalizacje 📍`,
        );
        await this.bus.send(client, {
            text: "A może mogę Ci pomóc w inny sposób?",
            quick_replies: ACTION_CHOICE_REPLIES,
        });
    }
}
