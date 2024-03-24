// import Habit from '../models/habit';
// import { ConnectionPool, Request } from 'mssql';

// class HabitController {

//     async createHabit(name: string, frequency: string): Promise<Habit> {
//         try {
//             const request = this.pool.request();
//             const result = await request.query(`
//                 INSERT INTO Habits (Name, Frequency, Progress) 
//                 VALUES ('${name}', '${frequency}', 0);
//                 SELECT SCOPE_IDENTITY() AS Id;
//             `);
//             const habit = new Habit(result.recordset[0].Id, name, frequency, 0);
//             return habit;
//         } catch (error) {
//             console.error('Error creating habit:', error);
//             throw error;
//         }
//     }

//     async viewHabits(): Promise<Habit[]> {
//         try {
//             const request = this.pool.request();
//             const result = await request.query('SELECT * FROM Habits');
//             return result.recordset.map((row: any) => new Habit(row.Id, row.Name, row.Frequency, row.Progress));
//         } catch (error) {
//             console.error('Error viewing habits:', error);
//             throw error;
//         }
//     }

//     async updateHabitProgress(habitId: number): Promise<void> {
//         try {
//             const request = this.pool.request();
//             await request.query(`UPDATE Habits SET Progress = Progress + 1 WHERE Id = ${habitId}`);
//         } catch (error) {
//             console.error('Error updating habit progress:', error);
//             throw error;
//         }
//     }

//     async deleteHabit(habitId: number): Promise<void> {
//         try {
//             const request = this.pool.request();
//             await request.query(`DELETE FROM Habits WHERE Id = ${habitId}`);
//         } catch (error) {
//             console.error('Error deleting habit:', error);
//             throw error;
//         }
//     }
// }

// export default HabitController;
