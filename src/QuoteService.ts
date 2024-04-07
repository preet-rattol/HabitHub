import axios from 'axios';

/**
 * QuoteService class uses Dependency Injection (DI) design pattern where components are given their dependencies rather than creating them internally. This provides flexibility in managing the lifecycle of quotes. It passes down the instance of QuoteService to other components for accessing the same cached quote. This way it decouples the quote caching logic from the component's implementation, making it easier to manage and test Quotes functionality.
 */
class QuoteService {
    private cachedQuote: string | null = null;

    /**
     * It checks the if there is already a cached quote. If not found, then it will call the zenquotes API to get a new quote and return it after storing in cache.
     * @returns quote text from the cache
     */
    public async getQuote(): Promise<string> {
        if (this.cachedQuote) {
            return this.cachedQuote;
        }

        const response = await axios.get('https://zenquotes.io/api/random');
        const quote = `${response.data[0].q} -${response.data[0].a}`;

        this.cachedQuote = quote;
        return quote;
    }

    
}

export default QuoteService;
