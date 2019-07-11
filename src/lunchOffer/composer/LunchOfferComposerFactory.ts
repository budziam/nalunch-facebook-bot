import { LunchOfferComposer } from "./LunchOfferComposer";
import { ChunkCollectionStore } from "chunk";
import { injectable } from "inversify";
import { LunchOfferCollection } from "../LunchOfferCollection";
import { Client } from "../../client/Client";

@injectable()
export class LunchOfferComposerFactory {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly lunchOfferCollection: LunchOfferCollection,
    ) {
        //
    }

    public create(client: Client): LunchOfferComposer {
        return new LunchOfferComposer(this.chunkCollectionStore, this.lunchOfferCollection, client);
    }
}
