import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";
import { FallbackService } from "../FallbackService";
import { ChunkCollectionStore } from "chunk";
import { LunchOfferPayload } from "../../lunchOffer/LunchOfferPayload";
import { LunchOfferComposerFactory } from "../../lunchOffer/LunchOfferComposerFactory";

@injectable()
export class BusinessChoiceController implements EventController {
    public constructor(
        private readonly bus: Bus,
        private readonly fallbackService: FallbackService,
        private readonly lunchOfferComposerFactory: LunchOfferComposerFactory,
        private readonly chunkCollectionStore: ChunkCollectionStore,
    ) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const { message } = event;

        client.moveToState(ClientState.ShowBusiness);

        if (!message.quick_reply) {
            return this.fallbackService.unknownSituation(client);
        }

        const payload = LunchOfferPayload.fromString(message.quick_reply.payload);

        const lunchOfferStore = this.chunkCollectionStore.getLunchOfferStore(
            payload.date,
            payload.enrichedSlug,
        );
        await lunchOfferStore.load();

        if (!lunchOfferStore.exists) {
            return this.fallbackService.unknownSituation(client);
        }

        const lunchOfferComposer = this.lunchOfferComposerFactory.create(client);
        const [text, quickReplies] = lunchOfferComposer.composeOne(lunchOfferStore.lunchOffer);
        await this.bus.send(client, {
            text,
            // quick_replies: quickReplies,
        });
    }
}
