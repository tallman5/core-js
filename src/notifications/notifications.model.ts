export interface INotification {
    uiFunction: UiFunction
    details?: string
    displayTimeout: number
    id: number
    title?: string
};

export enum UiFunction {
    Primary = 'primary', Secondary = 'secondary', Success = 'success', Danger = 'danger',
    Warning = 'warning', Info = 'info', Light = 'light', Dark = 'dark', Link = 'link'
}
