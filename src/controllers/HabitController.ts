import QuoteService from "../QuoteService";
import { HabitModel } from "../models/HabitModel";
import { View } from "../view/View";
import { ReminderController } from "./ReminderController";
const prompt = require('prompt-sync')({sigint: true});

export class HabitController {
    private view: View;
    private model: HabitModel;

    constructor (private quoteService?: QuoteService){
        this.view = new View();
        this.model = new HabitModel();
    }

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
                this.listHabits();
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

    checkNotifications() {
        this.view.checkNotifications();
    }

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

    public async listHabits(): Promise<void> {
        const list = await this.model.listHabits();        
        this.view.checkProgress(list);
        this.getBackToMenu();
    }

    public getBackToMenu() : void {
        const input = prompt(`Enter 0 to go back to Menu: `);
        if(input === '0'){
            console. clear();
            this.run();
        }else{
            this.getBackToMenu();
        }
    }

    public async getHabit(habitId: string): Promise<HabitModel>{
        return this.model.getHabit(habitId);
    }
    

}

export default HabitController;
