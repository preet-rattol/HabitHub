import { Database } from "./Database";
import QuoteService from "./QuoteService";
import { Frequency, HabitModel } from "./models/HabitModel";

async function setup(){
    // Uses Singleton design pattern
    const dbInstance = await Database.getInstance();

    // Uses Dependency Injection design pattern
    const quoteInstance = new QuoteService();
    const quote = await quoteInstance.getQuote();
    console.log(`\nQUOTE FROM API: \n${quote}\n`);

    await HabitModel.deleteAllHabits();

    const habit1 = await HabitModel.createHabit('Weight Training', Frequency.Weekly, 3);
    const habit2 = await HabitModel.createHabit('Running for 20 mins', Frequency.Daily);
    
    habit2.name = 'Running for 30 mins';
    await HabitModel.updateHabit(habit2);

    const list = await HabitModel.listHabits();
} 

setup();