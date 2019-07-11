import { Client } from "../client/Client";
import { ChunkCollectionStore, LunchOffer } from "chunk";

export class LunchOfferPagination {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly client: Client,
    ) {
        //
    }

    public items(): LunchOffer[] {
        // TODO Implement
        return [];
    }
}
