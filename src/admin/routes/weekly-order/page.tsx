import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AdminProduct } from "@medusajs/framework/types";
import { ShoppingCartSolid } from "@medusajs/icons";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { Container, Heading, } from "@medusajs/ui";
import { ProductTable, TableProduct } from "../../components/weekly-offer/ProductTable.tsx";

type WeeklyOrdersResponse = {
    quantity: number,
    item: AdminProduct
}[];

type GroupedOrders = (AdminProduct & {
    totalQuantity: number;
})[]

function groupOrdersByItemId(orders: WeeklyOrdersResponse): GroupedOrders {
    const grouped = new Map();

    orders.forEach(({ quantity, item }) => {
        if (grouped.has(item.id)) {
            grouped.get(item.id)!.totalQuantity += quantity;
        } else {
            grouped.set(item.id, { ...item, totalQuantity: quantity });
        }
    });

    return Array.from(grouped.values());
}

const WeeklyOrdersPage: React.FC = () => {
    const { data } = useQuery<WeeklyOrdersResponse>({
        queryFn: () => sdk.client.fetch(`/admin/orders/this-week`),
        queryKey: [["products"]],
    });

    if (!data) return null;

    const products = groupOrdersByItemId(data);

    return (
        <div>
            <Heading className="text-2xl mt-8 mb-6">Orders this week</Heading>
            <div className="flex flex-col-reverse sm:flex-row">
                {data ? (
                    <Container className="flex-1">
                        <ProductTable data={products.map(product => {
                            const tableProduct: TableProduct = {
                                id: product.id,
                                title: product.title,
                                thumbnail: product.thumbnail || "",
                                quantity: product.totalQuantity,
                            };
                            return tableProduct;
                        })}
                        columns={{quantity: true}}
                        ></ProductTable>
                    </Container>
                ) : <p>Loading Products...</p>}
            </div>
        </div>
    );
};

export const config = defineRouteConfig({
    label: "Weekly Orders",
    icon: ShoppingCartSolid,
});

export default WeeklyOrdersPage;
