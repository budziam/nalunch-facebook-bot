import { ChunkCollectionStore } from "chunk";
import { Client } from "../client/Client";
import { injectable } from "inversify";
import { LunchOfferPagination } from "./LunchOfferPagination";

@injectable()
export class LunchOfferPaginationFactory {
    public constructor(private readonly chunkCollectionStore: ChunkCollectionStore) {
        //
    }

    public create(client: Client): LunchOfferPagination {
        return new LunchOfferPagination(this.chunkCollectionStore, client);
    }
}
