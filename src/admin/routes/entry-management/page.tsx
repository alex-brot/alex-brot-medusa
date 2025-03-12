import {defineRouteConfig} from "@medusajs/admin-sdk";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {sdk} from "../../lib/sdk";
import {Heading, Input, Table} from "@medusajs/ui";
import {Customer, PosAuth} from "../../../../.medusa/types/query-entry-points";
import {UserGroup} from "@medusajs/icons";

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


async function updateCode(id: string, newCode: string) {
    if (newCode.length !== 4) {
        return
    }

    await sdk.client.fetch(`/admin/pos-auth/change-code`, {
        method: "POST",
        body: {
            id,
            newCode,
        },
    })
}
export const PosAuthTableRow = ({ element }: { element: PosAuth }) => {
    const customer = element.customer as Customer | null
    let [code, setCode] = useState(element.code)

    const [error, setError] = useState<string | null>(null)

    const validateErrorMessages = () => {
        if (code.length !== 4) {
            setError("Code must be 4 digits long")
        } else {
            setError(null)
        }
    }

    return (
        <Table.Row>
            {
                customer ?
                    <Table.Cell>{customer.first_name} {customer.last_name}</Table.Cell>
                    : <Table.Cell>Customer not found</Table.Cell>
            }
            <Table.Cell>
                <Input type="number"
                       min={0}
                       max={9999}
                       onChange={async e => {
                           const newCode = e.target.value;
                           setCode(newCode);
                       }}
                       onBlur={e => {
                           validateErrorMessages()
                           updateCode(element.id, e.target.value)
                       }}
                       placeholder="entry code"
                       value={code}/>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Table.Cell>
            <Table.Cell>{element.nfcCode ?? "-"}</Table.Cell>
        </Table.Row>
    );
};

export const config = defineRouteConfig({
    label: "Entry Management",
    icon: UserGroup,
});

export default EntryLogPage;
