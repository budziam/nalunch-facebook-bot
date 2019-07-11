import createMockInstance from "jest-create-mock-instance";
import { LunchOfferPagination } from "../../../src/lunchOffer/LunchOfferPagination";
import { Client } from "../../../src/client/Client";
import { ChunkCollectionStore } from "chunk";
import { Factory } from "../../Factory";

describe("LunchOfferPagination", () => {
    let chunkCollectionStore: jest.Mocked<ChunkCollectionStore>;
    let client: Client;
    let factory: Factory;
    let lunchOfferPagination: LunchOfferPagination;

    beforeEach(() => {
        factory = new Factory();
        client = factory.client();
        chunkCollectionStore = createMockInstance(ChunkCollectionStore);
        Object.defineProperty(chunkCollectionStore, "lunchOffers", {
            get: () => factory.lunchOffers(7),
        });
        lunchOfferPagination = new LunchOfferPagination(chunkCollectionStore, client);
    });

    it("lists lunch offers", () => {
        // given

        // when
        const lunchOffers = lunchOfferPagination.items();

        // then
        console.log(lunchOffers);
    });

    it("lists next lunch offers", () => {
        //
    });

    it("lists previous lunch offers", () => {
        //
    });

    it("gives current lunch offers quick replies", () => {
        //
    });
});
