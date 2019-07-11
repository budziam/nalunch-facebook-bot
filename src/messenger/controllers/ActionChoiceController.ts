import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { ActionChoicePayload } from "../constants";
import { equals } from "../utils";
import { ChunkCollectionStore, Coordinates } from "chunk";
import { ContentType } from "../../api/FacebookApi";
import { LunchOfferComposerFactory } from "../../lunchOffer/composer/LunchOfferComposerFactory";
import * as moment from "moment";
import { FallbackService } from "../FallbackService";

const getQuickReplyLocation = (event: IncomingEvent): Coordinates | undefined => {
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
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly fallbackService: FallbackService,
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

        const location = getQuickReplyLocation(event);
        if (location) {
            return this.locationChosen(client, location);
        }

        return this.fallbackService.unknownSituation(client);
    }

    private async conversationChosen(client: Client): Promise<void> {
        client.moveToState(ClientState.HumanConversation);
        return this.bus.send(client, {
            text: "Czy na pewno chcesz porozmawiać z człowiekem 👩 ?",
            quick_replies: [
                {
                    content_type: ContentType.Text,
                    title: "Nie",
                    payload: "nie",
                },
                {
                    content_type: ContentType.Text,
                    title: "Tak",
                    payload: "tak",
                },
            ],
        });
    }

    private async locationChosen(client: Client, location: Coordinates): Promise<void> {
        client.moveToState(ClientState.ListBusinesses);
        client.position = location;

        await this.bus.send(
            client,
            "Kilka moich propozycji 👌 Wybierz dany lokal, aby zobaczyć pełną ofertę.",
        );

        await this.chunkCollectionStore.load(client.position, moment());

        const lunchOfferComposer = this.lunchOfferComposerFactory.create(client);
        const [text, quickReplies] = lunchOfferComposer.composeMany();

        await this.bus.send(client, {
            text,
            quick_replies: quickReplies,
        });
    }
}
