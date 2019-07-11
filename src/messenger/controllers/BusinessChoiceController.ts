import { injectable } from "inversify";
import { EventController, IncomingEvent } from "../types";
import { Client } from "../../client/Client";
import { Bus } from "../Bus";
import { FallbackService } from "../FallbackService";
import { ChunkCollectionStore } from "chunk";
import { LunchOfferPayload } from "../../lunchOffer/LunchOfferPayload";
import { LunchOfferComposerFactory } from "../../lunchOffer/composer/LunchOfferComposerFactory";
import { PaginationEnum } from "../../lunchOffer/pagination/LunchOfferPagination";
import { LunchOfferPaginationProvider } from "../../lunchOffer/pagination/LunchOfferPaginationProvider";

@injectable()
export class BusinessChoiceController implements EventController {
    public constructor(
        private readonly bus: Bus,
        private readonly fallbackService: FallbackService,
        private readonly lunchOfferComposerFactory: LunchOfferComposerFactory,
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly lunchOfferPaginationProvider: LunchOfferPaginationProvider,
    ) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const { message } = event;

        if (!message.quick_reply) {
            return this.fallbackService.unknownSituation(client);
        }

        const { payload } = message.quick_reply;
        const pagination = this.lunchOfferPaginationProvider.get(client);

        if (payload === PaginationEnum.Next) {
            pagination.nextPage();
            return this.sendLunchOffers(client);
        }

        if (payload === PaginationEnum.Prev) {
            pagination.previousPage();
            return this.sendLunchOffers(client);
        }

        return this.handleLunchOfferDetailsRequest(payload, client);
    }

    private async sendLunchOffers(client: Client): Promise<void> {
        const lunchOfferComposer = this.lunchOfferComposerFactory.create(client);
        const [text, quickReplies] = lunchOfferComposer.composeMany();

        await this.bus.send(client, {
            text,
            quick_replies: quickReplies,
        });
    }

    private async handleLunchOfferDetailsRequest(payload: string, client: Client): Promise<void> {
        const { date, enrichedSlug } = LunchOfferPayload.fromString(payload);

        const lunchOfferStore = this.chunkCollectionStore.getLunchOfferStore(date, enrichedSlug);
        await lunchOfferStore.load();

        if (!lunchOfferStore.exists) {
            return this.fallbackService.unknownSituation(client);
        }

        const lunchOfferComposer = this.lunchOfferComposerFactory.create(client);
        const [text, quickReplies] = lunchOfferComposer.composeOne(lunchOfferStore.lunchOffer);

        await this.bus.send(client, {
            text,
            quick_replies: quickReplies,
        });
    }
}
