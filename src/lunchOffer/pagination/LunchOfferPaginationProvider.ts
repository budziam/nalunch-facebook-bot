import { LunchOfferPaginationFactory } from "./LunchOfferPaginationFactory";
import { Client } from "../../client/Client";
import { LunchOfferPagination } from "./LunchOfferPagination";
import { Psid } from "../../messenger/types";
import { injectable } from "inversify";

@injectable()
export class LunchOfferPaginationProvider {
    private readonly paginations: Map<Psid, LunchOfferPagination> = new Map();

    public constructor(private readonly lunchOfferPaginationFactory: LunchOfferPaginationFactory) {
        //
    }

    public get(client: Client): LunchOfferPagination {
        if (!this.paginations.has(client.psid)) {
            this.paginations.set(client.psid, this.lunchOfferPaginationFactory.create(client));
        }

        return this.paginations.get(client.psid);
    }
}
