import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class createTransactionColumn1621377441705 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "transactions",
      new TableColumn(
        {
          name: "category_id",
          type: "uuid",
          isNullable: true
        }
      )
    )

    await queryRunner.createForeignKey("transactions", new TableForeignKey({
      referencedTableName: "categories",
      columnNames: ["category_id"],
      referencedColumnNames: ["id"],
      name: "TransactionCategory",
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey("transactions", "TransactionCategory")
    await queryRunner.dropColumn("transactions", "category_id")

  }


}
