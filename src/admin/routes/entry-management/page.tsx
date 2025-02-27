import { defineRouteConfig } from "@medusajs/admin-sdk";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { Heading, Table } from "@medusajs/ui";
import { Customer, PosAuth } from "../../../../.medusa/types/query-entry-points";
import { UserGroup } from "@medusajs/icons";

type EntryManagementResponse = PosAuth[];

const EntryLogPage: React.FC = () => {
    const { data } = useQuery<EntryManagementResponse>({
        queryFn: () => sdk.client.fetch(`/admin/pos-auth`),
        queryKey: [["entryCodes"]],
    });
    console.log("Got data", data)

    return (
        <div>
            <Heading>Entry Management</Heading>

            <Table className="mt-8">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Code</Table.HeaderCell>
                        <Table.HeaderCell>NFC</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data ? (
                        data.map((element) => (
                            <PosAuthTableRow
                                element={element}
                                key={element.id}
                            ></PosAuthTableRow>
                        ))
                    ) : (
                        <></>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};


export const PosAuthTableRow = ({ element }: { element: PosAuth }) => {
    const customer = element.customer as Customer | null
    return (
        <Table.Row>
            {
                customer ?
                    <Table.Cell>{customer.first_name} {customer.last_name}</Table.Cell>
                    : <Table.Cell>Customer not found</Table.Cell>
            }
            <Table.Cell>{element.code}</Table.Cell>
            <Table.Cell>{element.nfcCode ?? "-"}</Table.Cell>
        </Table.Row>
    );
};

export const config = defineRouteConfig({
    label: "Entry Management",
    icon: UserGroup,
});

export default EntryLogPage;
