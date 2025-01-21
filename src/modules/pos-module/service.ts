import { InjectManager, MedusaContext, MedusaService } from "@medusajs/framework/utils";
import PosAuth from "./models/pos-auth";
import EntryTimestamp from "./models/entry-timestamp";
import { Context } from "@medusajs/framework/types";
import { EntityManager } from "@mikro-orm/knex";


class PosService extends MedusaService({
  PosAuth,
  EntryTimestamp,
}) {
  @InjectManager()
  async getCountSql(
    input:{
        customerId: string;
    },
    @MedusaContext() sharedContext?: Context<EntityManager>
  ): Promise<number> {

    const data = await sharedContext!.manager!.execute(
      "SELECT COUNT(*) as num FROM public.order where customer_id='" + input.customerId + "'",
    ) 
    
    return parseInt(data[0].num)
  }

}

export default PosService;
