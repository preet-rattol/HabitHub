import axios from 'axios';

/**
 * QuoteService class uses Dependency Injection (DI) design pattern where components are given their dependencies rather than creating them internally.
 * This allows to create new instances wherever needed and pass them to the components that require them. 
 * 
 * This way I make sure that for an app instance I am caching the generated quote and re-using it in all views. If I need to generate a new quote,
 * I can create a new instance of this class and use it directly in that component. Otherwise, I will always be passing the same instance of this class to my components using Dependency Injection.
 */
class QuoteService {
    private cachedQuote: string | null = null;

    public async getQuote(): Promise<string> {
        if (this.cachedQuote) {
            return this.cachedQuote;
        }

        const response = await axios.get('https://zenquotes.io/api/random');
        const quote = response.data[0].q;

        this.cachedQuote = quote;
        return quote;
    }

    
}

export default QuoteService;
