import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class createTransactions1621375964218 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table(
        {
          name: "transactions",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
              generationStrategy: "uuid",
              default: "gen_random_uuid()"
            },
            {
              name: "title",
              type: "varchar",

            },
            {
              name: "type",
              type: "varchar",

            },
            {
              name: "value",
              type: "decimal",
              precision: 10,
              scale: 2
            },

            {
              name: "created_at",
              type: "timestamp",
              default: "now()"
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "now()"
            }

          ]
        }
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("transactions")
  }

}
