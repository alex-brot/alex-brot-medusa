import { Migration } from '@mikro-orm/migrations';

export class Migration20250209232509 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "weekly_offer" add column if not exists "start" timestamptz, add column if not exists "end" timestamptz;`);
    this.addSql(`update "weekly_offer" set "start" = "from", "end" = "to";`);
    this.addSql(`alter table if exists "weekly_offer" alter column "start" set not null, alter column "end" set not null;`);
    this.addSql(`alter table if exists "weekly_offer" drop column if exists "from", drop column if exists "to";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "weekly_offer" add column if not exists "from" timestamptz, add column if not exists "to" timestamptz;`);
    this.addSql(`update "weekly_offer" set "from" = "start", "to" = "end";`);
    this.addSql(`alter table if exists "weekly_offer" alter column "from" set not null, alter column "to" set not null;`);
    this.addSql(`alter table if exists "weekly_offer" drop column if exists "start", drop column if exists "end";`);
  }
}
