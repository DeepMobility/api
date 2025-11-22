import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1762876963797 implements MigrationInterface {
    name='Migration1762876963797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "account",
            new TableColumn({
                name: "allowed_domains",
                type: "text",
                isArray: true,
                default: "'{}'"
            })
        );

        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "confirmed_at",
                type: "timestamptz",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("account", "allowed_domains");
        await queryRunner.dropColumn("user", "confirmed_at");
    }

}
