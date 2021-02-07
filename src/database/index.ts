import '../helpers/env';
import { createConnection } from 'typeorm';
import path from 'path';

class Connection {
  public async startConnection (): Promise<any> {
    await createConnection({
      type: 'mysql',
      host: process.env.HOST,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: 3306,
      synchronize: true,
      logging: false,
      migrationsRun: true,
      entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')]
    });
  }
}

export default new Connection().startConnection;
