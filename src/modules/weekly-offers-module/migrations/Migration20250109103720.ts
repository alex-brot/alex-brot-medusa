import { Migration } from '@mikro-orm/migrations';

export class Migration20250109103720 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "weekly_offer" add column if not exists "from" timestamptz not null, add column if not exists "to" timestamptz not null;');
    this.addSql('alter table if exists "weekly_offer" drop column if exists "start";');
    this.addSql('alter table if exists "weekly_offer" drop column if exists "end";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "weekly_offer" add column if not exists "start" timestamptz not null, add column if not exists "end" timestamptz not null;');
    this.addSql('alter table if exists "weekly_offer" drop column if exists "from";');
    this.addSql('alter table if exists "weekly_offer" drop column if exists "to";');
  }

}
