import * as sql from 'mssql';
import { dbConfig } from '../config';

/**
 * Database class uses the Singleton pattern, to ensures that only one instance of itself is created and provides a global point of access to that instance through getInstance() method.
 */
class Database {
  private static instance: Database | null = null;
  private poolconnection: sql.ConnectionPool | null = null;
  private connected: boolean = false;
  private retryCount: number = 1;

  /**
   * To implement the Singleton pattern, I made the constructor private and provide a static method to access the single instance, ensuring that subsequent calls to the constructor return the same instance. 
   */
  private constructor() {
    console.log('/////////////////////////////////');
    console.log(`Database Server: ${dbConfig.server}`);
    console.log(`Database Name: ${dbConfig.database}`);
    console.log('/////////////////////////////////');
  }

   /**
   * The getInstance method is made static and serves as a factory method to retrieve the singleton instance of Database.
   * @returns Database instance
   */
   public static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.connect();
    }
    return Database.instance;
  }

  private async connect(): Promise<void> {
    try {
      console.log(`Connecting to Database...`);
      if (!this.connected) {
        this.poolconnection = await sql.connect(dbConfig);
        this.connected = true;
        console.log('Database connection SUCCESSFUL');
      } else {
        console.log('Database ALREADY CONNECTED');
      }
    } catch (error) {
      if(this.retryCount <= 3){
        this.retryCount++;
        console.log(`Retrying to connect to Database ${this.retryCount} try:`);
        this.connect();
      }else{
        console.error(`ERROR connecting to database: ${JSON.stringify(error)}`);
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.poolconnection) {
        await this.poolconnection.close();
        console.log('Database connection CLOSED');
      }
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  public async executeQuery(query: string): Promise<any> {
    if (this.poolconnection) {
      const request = this.poolconnection.request();
      const result = await request.query(query);

      return result.recordset;
    }
  }
}

export { Database };