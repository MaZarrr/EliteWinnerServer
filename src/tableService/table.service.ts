import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from 'src/users/enities/contest.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Contest)
    private readonly repository: Repository<Contest>,
    private readonly connection: Connection,
  ) {}


  async getRepository(): Promise<Repository<any>> {
    try {
        return this.repository;
    } catch (error) {
        return error;
    }
  }

  async tableExists(name: any, prefix: string): Promise<boolean> {
    try {
      await this.repository.query(`SELECT 1 FROM ${String(name)}_${String(prefix)} LIMIT 1`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRepositoryForTable(name: any, prefix?: string): Promise<Repository<any>> {
    try {
        const repository = this.connection.getRepository(`${String(name)}_${String(prefix)}`);
        return repository;
    } catch (error) {

    }
  }

  async createContestTable(name: any, prefix: string): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${String(name)}_${String(prefix)} (
        id SERIAL PRIMARY KEY,
        createdAt TIMESTAMP DEFAULT NOW(),
        updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT NOT NULL,
        group_id INT NOT NULL,
        type VARCHAR NOT NULL,
        first_name VARCHAR,
        last_name VARCHAR,
        can_access_closed BOOLEAN,
        is_closed BOOLEAN,
        contest_id VARCHAR NOT NULL,
        contest_type VARCHAR NOT NULL,
        loadingWinner BOOLEAN NOT NULL,
        user_photo VARCHAR,
        wall_id VARCHAR NOT NULL,
        prizes_count INT NOT NULL,
        prize_name VARCHAR NOT NULL,
        userKey INT NOT NULL,
        FOREIGN KEY (userKey) REFERENCES "user" (id)
      );
    `;
  
    await this.connection.query(query);
  }

  // prefix contestId
  // async createWinnersTable(name: any, prefix: string): Promise<void> {  
  // }


  async createGroupsTable(name: any, prefix: string): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${String(name)}_${String(prefix)} (
        id SERIAL PRIMARY KEY,
        createdAt TIMESTAMP DEFAULT NOW(),
        updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        group_id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        screen_name VARCHAR NOT NULL,
        description VARCHAR,
        has_photo BOOLEAN NOT NULL,
        is_closed BOOLEAN NOT NULL,
        photo_200 VARCHAR,
        access_token VARCHAR NULL,
        userKey INT NOT NULL,
        FOREIGN KEY (userKey) REFERENCES "user" (id)
      );
    `;
  
    await this.connection.query(query);
  }
  
}