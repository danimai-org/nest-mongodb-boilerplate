import { MigrationInterface, QueryRunner } from "typeorm";

export class AvatarIdFix1664212536165 implements MigrationInterface {
    name = 'AvatarIdFix1664212536165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
