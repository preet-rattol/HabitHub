import { Database } from "../Database";
import { v4 as uuidv4 } from 'uuid';

export class HabitModel{
    constructor(public id?: string, public name?: string, public progress?: number, public startDate?: Date) {}

    public async createHabit(name: string): Promise<HabitModel> {
        try {
            const dbInstance = await Database.getInstance();

            const uuid: string = uuidv4();

            const result = await dbInstance.executeQuery(`
                INSERT INTO Habit (id, name) 
                VALUES ('${uuid}', '${name}');
                SELECT * from Habit WHERE id = '${uuid}';
            `);

            console.log(`\nHabit "${result[0].id}" created successfully!`);

            return result[0] as HabitModel;
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

    public async listHabits(): Promise<HabitModel[]> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                SELECT * from Habit;
            `);
            return result as HabitModel[];
        } catch (error) {
            console.error('Error getting list of habits');
            throw error;
        }
    }

    public async updateHabit(habit: HabitModel): Promise<HabitModel> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                UPDATE HABIT SET 
                name='${habit.name}',
                progress='${habit.progress}'
                WHERE id = '${habit.id}';
                SELECT * from Habit WHERE id = '${habit.id}';
            `);
            console.log(`\nHabit id:${result[0].id} updated successfully!`);

            return result[0] as HabitModel;
        } catch (error) {
            console.error('Error updating habit:', habit.id);
            throw error;
        }
    }

    public async getHabit(habitId: string): Promise<HabitModel> {
        try {
            const dbInstance = await Database.getInstance();
            const result = await dbInstance.executeQuery(`
                SELECT * from Habit WHERE id = '${habitId}'
            `);
            return result[0] as HabitModel;
        } catch (error) {
            console.error(`Error getting habit: ${habitId}`);
            throw error;
        }
    }
}