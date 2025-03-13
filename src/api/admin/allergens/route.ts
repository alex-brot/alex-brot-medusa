import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";

const allergens = [
  {
    name: "A",
    tooltip: "Gluten",
  },
  {
    name: "B",
    tooltip: "Krebstiere",
  },
  {
    name: "C",
    tooltip: "Eier von Geflügel",
  },
  {
    name: "D",
    tooltip: "Fisch",
  },
  {
    name: "E",
    tooltip: "Erdnüsse",
  },
  {
    name: "F",
    tooltip: "Sojabohnen",
  },
  {
    name: "G",
    tooltip: "Milch von Säugetieren",
  },
  {
    name: "H",
    tooltip: "Schalenfrüchte",
  },
  {
    name: "L",
    tooltip: "Sellerie",
  },
  {
    name: "M",
    tooltip: "Senf",
  },
  {
    name: "N",
    tooltip: "Sesamsamen",
  },
  {
    name: "O",
    tooltip: "Schwefeloxid und Sulfite",
  },
  {
    name: "P",
    tooltip: "Lupinen",
  },
  {
    name: "R",
    tooltip: "Weichtiere",
  },
];
//TODO: Make it more efficient by creating or replacing
//needed: createOrReplace method in modules/allergen-module/service.ts

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const allergenService = req.scope.resolve(ALLERGEN_MODULE);
  const allergenCount = await allergenService.getCountSql();
  const dbAllergens = await allergenService.listAllergens();

  if (allergenCount === 14) {
    return res.status(400).json({ message: "Allergens already created" });
  }
  allergenService.deleteAllergens(dbAllergens.map((a) => a.id));

  allergenService.createAllergens(allergens);

  return res.status(201).json({ message: "Allergens created" });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const allergenService = req.scope.resolve(ALLERGEN_MODULE);
  const allergens = await allergenService.listAndCountAllergens();

  return res.status(200).json(allergens);
};
