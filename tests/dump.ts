import { config } from 'dotenv';
// import { getConnection } from 'typeorm';
import startConnection from '../src/database/index';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

async function Dump () {
  try {
    await startConnection();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}

Dump();
