import { Database } from "./Database";
import QuoteService from "./QuoteService";
import { Frequency, HabitModel } from "./models/HabitModel";

async function setup(){
    // Uses Singleton design pattern
    const dbInstance = await Database.getInstance();

    // Uses Dependency Injection design pattern
    const quoteInstance = new QuoteService();
    const quote1 = await quoteInstance.getQuote();
    console.log(quote1);


    const hModel = new HabitModel();
    const habit1 = await hModel.createHabit('Study DSA', Frequency.Weekly, 3)
    console.log('habit1',habit1);

    await hModel.deleteHabit(habit1.id);
} 

setup();