import { HubServiceBase } from "../src/core-js/hub.service";
import { UiFunction } from "../src/core-js/notifications";

describe('Hub Service', () => {
    let hubService: HubServiceBase

    beforeAll(() => {
        hubService = new HubServiceBase();
    });

    it('should initialize all services', () => {
        expect(hubService.notificationsService).toBeDefined();
    });

    it('message should have an a new ID', () => {
        const newId = hubService.notificationsService.addNotification({
            uiFunction: UiFunction.Success,
            displayTimeout: 0,
            title: 'Testing',
            id: 0
        });
        expect(newId).toBeGreaterThan(0);
    });

    it('should have one message', () => {
        const messages = hubService.notificationsService.getNotifications();
        expect(messages.length).toEqual(1);
    });
});
