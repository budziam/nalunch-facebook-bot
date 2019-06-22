import { LunchOffer, Food } from "chunk";

export const chooseFoods = (lunchOffer: LunchOffer): Food[] => {
    const foods: Food[] = [];
    appendFoods(foods, lunchOffer.soups, lunchOffer.lunches);
    return foods;
};

const appendFoods = (carry: Food[], soups: Food[], lunches: Food[]): void => {
    if (soups.length > 0 && carry.length < 3) {
        carry.push(soups[0]);
    }

    if (soups.length > 1 && carry.length < 3) {
        carry.push(soups[1]);
    }

    if (lunches.length > 0 && carry.length < 3) {
        carry.push(lunches[0]);
    }

    if (lunches.length > 1 && carry.length < 3) {
        carry.push(lunches[1]);
    }

    if (soups.length > 2 && carry.length < 3) {
        carry.push(soups[2]);
    }

    if (lunches.length > 2 && carry.length < 3) {
        carry.push(lunches[2]);
    }
};
