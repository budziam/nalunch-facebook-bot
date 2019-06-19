import { LunchOfferComposer } from "./LunchOfferComposer";
import { ChunkCollectionStore } from "chunk";
import { Client } from "../client/Client";
import { injectable } from "inversify";

@injectable()
export class LunchOfferComposerFactory {
    public constructor(private readonly chunkCollectionStore: ChunkCollectionStore) {
        //
    }

    public create(client: Client): LunchOfferComposer {
        return new LunchOfferComposer(this.chunkCollectionStore, client);
    }
}
