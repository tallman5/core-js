import { EventEmitter } from "../event-emitter";
import { IAppUser } from "./app-user.model";

type AppUserEvents = {
    AppUserChanged: IAppUser;
};

export class AppUserService {
    private appUser: IAppUser;

    constructor(private eventEmitter: EventEmitter<AppUserEvents>) {
        this.appUser = {
            username: 'guest'
        };
    };

    clearUser() {
        this.appUser = {
            username: 'guest'
        };
        this.eventEmitter.emit("AppUserChanged", this.appUser);
    }

    getAppUser(): IAppUser {
        return this.appUser;
    }

    setAppUser(newUser: IAppUser) {
        this.appUser = newUser;
        this.eventEmitter.emit("AppUserChanged", this.appUser);
    }
};
