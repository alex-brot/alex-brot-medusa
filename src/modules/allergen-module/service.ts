import {
  InjectManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils";

import Allergen from "./models/allergen";
import { Context } from "@medusajs/framework/types";
import { EntityManager } from "@mikro-orm/knex";

class AllergenModuleService extends MedusaService({
  Allergen,
}) {
  @InjectManager()
  async getCountSql(
    @MedusaContext() sharedContext?: Context<EntityManager>
  ): Promise<number> {
    const data = await sharedContext!.manager!.execute(
      "SELECT COUNT(*) as num FROM public.allergen"
    );

    return parseInt(data[0].num);
  }
}

export default AllergenModuleService;
