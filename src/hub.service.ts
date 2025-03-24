import { AppUserService } from "./app-user/app-user.service";
import { EventEmitter } from "./event-emitter";
import { NotificationsService } from "./notifications";

export class HubServiceBase {
    eventEmitter: EventEmitter;
    appUserService: AppUserService;
    notificationsService: NotificationsService;

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.notificationsService = new NotificationsService(this.eventEmitter);
        this.appUserService = new AppUserService(this.eventEmitter);

        // Adding a note
        
        // Setup event listeners
        // this.eventEmitter.on(Events.AppUserChanged, (newDetails: IAppUser) => {
        //     this.searchService.handleAppUserChange(newDetails);
        //     this.utilitiesService.handleAppUserChange(newDetails);
        // });
    };
}
