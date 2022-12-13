import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthMigration1663690429182 implements MigrationInterface {
  name = 'AuthMigration1663690429182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying(100) NOT NULL, "expired_at" TIMESTAMP NOT NULL, "logged_out_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_tokens_type_enum" AS ENUM('REGISTER_VERIFY', 'RESET_PASSWORD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying(100) NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "type" "public"."user_tokens_type_enum" NOT NULL, "expires_at" TIMESTAMP NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email_verified_at" TIMESTAMP WITH TIME ZONE, "is_active" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "avatar_id" uuid, "avatarId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "filename" character varying(150) NOT NULL, "url" character varying(255) NOT NULL, "mimetype" character varying(150) NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."user_tokens_type_enum"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
