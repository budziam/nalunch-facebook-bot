import { injectable } from "inversify";
import { LunchOfferPagination } from "./LunchOfferPagination";
import { Client } from "../../client/Client";
import { LunchOfferCollectionFactory } from "../collection/LunchOfferCollectionFactory";

@injectable()
export class LunchOfferPaginationFactory {
    public constructor(private readonly lunchOfferCollectionFactory: LunchOfferCollectionFactory) {
        //
    }

    public create(client: Client): LunchOfferPagination {
        return new LunchOfferPagination(this.lunchOfferCollectionFactory.create(client));
    }
}
