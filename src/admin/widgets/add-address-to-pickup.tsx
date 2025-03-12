import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Table } from "@medusajs/ui";
import PickUpTableCell from "../components/pickup/PickUpTableCell";
import { useEffect, useState } from "react";
import { ShippingOption } from "../../../.medusa/types/query-entry-points";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

// The widget
const PickUpWidget = () => {

    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]); 

    const { data: shippingOptionsResponse } = useQuery<{ shipping_options: ShippingOption[] }>({
      queryKey: ["shipping-options"],
      queryFn: () => sdk.client.fetch("/admin/shipping-options"),
    });

    useEffect(() => {
        if (shippingOptionsResponse) {
            console.log(shippingOptionsResponse.shipping_options);
            
            setShippingOptions(shippingOptionsResponse.shipping_options);
        }
    }
    , [shippingOptionsResponse]);

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col justify-between px-6 py-4">
        <Heading className="mb-2" level="h2">Product Widget</Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Pick-Up Station</Table.HeaderCell>
              <Table.HeaderCell>Street</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>Zip</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {shippingOptions.map((shippingOption) => (
                <PickUpTableCell shippingOption={shippingOption} />
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "location.details.after",
});

export default PickUpWidget;
