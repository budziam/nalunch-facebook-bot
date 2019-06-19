import { Container } from "inversify";
import { setup } from "../utils";
import { LunchOfferComposer } from "../../src/LunchOfferComposer";
import { Client } from "../../src/client/Client";

describe("Lunch offer composer", () => {
    let container: Container;

    beforeEach(() => {
        container = setup();
    });

    it("displays message", async () => {
        const client = new Client("abc");
        client.position = {
            latitude: 50.0646501,
            longitude: 19.9449799,
        };

        const message = await container.get(LunchOfferComposer).composeFor(client);

        console.log(message);
    });
});
