// import { Injectable } from "@nestjs/common";
// import { Connection, EntityMetadata } from "typeorm";

// @Injectable()
// export class TableNameResolver {
//   constructor(private readonly connection: Connection) {}

// //   async createUserTable(username: string): Promise<void> {
// //     const query = `
// //       CREATE TABLE IF NOT EXISTS ${username} (
// //         id SERIAL PRIMARY KEY,
// //         name VARCHAR(255),
// //         count INT
// //       );
// //     `;
  
// //     await this.connection.query(query);
// //   }


//   async resolve(entityName: string, userId: number): Promise<string> {
//     const entityMetadata = this.connection.getMetadata(entityName) as EntityMetadata;
//     const tableName = ${entityMetadata.tableName}_${userId};

//     // Check if table exists and create it if not
//     const hasTable = await this.connection.query(
//       SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${tableName}')
//     );

//     if (!hasTable[0].exists) {
//       await this.connection.query(CREATE TABLE ${tableName} (LIKE ${entityMetadata.tableName}));
//     }

//     return tableName;
//   }
// }