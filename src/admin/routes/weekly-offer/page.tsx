import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AdminProduct } from "@medusajs/framework/types";
import { CalendarSolid } from "@medusajs/icons";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { Checkbox, DatePicker, DateRange, Table } from "@medusajs/ui";
import { Button } from "@medusajs/ui";

type AdminProductsResponse = {
  products: AdminProduct[];
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import WeeklyOfferComponent, { WeeklyOfferComponentType } from "../../components/weekly-offer/weeklyOfferComponent";

const WeeklyOfferPage: React.FC = () => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const currentDatePlusFiveDaysRange = () => {
      const currentDate = new Date();
      const fiveDaysFromNow = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 5
      );
      return {
        from: currentDate,
        to: fiveDaysFromNow,
      };
    };

    setDateRange(currentDatePlusFiveDaysRange());
  }, []);

  const toggleSelected = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((p) => p !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const queryClient = useQueryClient();

  type WeeklyOfferMutationType = {
    title: string;
    from: Date;
    to: Date;
    selectedProductIds: string[];
  };

  const mutation = useMutation({
    mutationFn: (data: WeeklyOfferMutationType) =>
      sdk.client.fetch(`/admin/weekly-offers`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-offers"] });
    },
  });

  const { data } = useQuery<AdminProductsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/products`),
    queryKey: [["products"]],
  });

  /*const { data: weeklyOffers } = useQuery({
    queryFn: () => sdk.client.fetch('admin/weekly-offers'),
    queryKey: [["weekly-offer, count"]]
  })*/

  const weeklyOffers: WeeklyOfferComponentType[] = [
      {
        title: "kw4",
        from: new Date("2025-01-15 09:15:24.58+00"),
        to: new Date("2025-01-19 23:00:00+00"),
        count: 3,
      },
      {
        title: "kw5",
        from: new Date("2025-01-20 09:15:24.58+00"),
        to: new Date("2025-01-25 23:00:00+00"),
        count: 4,
      },
      {
        title: "kw6",
        from: new Date("2025-01-25 09:15:24.58+00"),
        to: new Date("2025-01-30 23:00:00+00"),
        count: 5,
      },
    ];

  const handleSubmit = async () => {
    //TODO: implement submit
    console.log(selectedProductIds);
    console.log(dateRange);
    const title = "kw 4";
    if (!dateRange?.from || !dateRange!.to) {
      console.log("is Invalid");

      return;
    }
    const data = {
      title: title,
      from: dateRange?.from,
      to: dateRange?.to,
      selectedProductIds: selectedProductIds,
    };
    console.log(JSON.stringify(data));

    const response = mutation.mutate(data);
    console.log(response);
  };

  const handleDateChange = (date: Date | null, isFrom: Boolean) => {
    let newDateRange: DateRange = {
      from: dateRange?.from,
      to: dateRange?.to,
    };
    if (isFrom) {
      newDateRange.from = date ? date : undefined;
    } else {
      newDateRange.to = date ? date : undefined;
    }
  };

  return (
    <div>
      <h1>Weekly Offer</h1>
      <p>Welcome to the weekly offer page!</p>

      <Table className="mt-8">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Thumnail</Table.HeaderCell>
            <Table.HeaderCell>Select</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data ? (
            data.products.map((product) => (
              <ProductTableRow
                product={product as AdminProduct}
                toggelSelected={toggleSelected}
                key={product.id}
              ></ProductTableRow>
            ))
          ) : (
            <></>
          )}
        </Table.Body>
      </Table>
      <div className="flex w-full flex-col justify-start mt-8 items-start">
        <div className="w-[250px]">
          <h3>From</h3>
          <DatePicker
            aria-label="from"
            value={dateRange?.from}
            onChange={(date) => {
              handleDateChange(date, true);
            }}
          />
          <h3>To</h3>
          <DatePicker
            aria-label="to"
            value={dateRange?.to}
            onChange={(date) => {
              handleDateChange(date, false);
            }}
          />
        </div>
        <div className="w-[250px] mt-4">
          <Button className="w-full" size="large" onClick={handleSubmit}>
            {/* {createIsLoading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )} */}
            Create Offer
          </Button>
        </div>
      </div>
      <h1>Weekly Offers</h1>
      <div className="flex ">
        {weeklyOffers.map((weeklyOffer) => (
          <WeeklyOfferComponent
            weeklyOffer={weeklyOffer}
          ></WeeklyOfferComponent>
        ))}
      </div>
    </div>
  );
};

type ProductTableRowProb = {
  product: AdminProduct;
  toggelSelected: (id: string) => void;
};

const ProductTableRow = ({ product, toggelSelected }: ProductTableRowProb) => {
  const [isSelected, setIsSelected] = useState(false);
  const handleSelected = () => {
    const switchedState = !isSelected;
    setIsSelected(switchedState);

    toggelSelected(product.id);
  };

  return (
    <Table.Row>
      <Table.Cell>{product.title}</Table.Cell>
      {product.thumbnail ? (
        <Table.Cell className="w-1 h-1">
          <img className="w-8" src={product.thumbnail} />
        </Table.Cell>
      ) : (
        <Table.Cell> None</Table.Cell>
      )}

      <Table.Cell>
        <Checkbox
          checked={isSelected}
          id="product-weekly-offer"
          onClick={() => handleSelected()}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export const config = defineRouteConfig({
  label: "Weekly Offer",
  icon: CalendarSolid,
});

export default WeeklyOfferPage;
