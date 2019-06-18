import { Psid } from "../bus/types";
import { boundMethod } from "autobind-decorator";

export enum ClientState {
    ActionChoice = 1,
}

export interface ClientProfile {
    avatar: string;
    firstName: string;
    lastName: string;
}

export class Client {
    private _profile?: ClientProfile;
    private readonly _psid: Psid;
    private _state: ClientState = ClientState.ActionChoice;

    public constructor(psid: Psid) {
        this._psid = psid;
    }

    public get profile(): ClientProfile | undefined {
        return this._profile;
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

    @boundMethod
    public setProfile(profile: ClientProfile): void {
        this._profile = profile;
    }
}
