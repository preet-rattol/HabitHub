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
                VALUES ('${uuid}', '${name}', '${frequency}', '${frequencyCount}');
                SELECT * from Habit WHERE id = '${uuid}';
            `);

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
            console.log(`Habit ${id} deleted successfully`);
        } catch (error) {
            console.error('Error deleting habit:', id);
            throw error;
        }
    }
}