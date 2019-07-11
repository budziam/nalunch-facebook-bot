import createMockInstance from "jest-create-mock-instance";
import { Client } from "../../../src/client/Client";
import { LunchOffer } from "chunk";
import { Factory } from "../../Factory";
import {
    LunchOfferPagination,
    PaginationEnum,
} from "../../../src/lunchOffer/pagination/LunchOfferPagination";
import { ContentType } from "../../../src/api/FacebookApi";
import { LunchOfferPayload } from "../../../src/lunchOffer/LunchOfferPayload";
import { LunchOfferCollection } from "../../../src/lunchOffer/collection/LunchOfferCollection";

describe("LunchOfferPagination", () => {
    let lunchOfferCollection: jest.Mocked<LunchOfferCollection>;
    let client: Client;
    let factory: Factory;
    let lunchOfferPagination: LunchOfferPagination;
    let allLunchOffers: LunchOffer[];

    beforeEach(() => {
        factory = new Factory();
        client = factory.client();
        allLunchOffers = factory.lunchOffers(7);

        lunchOfferCollection = createMockInstance(LunchOfferCollection);
        lunchOfferCollection.lunchOffers.mockReturnValue(allLunchOffers);
        lunchOfferPagination = new LunchOfferPagination(lunchOfferCollection);
    });

    describe("items", () => {
        it("lists lunch offers", () => {
            // when
            const lunchOffers = lunchOfferPagination.items();

            // then
            expect(lunchOffers).toHaveLength(5);
            expect(lunchOffers).toContainEqual(expect.any(LunchOffer));
            expect(lunchOffers[0]).toBe(allLunchOffers[0]);
        });

        it("lists next lunch offers", () => {
            // given
            lunchOfferPagination.nextPage();

            // when
            const lunchOffers = lunchOfferPagination.items();

            // then
            expect(lunchOffers).toHaveLength(2);
            expect(lunchOffers).toContainEqual(expect.any(LunchOffer));
            expect(lunchOffers[0]).toBe(allLunchOffers[5]);
        });

        it("lists previous lunch offers", () => {
            // given
            lunchOfferPagination.nextPage();
            lunchOfferPagination.previousPage();

            // when
            const lunchOffers = lunchOfferPagination.items();

            // then
            expect(lunchOffers).toHaveLength(5);
            expect(lunchOffers).toContainEqual(expect.any(LunchOffer));
            expect(lunchOffers[0]).toBe(allLunchOffers[0]);
        });
    });

    describe("quick replies", () => {
        it("lists quick replies for current lunch offers", () => {
            // when
            const quickReplies = lunchOfferPagination.quickReplies();

            // then
            for (let i = 0; i < 5; i += 1) {
                const lunchOffer = allLunchOffers[i];
                expect(quickReplies[i]).toEqual({
                    content_type: ContentType.Text,
                    payload: LunchOfferPayload.fromLunchOffer(lunchOffer).toString(),
                    title: lunchOffer.business.name,
                });
            }
            expect(quickReplies[5]).toEqual({
                content_type: ContentType.Text,
                payload: PaginationEnum.Next,
                title: "Więcej",
            });
        });

        it("lists next quick replies", () => {
            // given
            lunchOfferPagination.nextPage();

            // when
            const quickReplies = lunchOfferPagination.quickReplies();

            // then
            expect(quickReplies[0]).toEqual({
                content_type: ContentType.Text,
                payload: PaginationEnum.Prev,
                title: "Poprzednie",
            });
            for (let i = 1; i < 3; i += 1) {
                const lunchOffer = allLunchOffers[i + 4];
                expect(quickReplies[i]).toEqual({
                    content_type: ContentType.Text,
                    payload: LunchOfferPayload.fromLunchOffer(lunchOffer).toString(),
                    title: lunchOffer.business.name,
                });
            }
        });
    });
});
