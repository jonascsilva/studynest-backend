import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730660106002 implements MigrationInterface {
    name = 'Migration1730660106002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userSettingsId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userSettingsId" uuid NOT NULL`);
    }

}
