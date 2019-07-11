import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { ACTION_CHOICE_REPLIES, ActionChoicePayload } from "../constants";
import { equals } from "../utils";
import { ChunkCollectionStore, Coordinates } from "chunk";
import { ContentType } from "../../api/FacebookApi";
import { LunchOfferComposerFactory } from "../../lunchOffer/composer/LunchOfferComposerFactory";
import { LocationFinder } from "../../location/LocationFinder";
import * as moment from "moment";

@injectable()
export class ActionChoiceController implements EventController {
    public constructor(
        private readonly bus: Bus,
        private readonly chunkCollectionStore: ChunkCollectionStore,
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

        const locationFinder = new LocationFinder(event);
        const location = locationFinder.getQuickReplyLocation();

        if (location) {
            return this.locationChosen(client, location);
        }

        const matches = locationFinder.matchLocation();
        if (matches.length !== 0) {
            return this.bus.send(client, {
                text: "Wybierz lokalizację",
                quick_replies: matches.map(match => ({
                    content_type: ContentType.Text,
                    title: match.label,
                    payload: match.payload,
                })),
            });
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

        await this.bus.send(
            client,
            "Kilka moich propozycji. Wybierz dany lokal, aby zobaczyć pełną ofertę.",
        );

        await this.chunkCollectionStore.load(client.position, moment());

        const lunchOfferComposer = this.lunchOfferComposerFactory.create(client);
        const [text, quickReplies] = lunchOfferComposer.composeMany();

        await this.bus.send(client, {
            text,
            quick_replies: quickReplies,
        });
    }

    private async displayActions(client: Client): Promise<void> {
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
