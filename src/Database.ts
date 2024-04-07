import * as sql from 'mssql';
import { dbConfig } from './config';

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
  private constructor() {}

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

  /**
   * This method connects to the Azure sql database using dbConfig and stores the connection in poolconnection
   * I have also implemented a retrying mechanism which will try 5 times to connect to the database before logging an error.
   */
  private async connect(): Promise<void> {
    try {
      // console.log(`Connecting to Database...`);
      if (!this.poolconnection) {
        this.poolconnection = await sql.connect(dbConfig);
        this.connected = true;
        // console.log('Database connection SUCCESSFUL');
      }
    } catch (error) {
      if(this.retryCount <= 5){
        this.retryCount++;
        console.log(`Retrying Database connection (${this.retryCount} try)...`);
        await this.connect();
      }else{
        console.error(`ERROR connecting to database: ${JSON.stringify(error)}`);
      }
    }
  }

  /**
   * This method will close the connection to Azure Sql database
   */
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

  /**
   * This method takes a SQL query from user and returns the results after executing it.
   * @param query - sql query
   * @returns Sql RecordSet
   */
  public async executeQuery(query: string): Promise<any> {
    if (this.poolconnection) {
      const request = this.poolconnection.request();
      const result = await request.query(query);

      return result.recordset;
    }
  }
}

export { Database };