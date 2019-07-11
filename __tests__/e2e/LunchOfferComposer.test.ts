import { Container } from "inversify";
import { setup } from "../utils";
import { Client } from "../../src/client/Client";
import * as moment from "moment";
import { ChunkCollectionStore, EnrichedSlug } from "chunk";
import { Factory } from "../Factory";
import { LunchOfferComposerFactory } from "../../src/lunchOffer/composer/LunchOfferComposerFactory";

describe("Lunch offer composer", () => {
    let client: Client;
    let container: Container;
    let factory: Factory;
    let lunchOfferComposerFactory: LunchOfferComposerFactory;

    beforeEach(() => {
        container = setup();
        lunchOfferComposerFactory = container.get<LunchOfferComposerFactory>(
            LunchOfferComposerFactory,
        );
        factory = new Factory();
        client = factory.client();
    });

    it("compose many", async () => {
        client.position = {
            latitude: 50.0646501,
            longitude: 19.9449799,
        };

        const [text, quickReplies] = await container
            .get<LunchOfferComposerFactory>(LunchOfferComposerFactory)
            .create(client)
            .composeMany();

        console.log(text);
    });

    it("compose one", async () => {
        client.position = {
            latitude: 52.2293434,
            longitude: 21.0122043,
        };

        const chunkCollectionStore = container.get<ChunkCollectionStore>(ChunkCollectionStore);
        const lunchOfferStore = chunkCollectionStore.getLunchOfferStore(
            moment(),
            EnrichedSlug.fromString("mala-gruzja-restauracja,513362100"),
        );
        await lunchOfferStore.load();

        const [text, quickReplies] = lunchOfferComposerFactory
            .create(client)
            .composeOne(lunchOfferStore.lunchOffer);

        console.log(text);
    });
});
