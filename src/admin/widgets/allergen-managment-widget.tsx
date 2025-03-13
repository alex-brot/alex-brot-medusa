import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Checkbox, Container, Heading, Table } from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sdk } from "../lib/sdk";
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types";

type Allergen = {
  id: string;
  name: string;
  tooltip: string;
};

type AllergensMutationType = {
  productId: string;
  selected_allergen_ids: string[];
};

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const productId = data.id;
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AllergensMutationType) =>
      sdk.client.fetch(`/admin/allergens/${productId}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allergens"] });
    },
  });

  const { data: allAllergensResponse } = useQuery<any>({
    queryFn: () => sdk.client.fetch("/admin/allergens"),
    queryKey: [["all_allergens"]],
  });

  const allAlergens: Allergen[] = allAllergensResponse
    ? allAllergensResponse[0]
    : [];

  console.log(allAllergensResponse);
  //TODO: create Type for response
  const { data: usedAllergensResponse } = useQuery<any>({
    queryFn: () => sdk.client.fetch("/admin/allergens/" + productId),
    queryKey: [["allergens_for_product"]],
  });

  const usedAllergens: Allergen[] = usedAllergensResponse
    ? usedAllergensResponse[0].allergens
    : [];

  console.log(usedAllergens);

  const combinedAllergens = allAlergens.map((allergen) => {
    const isAlreadySelected = usedAllergens.find((p) => p.id === allergen.id)
      ? true
      : false;
    return { ...allergen, isAlreadySelected };
  });

  console.log(combinedAllergens);

  useEffect(() => {
    setSelectedAllergenIds(usedAllergens.map((p) => p.id));
  }, [usedAllergens]);
  console.log(usedAllergens);

  const toggleSelected = (id: string) => {
    if (selectedAllergenIds.includes(id)) {
      setSelectedAllergenIds(selectedAllergenIds.filter((p) => p !== id));
    } else {
      setSelectedAllergenIds([...selectedAllergenIds, id]);
    }
    console.log(selectedAllergenIds);
  };

  const handleSubmit = async () => {
    console.log(selectedAllergenIds);
    const data = {
      productId: productId,
      selected_allergen_ids: selectedAllergenIds,
    };
    console.log(JSON.stringify(data));

    const response = mutation.mutate(data);
    console.log(response);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between flex-col px-6 py-4 ">
        <Heading level="h1">Allergens</Heading>
        <div className="w-[80%] flex flex-col items-center">
          <Table className="my-8 w-full">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Thumbnail</Table.HeaderCell>
                <Table.HeaderCell>Selected</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {combinedAllergens.map((allergen) => (
                <AllergenTableRow
                  allergen={allergen}
                  isAlreadySelected={allergen.isAlreadySelected}
                  toggleSelected={toggleSelected}
                  key={allergen.id}
                ></AllergenTableRow>
              ))}
            </Table.Body>
          </Table>
          <Button
            className="w-[50%]"
            size="large"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

type AllergenProductRowProp = {
  allergen: Allergen;
  isAlreadySelected: boolean;
  toggleSelected: (id: string) => void;
};

const AllergenTableRow = ({
  allergen,
  isAlreadySelected,
  toggleSelected,
}: AllergenProductRowProp) => {
  const [isSelected, setIsSelected] = useState(isAlreadySelected);

  useEffect(() => {
    setIsSelected(isAlreadySelected);
  }, [isAlreadySelected]);

  const handleSelected = () => {
    const switchedState = !isSelected;
    setIsSelected(switchedState);

    toggleSelected!(allergen.id);
  };

  return (
    <Table.Row>
      <Table.Cell>{allergen.tooltip}</Table.Cell>
      <Table.Cell>{allergen.name}</Table.Cell>
      {toggleSelected !== undefined ? (
        <Table.Cell>
          <Checkbox
            checked={isSelected}
            id="product-weekly-offer"
            onClick={() => handleSelected()}
          />
        </Table.Cell>
      ) : (
        <></>
      )}
    </Table.Row>
  );
};

export default ProductWidget;
