import { ChunkCollectionStore } from "chunk";
import { injectable } from "inversify";
import { Client } from "../../client/Client";
import { LunchOfferCollection } from "./LunchOfferCollection";

@injectable()
export class LunchOfferCollectionFactory {
    public constructor(private readonly chunkCollectionStore: ChunkCollectionStore) {
        //
    }

    public create(client: Client): LunchOfferCollection {
        return new LunchOfferCollection(this.chunkCollectionStore, client);
    }
}
