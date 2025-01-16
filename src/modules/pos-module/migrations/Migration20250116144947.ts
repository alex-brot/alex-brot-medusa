import { Migration } from '@mikro-orm/migrations';

export class Migration20250116144947 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "pos_auth" ("id" text not null, "nfcCode" text null, "code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pos_auth_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_pos_auth_deleted_at" ON "pos_auth" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "entry_timestamp" ("id" text not null, "timestamp" timestamptz not null, "typeOfEntry" text check ("typeOfEntry" in (\'NFC\', \'CODE\')) not null default \'CODE\', "pos_auth_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "entry_timestamp_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_entry_timestamp_pos_auth_id" ON "entry_timestamp" (pos_auth_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_entry_timestamp_deleted_at" ON "entry_timestamp" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "entry_timestamp" add constraint "entry_timestamp_pos_auth_id_foreign" foreign key ("pos_auth_id") references "pos_auth" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "entry_timestamp" drop constraint if exists "entry_timestamp_pos_auth_id_foreign";');

    this.addSql('drop table if exists "pos_auth" cascade;');

    this.addSql('drop table if exists "entry_timestamp" cascade;');
  }

}
