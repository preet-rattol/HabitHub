import QuoteService from "../QuoteService";
import { HabitModel } from "../models/HabitModel";
import { View } from "../view/View";
import { ReminderController } from "./ReminderController";
const prompt = require('prompt-sync')({sigint: true});

/**
 * We are using Dependency Injection pattern and MVC pattern in this class.
 * 
 * It takes an instance of QuoteService in constructor to access the cached quote. This way it decouples the quote caching logic from the Habit implementation, making it easier to manage and test both functionality separately.
 */
export class HabitController {
    private view: View;
    private model: HabitModel;

    /**
     * Expects QuoteService as a Dependency Injection
     * @param quoteService QuoteService
     */
    constructor (private quoteService?: QuoteService){
        this.view = new View();
        this.model = new HabitModel();
    }

    /**
     * This method calls the View to display Menu Options and then based on the user input for option,
     * it calls the specific methods for those operations.
     */
    public async run(): Promise<void> {
        const quote  = this.quoteService ? await this.quoteService.getQuote() : '';
        const selectedMenu = this.view.displayMenu(quote);
        
        switch(selectedMenu){
            case '1':
                this.createHabit();
                break;
            case '2':
                this.updateHabit();
                break;
            case '3':
                this.addProgress();
                break;
            case '4':
                this.checkProgress();
                break;
            case '5':
                this.deleteHabit();
                break;
            case '6':
                this.checkNotifications();
                break;
            default:
                console.log('\n Invalid Option! Try Again. \n');
                this.run();
        } 
    }

    /**
     * Calls the View to display UI for collecting new habit name and then passes down the new habit data to model for creating new habit.
     * 
     * After that it asks the users if they want to return back to Menu.
     */
    public async createHabit(): Promise<void> {
       const habit = this.view.createHabit();
       if(habit?.name){
            const result = await this.model.createHabit(habit.name!);
            this.view.showConfirmationMessage(result);   
       }else{
            console.log('Cannot create new Habit due to Invalid Data!');
       }
       this.getBackToMenu();
    }

    /**
     * Calls the View to display the UI for selecting a habit to update and then collecting new data for that habit. 
     * Finally it passes down that updated data to model for updating a habit.
     * 
     * After that it asks the users if they want to return back to Menu.
     */
    public async updateHabit(): Promise<void> {
        const reminderController = new ReminderController();
        const list = await this.model.listHabits();
        const habitToUpdate = this.view.chooseHabit(list, 'update');

        if(habitToUpdate && habitToUpdate.id){
            const updateOption =  this.view.chooseUpdateOption();

            if(updateOption === '1'){
                const editedHabit = this.view.updateHabit(habitToUpdate);
                const result = await this.model.updateHabit(editedHabit);
                this.view.showConfirmationMessage(result);   
            }else if(updateOption === '2'){
                await reminderController.createReminder(habitToUpdate.id); 
            }else if(updateOption === '3'){
                await reminderController.removeReminder(habitToUpdate.id); 
            }
        }
        this.getBackToMenu();  
    }

    /**
     * Calls the View to display the UI for selecting a habit to delete and then passes down that habit to model for deleting it.
     * It also calls the ReminderController().removeReminder() to delete associated reminders to the habit before deleting the habit itself. 
     * It is required to avoid because Reminder uses a Habit's Id as a Foreign Key in Azure SQL database.
     * 
     * After that it asks the users if they want to return back to Menu.
     */
    public async deleteHabit(): Promise<void> {
        const reminderController = new ReminderController();

        const list = await this.model.listHabits();
        const habitToDelete = this.view.chooseHabit(list, 'delete');

        if(habitToDelete && habitToDelete.id){
            await reminderController.removeReminder(habitToDelete.id, true)
            await this.model.deleteHabit(habitToDelete.id);
        }
        this.getBackToMenu(); 
    }

    /**
     * Calls the View to display the UI for selecting a habit for which user wants to add progress.
     * It then increments the progress of the selected habit by one and passes down to model to save it in database.
     * 
     * After that it asks the users if they want to return back to Menu.
     */
    public async addProgress(): Promise<void> {
        const list = await this.model.listHabits();
        const habitToUpdate = this.view.chooseHabit(list, 'progress');

        if(habitToUpdate){
            habitToUpdate.progress = (habitToUpdate.progress || 0) + 1;
            const result = await this.model.updateHabit(habitToUpdate);
            this.view.showConfirmationMessage(result);   
            this.getBackToMenu();
        }
    }

    /**
     * Gets list of all Habits from database using the Model and then call the View to diplsay all the habits to user 
     * 
     * After that it asks the users if they want to return back to Menu.
     */
    public async checkProgress(): Promise<void> {
        const list = await this.model.listHabits();        
        this.view.checkProgress(list);
        this.getBackToMenu();
    }

    /**
     * Calls the View to display the latest notifications
     * 
     * After that it asks the users if they want to return back to Menu.
    */
    public checkNotifications() {
        this.view.checkNotifications();
        this.getBackToMenu(); 
    }

    /**
     * It asks for user input if they want to go back to Menu Options after completing some action
     */
    public getBackToMenu() : void {
        const input = prompt(`Enter 0 to go back to Menu: `);
        if(input === '0'){
            console. clear();
            this.run();
        }else{
            this.getBackToMenu();
        }
    }

    /**
     * It calls the model to get the latest information about a habit from database
     * @param habitId Id of habit you want to get from database
     * @returns HabitModel
     */
    public async getHabit(habitId: string): Promise<HabitModel>{
        return this.model.getHabit(habitId);
    }
    

}

export default HabitController;
