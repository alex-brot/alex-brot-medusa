import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ScrollText } from "@medusajs/icons";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import {Heading, Table} from "@medusajs/ui";
import { Customer, EntryTimestamp } from "../../../../.medusa/types/query-entry-points";

type EntryTimestampsResponse = EntryTimestamp[];

const EntryPage: React.FC = () => {
    const { data } = useQuery<EntryTimestampsResponse>({
        queryFn: () => sdk.client.fetch(`/admin/pos-auth/entry-timestamps`),
        queryKey: [["entryTimestamps"]],
    });
    console.log("Got data", data)

    return (
        <div>
            <Heading>Access Log</Heading>

            <Table className="mt-8">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Method</Table.HeaderCell>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data ? (
                        data.map((entry) => (
                            <EntryTableRow
                                entry={entry as EntryTimestamp}
                                key={entry.id}
                            ></EntryTableRow>
                        ))
                    ) : (
                        <></>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};


export const EntryTableRow = ({ entry }: { entry: EntryTimestamp }) => {
    const customer = entry.posAuth.customer as Customer
    const timestamp = new Date(entry.timestamp)
    return (
        <Table.Row>
            <Table.Cell>{timestamp.toDateString()} {timestamp.toTimeString()}</Table.Cell>
            <Table.Cell className="w-1 h-1">{entry.typeOfEntry}</Table.Cell>
            <Table.Cell>{customer.first_name} {customer.last_name}</Table.Cell>
        </Table.Row>
    );
};

export const config = defineRouteConfig({
    label: "Entry",
    icon: ScrollText,
});

export default EntryPage;
