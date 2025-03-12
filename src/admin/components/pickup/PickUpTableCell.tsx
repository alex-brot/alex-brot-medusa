import { Button, Input, Table } from "@medusajs/ui";
import React, { Component, useState } from "react";
import { ShippingOption } from "../../../../.medusa/types/query-entry-points";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { UpdateShippingOptionDTO } from "@medusajs/framework/types";
import { log } from "console";

type PickUpTableCellProps = {
    shippingOption: ShippingOption
}

const PickUpTableCell = ({shippingOption} : PickUpTableCellProps) => {
  const [street, setStreet] = useState<string>(shippingOption?.data?.address?.street ? shippingOption?.data?.address?.street : "");
  const [city, setCity] = useState<string>(shippingOption?.data?.address?.city ? shippingOption?.data?.address?.city : "");
  const [zip, setZip] = useState<string>(shippingOption?.data?.address?.zip ? shippingOption?.data?.address?.zip : "");
  const [country, setCountry] = useState<string>(shippingOption?.data?.address?.country ? shippingOption?.data?.address?.country : "");
  const [editId, setEditId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateShippingOptionDTO) =>
      sdk.client.fetch(`/admin/shipping-options/`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      console.log("success");
      
      queryClient.invalidateQueries({ queryKey: ["shipping-options"] });
    },
    onError: (error) => {
      console.error("error", error);
    }
  });

  const handleButtonClick = async () => {
    if (editId) {
      // Save

      const data = {
          address: {
            street: street,
            city: city,
            zip: zip,
            country: country,
          },
      };



    const updatedShippingOption: UpdateShippingOptionDTO = {
      id: shippingOption.id,
      data: data,
    };

    const body = {
      id: shippingOption.id,
      updatedShippingOption: updatedShippingOption,
    }



      mutation.mutate(body);
    
      
      setEditId(null);
    } else {
      // Edit
      setEditId(shippingOption.id);
    }
  };

  return (
    <Table.Row>
      <Table.Cell>{shippingOption.name}</Table.Cell>
      <Table.Cell>
        {editId ? (
          <Input
            placeholder={street}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        ) : (
          <span>{street ? street : "no street provided"}</span>
        )}
      </Table.Cell>
      <Table.Cell>
        {editId ? (
          <Input
            placeholder={city}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        ) : (
          <span>{city ? city : "no city provided"}</span>
        )}
      </Table.Cell>
      <Table.Cell>
        {editId ? (
          <Input
            placeholder={zip}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        ) : (
          <span>{zip ? zip : "no zip provided"}</span>
        )}
      </Table.Cell>
      <Table.Cell>
        {editId ? (
          <Input
            placeholder={country}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        ) : (
          <span>{country ? country : "no country provided"}</span>
        )}
      </Table.Cell>
      <Table.Cell>
        <Button onClick={handleButtonClick} className="w-full h-8" size="large">
          {editId ? "Save" : "Edit"}
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default PickUpTableCell;
