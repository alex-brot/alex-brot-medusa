import React, { useState } from "react";
import { Container, Table, Button } from "@medusajs/ui";
import { ProductTableRow } from "../../routes/weekly-offer/page";
import { AdminProduct } from "@medusajs/framework/types";

export type WeeklyOfferComponentType = {
  id: string;
  title: string;
  from: string;
  to: string;
  products: [{ id: string }];
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

  const displayedProducts = isExpanded
    ? weeklyOffer.products
    : weeklyOffer.products.slice(0, 3);

  return (
    <Container className="w-[30%] m-3">
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

      <Table className="mt-8 w-full">
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
    </Container>
  );
};

export default WeeklyOfferComponent;
