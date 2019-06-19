import { Coordinates } from "chunk";
import { Psid } from "../messenger/types";
import { ClientProfile } from "./types";

export enum ClientState {
    ActionChoice = 1,
    ListBusinesses = 2,
}

export class Client {
    public profile?: ClientProfile;
    public location?: Coordinates;
    private readonly _psid: Psid;
    private _state: ClientState = ClientState.ActionChoice;

    public constructor(psid: Psid) {
        this._psid = psid;
    }

    public get psid(): Psid {
        return this._psid;
    }

    public get state(): ClientState {
        return this._state;
    }

    public moveToState(newState: ClientState): void {
        this._state = newState;
    }
}
