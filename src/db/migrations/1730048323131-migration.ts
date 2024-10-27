import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730048323131 implements MigrationInterface {
    name = 'Migration1730048323131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flashcard_revision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "flashcardId" uuid NOT NULL, "remembered" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36c504028962a6285753901197" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flashcard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" text NOT NULL DEFAULT '', "subject" text NOT NULL DEFAULT '', "answer" text NOT NULL DEFAULT '', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0aba0501d3bc532951efc9f791" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL DEFAULT '', "subject" text NOT NULL DEFAULT '', "content" text NOT NULL DEFAULT '', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flashcard_revision" ADD CONSTRAINT "FK_9e65a2ffca61b7e9ef9518f911b" FOREIGN KEY ("flashcardId") REFERENCES "flashcard"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard" ADD CONSTRAINT "FK_1aba85cf87447e9dee9f8048d08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`ALTER TABLE "flashcard" DROP CONSTRAINT "FK_1aba85cf87447e9dee9f8048d08"`);
        await queryRunner.query(`ALTER TABLE "flashcard_revision" DROP CONSTRAINT "FK_9e65a2ffca61b7e9ef9518f911b"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "flashcard"`);
        await queryRunner.query(`DROP TABLE "flashcard_revision"`);
    }

}
