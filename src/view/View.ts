import { HabitModel } from "../models/HabitModel";
import { NotificationObserver, Notification } from "../models/NotificaitonModel";

const prompt = require('prompt-sync')({sigint: true});

/**
 * View class implements NotificationObserver as it wants to receive all notifications generated by ReminderController which implements NotificationSubject
 * We are using Observer design pattern here.
 */
export class View implements NotificationObserver{
    private stars: string = '\n***************************\n ';
    private dashes: string = '---------------------------';
    private static notificationMessages: string[] = [];

    constructor(){}

    /**
     * This method displays the Menu Options to the user
     * @param quote quote text to display on Menu screen
     * @returns return a string for Menu Option selected by user
     */
    public displayMenu(quote: string) : string|null {
        console.log(this.stars);
        console.log('"' + quote + '"');
        console.log('\nMenu Options:\n');
        
        console.log('1. Create Habit');
        console.log('2. Update Habit');
        console.log('3. Add Progress');
        console.log('4. Check Progress');
        console.log('5. Delete Habit');
        console.log(`6. Check Notifications (${View.notificationMessages.length} messages)`);        
        console.log(this.stars);

        const userOption = prompt('Please choose your option: ');
        return userOption;
    }

    /**
     * Displays UI to collect Habit name from user to create a new habit
     * @returns HabitModel
     */
    public createHabit() : HabitModel{
        const newHabit = new HabitModel();

        console.log(this.stars);
        newHabit.name = prompt('Enter Habit Name: ');
        return newHabit;
    }

    /**
     * Displays UI to collect Habit name from user to update a habit
     * @param habit 
     * @returns 
     */
    public updateHabit(habit: HabitModel) : HabitModel {
        console.log(this.stars);
        
        if(habit){
            habit.name = prompt(`Enter new name (${habit.name}): `);
        }

        return habit;
    }

    /**
     * Display a UI for showing latest information for all habits
     * @param list : HabitModel[]
     */
    public checkProgress(list: HabitModel[]){
        console.log(this.stars);
        list.forEach((habit,i) => {
            const date = habit.startDate;
            const formattedDate = date?.toLocaleDateString('en-US');

            console.log(`Name: ${habit.name}`);
            console.log(`Date Started: ${formattedDate}`);
            console.log(`Progress: ${habit.progress}`);
            if(i<list.length - 1){
                console.log(this.dashes);
            }
        })
        console.log(this.stars);
    }

    /**
     * Display a UI to let users pick one habit from list of habits provided.
     * @param list - HabitModel[]
     * @param operation - text to show for type of operation when picking a habit
     * @returns 
     */
    public chooseHabit (list: HabitModel[], operation: string) : HabitModel | undefined {
        let habit;
        console.log(this.stars);
        
        list.forEach((habit,i) => {
            console.log(`${i+1}. ${habit.name}`);
        });

        console.log(this.dashes);

        const habitToUpdate = prompt(`Select Habit # to ${operation}: `);
        if(parseInt(habitToUpdate) && list[parseInt(habitToUpdate)-1]){
            habit = list[parseInt(habitToUpdate)-1];            
        }
        return habit;
    }

    /**
     * Display a UI for asking user what do they want to update for a habit
     * @returns the user selected option as string
     */
    public chooseUpdateOption () : string {
        console.log(this.dashes);
        console.log('1. Update Habit name');
        console.log('2. Turn ON Reminder');
        console.log('3. Turn OFF Reminder');
        console.log(this.dashes);
        const updateOption = prompt(`Select your option: `);
        return updateOption;
    }

    /**
     * Display a UI for showing a confimration message for diffeeret operations
     * @param message text to display as confirmation
     */
    public showConfirmationMessage(message?: any): void{
        if(message) console.log(message);
        console.log(this.stars);
    }

        /**
     * This method will be called by the object implementing NotificationSubject (ReminderController) to notify the observers (View) for any update.
     * It receives the latest notification from NotificationSubject and adds the message text to local notificationMessages array.
     * @param notification Notification
     */
        public updateNotificaitons(notification: Notification): void {        
            View.notificationMessages.push(notification.message)
        }
    
        /**
         * This method displays the notifications to the user
         */
        public checkNotifications() {
            console.log(this.stars);
            View.notificationMessages.forEach((message,i) => {
                console.log(`${message}`); 
            })
            console.log(this.stars);
            View.notificationMessages = [];
        }
}