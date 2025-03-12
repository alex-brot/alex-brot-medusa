import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ScrollText } from "@medusajs/icons";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import {Button, Heading, StatusBadge, Table} from "@medusajs/ui";
import { Customer } from "../../../../.medusa/types/query-entry-points";


const CustomerManagementPage: React.FC = () => {
    const [customers, setCustomers] = React.useState<Customer[]>([]);

    const queryClient = useQueryClient();
    const { data } = useQuery<{data: Customer[]}>({
      queryFn: () => sdk.client.fetch(`/admin/customer-management`),
      queryKey: ["customer-management"],
    })

    const customerMutation = useMutation({
        mutationFn: (data: {customer_Id: string}) =>
            sdk.client.fetch(`/admin/customer-management`, {
                method: "PATCH",
                body: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["customer-management"]});
        },
    });

    const handleVerify = (customerId: string) => {
        customerMutation.mutate({customer_Id: customerId});
    }

    useEffect(() => {
        if (data) {
            setCustomers(data.data);
            console.log(data.data);
            
        }
        
    }
    , [data]);

    return (
      <div>
        <Heading>Customer Management</Heading>

        <Table className="mt-8">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>created_at</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>E-Mail</Table.HeaderCell>
              {/* <Table.HeaderCell>address</Table.HeaderCell> */}
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Verify</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {customers &&
              customers.map((customer) => (
                <Table.Row key={customer.id}>
                  <Table.Cell>
                    {customer.created_at.toLocaleString()}
                  </Table.Cell>
                    <Table.Cell>
                        {customer.first_name} {customer.last_name}
                    </Table.Cell>
                  <Table.Cell>{customer.email}</Table.Cell>
                  {/* <Table.Cell>
                    {customer.addresses && customer.addresses.length > 0
                      ? `${customer.addresses[0]?.address_1} ${customer.addresses[0]?.city} ${customer.addresses[0]?.postal_code}, `
                      : "No address"}
                  </Table.Cell> */}
                  <Table.Cell>
                    <StatusBadge
                      color={customer.metadata?.isVerified ? "green" : "red"}
                    >
                      {customer.metadata?.isVerified
                        ? "Verified"
                        : "Not verified"}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        handleVerify(customer.id);
                      }}
                    >
                      Verify
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    );
};

export const config = defineRouteConfig({
    label: "Customer Management",
    icon: ScrollText,
});

export default CustomerManagementPage;
