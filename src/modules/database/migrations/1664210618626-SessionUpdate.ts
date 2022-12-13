import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionUpdate1664210618626 implements MigrationInterface {
    name = 'SessionUpdate1664210618626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "expired_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "expired_at" TIMESTAMP NOT NULL`);
    }

}
