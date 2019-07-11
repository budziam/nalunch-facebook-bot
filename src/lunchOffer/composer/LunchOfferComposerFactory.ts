import { LunchOfferComposer } from "./LunchOfferComposer";
import { ChunkCollectionStore } from "chunk";
import { injectable } from "inversify";
import { Client } from "../../client/Client";
import { LunchOfferPaginationProvider } from "../pagination/LunchOfferPaginationProvider";

@injectable()
export class LunchOfferComposerFactory {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly lunchOfferPaginationProvider: LunchOfferPaginationProvider,
    ) {
        //
    }

    public create(client: Client): LunchOfferComposer {
        const lunchOfferPagination = this.lunchOfferPaginationProvider.get(client);
        return new LunchOfferComposer(this.chunkCollectionStore, lunchOfferPagination, client);
    }
}
