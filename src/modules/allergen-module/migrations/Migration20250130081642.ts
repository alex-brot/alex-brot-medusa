import { Migration } from '@mikro-orm/migrations';

export class Migration20250130081642 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "allergen_product" drop constraint if exists "allergen_product_product_id_foreign";');

    this.addSql('drop table if exists "allergens_product" cascade;');

    this.addSql('drop table if exists "allergen_product" cascade;');

    this.addSql('alter table if exists "allergen" add column if not exists "tooltip" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "allergens_product" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "allergens_product_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_allergens_product_deleted_at" ON "allergens_product" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "allergen_product" ("allergen_id" text not null, "product_id" text not null, constraint "allergen_product_pkey" primary key ("allergen_id", "product_id"));');

    this.addSql('alter table if exists "allergen_product" add constraint "allergen_product_allergen_id_foreign" foreign key ("allergen_id") references "allergen" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "allergen_product" add constraint "allergen_product_product_id_foreign" foreign key ("product_id") references "allergens_product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "allergen" drop column if exists "tooltip";');
  }

}
