import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1763819552684 implements MigrationInterface {
    name = 'Migration1763819552684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "invited_at",
                type: "timestamptz",
                isNullable: true,
            })
        );
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "deleted_at",
                type: "timestamptz",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "deleted_at");
        await queryRunner.dropColumn("user", "invited_at");
    }
}
