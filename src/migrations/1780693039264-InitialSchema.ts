import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780693039264 implements MigrationInterface {
    name = 'InitialSchema1780693039264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "motorcycleId" uuid, "userId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer')`);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rentals_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "public"."rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "status" "public"."rentals_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "motorcycleId" uuid, CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."motorcycles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "cc" integer NOT NULL, "pricePerDay" numeric(10,2) NOT NULL, "imageUrl" character varying, "isAvailable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6e34aca06f3000916257494a4aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."reviews" ADD CONSTRAINT "FK_920fcc32c1b2d328ec16f00a864" FOREIGN KEY ("motorcycleId") REFERENCES "public"."motorcycles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."rentals" ADD CONSTRAINT "FK_ffe1d7b0b585885667954522513" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."rentals" ADD CONSTRAINT "FK_1979a19349c81247d45e0e51f7e" FOREIGN KEY ("motorcycleId") REFERENCES "public"."motorcycles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."rentals" DROP CONSTRAINT "FK_1979a19349c81247d45e0e51f7e"`);
        await queryRunner.query(`ALTER TABLE "public"."rentals" DROP CONSTRAINT "FK_ffe1d7b0b585885667954522513"`);
        await queryRunner.query(`ALTER TABLE "public"."reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "public"."reviews" DROP CONSTRAINT "FK_920fcc32c1b2d328ec16f00a864"`);
        await queryRunner.query(`DROP TABLE "public"."motorcycles"`);
        await queryRunner.query(`DROP TABLE "public"."rentals"`);
        await queryRunner.query(`DROP TYPE "public"."rentals_status_enum"`);
        await queryRunner.query(`DROP TABLE "public"."users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "public"."reviews"`);
    }

}
