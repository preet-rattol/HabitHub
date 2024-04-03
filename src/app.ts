import { Database } from "./Database";
import QuoteService from "./QuoteService";
import HabitController from "./controllers/HabitController";
import { ReminderController } from "./controllers/ReminderController";

async function setup(){
    // // Uses Singleton design pattern
    // const dbInstance = await Database.getInstance();

    const reminderController = new ReminderController();
    await reminderController.triggerReminders();

    const quoteService = new QuoteService();
    const habitController = new HabitController(quoteService);
    await habitController.run();
} 

setup();