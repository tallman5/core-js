import { EventEmitter, Events } from "../event-emitter";
// import { NotificationsService } from "../notifications";
import { IAppUser } from "./app-user.model";

export class AppUserService {
    private appUser: IAppUser;

    constructor(private eventEmitter: EventEmitter) {
        this.appUser = {
            username: 'guest'
        };
    };

    clearUser() {
        this.appUser = {
            username: 'guest'
        };
        this.eventEmitter.emit(Events.AppUserChanged, this.appUser);
    }

    getAppUser(): IAppUser {
        return this.appUser;
    }

    setAppUser(newUser: IAppUser) {
        this.appUser = newUser;
        this.eventEmitter.emit(Events.AppUserChanged, this.appUser);
    }
};
