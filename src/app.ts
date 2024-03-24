import { Database } from "./Database";
import QuoteService from "./QuoteService";
import { Frequency, HabitModel } from "./models/HabitModel";

async function setup(){
    // Uses Singleton design pattern
    const dbInstance = await Database.getInstance();

    // Uses Dependency Injection design pattern
    const quoteInstance = new QuoteService();
    const quote = await quoteInstance.getQuote();
    console.log(`\nQUOTE: ${quote} \n`);


    const hModel = new HabitModel();
    await hModel.deleteAllHabits();

    const habit1 = await hModel.createHabit('Weight Training', Frequency.Weekly, 3);
    const habit2 = await hModel.createHabit('Running for 20 mins', Frequency.Daily);
    
    habit2.name = 'Running for 30 mins';
    await hModel.updateHabit(habit2);

    const list = await hModel.listHabits();
} 

setup();