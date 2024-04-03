import { HabitModel } from "../models/HabitModel";
import { NotificationObserver, Notification } from "../models/NotificaitonModel";

const prompt = require('prompt-sync')({sigint: true});

export class View implements NotificationObserver{
    private stars: string = '\n***************************\n ';
    private dashes: string = '---------------------------';
    private static notificationMessages: string[] = [];

    constructor(){}

    public updateNotificaitons(notification: Notification): void {        
        View.notificationMessages.push(notification.message)
    }

    public checkNotifications() {
        console.log(this.stars);
        View.notificationMessages.forEach((message,i) => {
            console.log(`${i+1}. ${message}`); 
        })
        console.log(this.stars);
    }

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

    public createHabit() : HabitModel{
        const newHabit = new HabitModel();

        console.log(this.stars);
        newHabit.name = prompt('Enter Habit Name: ');
        return newHabit;
    }

    public updateHabit(habit: HabitModel) : HabitModel {
        console.log(this.stars);
        
        if(habit){
            habit.name = prompt(`Enter new name (${habit.name}): `);
        }

        return habit;
    }

    public deleteHabit(habit: HabitModel) : void {
        console.log(this.stars);
        console.log(`Habit ${habit.id} deleted successfully!`);
        console.log(this.stars);
    }

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

    public chooseUpdateOption () : string {
        console.log(this.dashes);
        console.log('1. Update Habit name');
        console.log('2. Turn ON Reminder');
        console.log('3. Turn OFF Reminder');
        console.log(this.dashes);
        const updateOption = prompt(`Select your option: `);
        return updateOption;
    }

    public showConfirmationMessage(message?: any): void{
        if(message) console.log(message);
        console.log(this.stars);
    }
}