// These interfaces are used to implement the Observer design pattern inside ReminderController and View classes.

export interface Notification {
    message: string;
}

export interface NotificationObserver {
    updateNotificaitons(notification: Notification): void;
}

export interface NotificationSubject {
    registerObserver(observer: NotificationObserver): void;
    removeObserver(observer: NotificationObserver): void;
    notifyObservers(): void;
    addNotificaition(notification: Notification): void;
}