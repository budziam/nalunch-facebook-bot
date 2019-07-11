import * as faker from "faker";
import { injectable } from "inversify";
import { boundClass } from "autobind-decorator";
import { Client } from "../src/client/Client";
import {
    Business,
    FacebookSource,
    Food,
    FoodType,
    LunchOffer,
    Publication,
    slugify,
    Location,
} from "chunk";
import * as moment from "moment";

// TODO Use some library for creating tests entities instead of reinventing a wheel

const many = <T>(count: number, callback: () => T): T[] => {
    const output = [];

    for (let i = 0; i < count; i += 1) {
        output.push(callback());
    }

    return output;
};

@boundClass
@injectable()
export class Factory {
    public clients(count: number, attributes: Partial<Client> = {}): Client[] {
        return many(count, this.client.bind(this, attributes));
    }

    public client(attributes: Partial<Client> = {}): Client {
        return new Client({
            psid: faker.random.uuid(),
            ...attributes,
        });
    }

    public lunchOffers(count: number, attributes: Partial<LunchOffer> = {}): LunchOffer[] {
        return many(count, this.lunchOffer.bind(this, attributes));
    }

    public lunchOffer(attributes: Partial<LunchOffer> = {}): LunchOffer {
        return new LunchOffer({
            date: moment(),
            business: this.business(),
            publications: [this.publication()],
            foods: this.foods(3),
            ...attributes,
        });
    }

    public businesses(count: number, attributes: Partial<LunchOffer> = {}): LunchOffer[] {
        return many(count, this.lunchOffer.bind(this, attributes));
    }

    public business(attributes: Partial<Business> = {}): Business {
        const name = faker.random.word();
        return new Business({
            id: faker.random.uuid(),
            slug: slugify(name),
            name,
            location: new Location({
                latitude: 50.0646501,
                longitude: 19.9449799,
            }),
            city: "Kraków",
            timeIntervals: [],
            source: new FacebookSource({
                facebookUrl: faker.internet.url(),
            }),
            ...attributes,
        });
    }

    public publications(count: number, attributes: Partial<Publication> = {}): Publication[] {
        return many(count, this.publication.bind(this, attributes));
    }

    public publication(attributes: Partial<Publication> = {}): Publication {
        return new Publication({
            id: faker.random.number(),
            url: faker.internet.url(),
            date: moment(),
            ...attributes,
        });
    }

    public foods(count: number, attributes: Partial<Food> = {}): Food[] {
        return many(count, this.food.bind(this, attributes));
    }

    public food(attributes: Partial<Food> = {}): Food {
        return new Food({
            id: faker.random.number(),
            name: faker.lorem.sentence(),
            type: faker.random.arrayElement(Object.values(FoodType)),
            date: moment(),
            ...attributes,
        });
    }
}
