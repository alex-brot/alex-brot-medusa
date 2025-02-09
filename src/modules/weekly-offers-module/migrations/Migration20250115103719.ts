import { Migration } from '@mikro-orm/migrations';

export class Migration20250115103719 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "weekly_offer" ("id" text not null, "title" text not null, "from" timestamptz not null, "to" timestamptz not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "weekly_offer_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_weekly_offer_deleted_at" ON "weekly_offer" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "weekly_offer" cascade;');
  }

}
