import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading } from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

type CountResponseType = {
    count: number;
}

// The widget
const ProductWidget = () => {

    const queryClient = useQueryClient();


    const { data: countResponse } = useQuery<CountResponseType>({
    queryFn: () => sdk.client.fetch("/admin/allergens/count"),
    queryKey: [["allergens", "count"]],
    });

    const mutation = useMutation({
      mutationFn: () =>
        sdk.client.fetch(`/admin/allergens`, {
          method: "POST",
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["weekly-offers"] });
      },
    });


    if (!countResponse) {
      return <><h1>Something went wrong</h1></>;
    }
    console.log(countResponse);

   
   const handleSubmit = async () => {
        const response = mutation.mutate();
        console.log(response);
    };
    

  return countResponse?.count == 14 ? (
    <></>
  ) : (
    <Container className="divide-y p-0 w-[25%]">
      <div className="flex items-start justify-between flex-col px-6 py-4">
        <Heading level="h1" className="text-red-400">
          Missing Allergens Alert {countResponse ? countResponse.count : "undefined"}
        </Heading>
        <p className="text-sm text-gray-500">
          No or missing allergens in the database.
        </p>

        <Button
          onClick={() => handleSubmit()}
          className="mt-4"
        >
          Add Allergens Now
        </Button>
      </div>
    </Container>
  );
    };

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "order.list.before",
});

export default ProductWidget;
