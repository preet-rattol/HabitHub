import { Database } from "./Database";
import QuoteService from "./QuoteService";
import HabitController from "./controllers/HabitController";
import { ReminderController } from "./controllers/ReminderController";

async function setup(){
    // Calling the triggerReminders() so that it fetches all the latest reminders from database when application is first started.
    const reminderController = new ReminderController();
    await reminderController.triggerReminders();

    // Following is using Dependency Injection pattern where we insert the QuoteService dependency into the HabitController
    const quoteService = new QuoteService();
    const habitController = new HabitController(quoteService);
    await habitController.run();
} 

setup();