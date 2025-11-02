import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1762071484414 implements MigrationInterface {
    name='Migration1762071484414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "is_admin",
                type: "boolean",
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "is_admin");
    }

}