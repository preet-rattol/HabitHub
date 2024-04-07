import { Database } from "../Database";
import { v4 as uuidv4 } from 'uuid';

export enum ReminderDuration {
    EveryMinute = 1,
    Every2Minutes = 1 * 2,
    Every5Minutes = 1 * 5
}

/**
 * We are using MVC pattern in this class as it is our model for Reminders
 */
export class ReminderModel{
    constructor(public id?: string, public habitId?: string, public duration?: ReminderDuration) {}

    /**
     * Create a new reminder in Azure SQL database
     * @param habitId - habitId to which this reminder belongs
     * @param duration - reminder duration, after every {n} minutes it will be triggered
     * @returns 
     */
    public async createReminder(habitId: string, duration: ReminderDuration): Promise<ReminderModel> {
        try {
            const dbInstance = await Database.getInstance();
            const existingReminder = await dbInstance.executeQuery(`SELECT * from Reminder WHERE habitId = '${habitId}';`);           

            if(existingReminder && existingReminder[0]){
                console.log('Reminder already exists!');
                return existingReminder[0] as ReminderModel;
            }else{
                const uuid: string = uuidv4();            

                const result = await dbInstance.executeQuery(`
                    INSERT INTO Reminder (id, habitId, duration) 
                    VALUES ('${uuid}', '${habitId}', ${duration});
                    SELECT * from Reminder WHERE id = '${uuid}';
                `);
                console.log('Reminder created successfully!');
                return result[0] as ReminderModel;
            }           
        } catch (error) {
            console.error('Error creating reminder:', error);
            throw error;
        }
    }

    /**
     * Deletes a reminder for a habit
     * @param habitId habitId for which reminder should be deleted
     * @returns 
     */
    public async deleteReminder(habitId: string): Promise<void> {
        try {
            const dbInstance = await Database.getInstance();

            const uuid: string = uuidv4();

            const result = await dbInstance.executeQuery(`
                DELETE FROM Reminder WHERE habitId = '${habitId}';
            `);

            console.log('Reminder deleted successfully!');

            return result;
        } catch (error) {
            console.error('Error deleting reminder:', error);
            throw error;
        }
    }

    /**
     * Returns back a list of all reminders for all
     * @returns ReminderModel[]
     */
    public async getAllReminders(): Promise<ReminderModel[]> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                SELECT * from Reminder;
            `);

            return result as ReminderModel[];
        } catch (error) {
            console.error(`Error getting all reminders!`);
            throw error;
        }
    }
}