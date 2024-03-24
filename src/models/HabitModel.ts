import { Database } from "../Database";
import { v4 as uuidv4 } from 'uuid';

export enum Frequency {
    Daily = "DAILY",
    Weekly = "WEEKLY"
}

export class Habit {
    constructor(public id: string, public name: string, public frequency: Frequency, public frequencyCount: number, public progress: number) {}
} 

export class HabitModel{
    public async createHabit(name: string, frequency: Frequency, frequencyCount?: number): Promise<Habit> {
        try {
            const dbInstance = await Database.getInstance();

            const uuid: string = uuidv4();

            const result = await dbInstance.executeQuery(`
                INSERT INTO Habit (id, name, frequency, frequencyCount) 
                VALUES ('${uuid}', '${name}', '${frequency}', '${frequencyCount}' || ${null});
                SELECT * from Habit WHERE id = '${uuid}';
            `);

            console.log(`\nHabit "${result[0].name}" created successfully!`);

            return result[0] as Habit;
        } catch (error) {
            console.error('Error creating habit:', error);
            throw error;
        }
    }

    public async deleteHabit(id: string): Promise<void> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                DELETE FROM Habit WHERE id = '${id}';
            `);
            console.log(`\nHabit ${id} deleted successfully!`);
        } catch (error) {
            console.error('Error deleting habit:', id);
            throw error;
        }
    }

    public async deleteAllHabits(): Promise<void> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                DELETE FROM Habit;
            `);
            console.log(`All habits deleted successfully!`);
        } catch (error) {
            console.error('Error deleting all habits');
            throw error;
        }
    }

    public async listHabits(): Promise<Habit[]> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                SELECT * from Habit;
            `);

            console.log(`\nListing all habits... \n`);
            console.log(result);

            return result as Habit[];
        } catch (error) {
            console.error('Error getting list of habits');
            throw error;
        }
    }

    public async updateHabit(habit: Habit): Promise<Habit> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                UPDATE HABIT SET 
                name='${habit.name}',
                frequency='${habit.frequency}',
                frequencyCount='${habit.frequencyCount}' || ${null},
                progress='${habit.progress}'
                WHERE id = '${habit.id}';
                SELECT * from Habit WHERE id = '${habit.id}';
            `);
            console.log(`\nHabit id:${result[0].id} updated successfully!`);

            return result[0] as Habit;
        } catch (error) {
            console.error('Error updating habit:', habit.id);
            throw error;
        }
    }
}