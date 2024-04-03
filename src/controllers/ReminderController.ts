import { NotificationObserver, NotificationSubject, Notification } from "../models/NotificaitonModel";
import { ReminderDuration, ReminderModel } from "../models/ReminderModel";
import { View } from "../view/View";
import HabitController from "./HabitController";

export class ReminderController implements NotificationSubject {
    private view: View;
    private model: ReminderModel;
    private observers: NotificationObserver[] = [];
    private notifications: Notification[] = [];

    constructor (){
        this.view = new View();
        this.model = new ReminderModel();

        this.registerObserver(this.view);
    }

    registerObserver(observer: NotificationObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: NotificationObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(): void {
        const latestNotification = this.notifications[this.notifications.length - 1];
        this.observers.forEach(observer => observer.updateNotificaitons(latestNotification));
    }

    addNotificaition(notification: Notification): void {
        this.notifications.push(notification);
        this.notifyObservers();
    }

    public async createReminder(habitId: string): Promise<void> {
        const result = await this.model.createReminder(habitId, ReminderDuration.Every2Minutes);
        this.view.showConfirmationMessage(result);  
        this.triggerReminders();
    }

    public async removeReminder(habitId: string, hideConfirmation?: boolean): Promise<void> {
        const result = await this.model.deleteReminder(habitId);
        if(!hideConfirmation) this.view.showConfirmationMessage(result);  
        this.triggerReminders(); 
    }

    public async triggerReminders() : Promise<void>{
        const result = await this.model.getAllReminders();
        const habitController = new HabitController();

        result.forEach(async r => {
            if(r.habitId){
                const habit = await habitController.getHabit(r.habitId);
                const notification : Notification = {
                    message:`This is a reminder for "${habit.name}". Your progress count is ${habit.progress} since ${(habit.startDate)?.toLocaleDateString('en-US')}`
                }                
                this.addNotificaition(notification);
            }
        });
    }

}
