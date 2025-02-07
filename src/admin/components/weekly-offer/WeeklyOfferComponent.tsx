import { useState } from "react";
import { Container, Table, Button } from "@medusajs/ui";
import { ProductTableRow } from "../../routes/weekly-offer/page";
import { AdminProduct } from "@medusajs/framework/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";

export type WeeklyOfferComponentType = {
  id: string;
  title: string;
  from: string;
  to: string;
  products: [{ id: string }];
};

 export type EndNowAndDeleteType = {
   weeklyOfferId: string;
 };

const WeeklyOfferComponent = ({
  weeklyOffer,
}: {
  weeklyOffer: WeeklyOfferComponentType;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const queryClient = useQueryClient();

  const endNowMutation = useMutation({
    mutationFn: (data: EndNowAndDeleteType) =>
      sdk.client.fetch(`/admin/weekly-offers`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: EndNowAndDeleteType) =>
      sdk.client.fetch(`/admin/weekly-offers`, {
        method: "DELETE",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  //TODO: fix window.location.reload() with something else

  const handleEndNow = async (weeklyOfferId: string) => {
      endNowMutation.mutate({ weeklyOfferId: weeklyOfferId });
      window.location.reload();
  }

  const handleDelete = async (weeklyOfferId: string) => {
    deleteMutation.mutate({ weeklyOfferId: weeklyOfferId });
    window.location.reload();
  };

  const displayedProducts = isExpanded
    ? weeklyOffer.products
    : weeklyOffer.products.slice(0, 3);

  return (
    <Container className="w-[30%] h-200 m-3 relative flex flex-col">
      <h1 className="text-xl">{weeklyOffer.title}</h1>
      <div className="flex text-xs">
        <p>
          {new Date(weeklyOffer.from).toDateString()} -{" "}
          {new Date(weeklyOffer.to).toDateString()}
        </p>
      </div>
      <p className="text-xs">products: {weeklyOffer.products.length}</p>

      {weeklyOffer.products.length > 3 && (
        <Button onClick={toggleExpand} className="mt-4">
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}

      <Table className="mt-8 mb-20 w-full">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Thumbnail</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {displayedProducts.map((product) => (
            <ProductTableRow
              product={product as AdminProduct}
              key={product.id}
            ></ProductTableRow>
          ))}
        </Table.Body>
      </Table>
      <Button className="absolute bottom-7" onClick={() => handleEndNow(weeklyOffer.id)}>End Now</Button>
      <Button className="absolute top-3 right-3" onClick={() => handleDelete(weeklyOffer.id)}>X</Button>
    </Container>
  );
};

export default WeeklyOfferComponent;
