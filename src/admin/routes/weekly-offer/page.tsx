import {defineRouteConfig} from "@medusajs/admin-sdk";
import {AdminProduct} from "@medusajs/framework/types";
import {CalendarSolid} from "@medusajs/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {sdk} from "../../lib/sdk";
import {Button, DatePicker, DateRange, Input,} from "@medusajs/ui";
import WeeklyOfferComponent, {WeeklyOfferComponentType,} from "../../components/weekly-offer/WeeklyOfferComponent";
import {ProductTable} from "../../components/weekly-offer/ProductTable.tsx";

type AdminProductsResponse = {
  products: AdminProduct[];
};

type WeeklyOffersResponse = WeeklyOfferComponentType[];

function getWeekNumber(date: Date): number {
  // Copying date so the original date won't be modified
  const tempDate = new Date(date.valueOf());

  // ISO week date weeks start on Monday, so correct the day number
  const dayNum = (date.getDay() + 6) % 7;

  // Set the target to the nearest Thursday (current date + 4 - current day number)
  tempDate.setDate(tempDate.getDate() - dayNum + 3);

  // ISO 8601 week number of the year for this date
  const firstThursday = tempDate.valueOf();

  // Set the target to the first day of the year
  // First set the target to January 1st
  tempDate.setMonth(0, 1);

  // If this is not a Thursday, set the target to the next Thursday
  if (tempDate.getDay() !== 4) {
    tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
  }

  // The weeknumber is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week
  return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
}

const WeeklyOfferPage: React.FC = () => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [weeklyOffers, setWeeklyOffers] = useState<WeeklyOffersResponse>()

  useEffect(() => {
    const currentDate = new Date();
    const currentDatePlusFiveDaysRange = () => {
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

    setTitle(`kw ${getWeekNumber(currentDate)}`);

    setDateRange(currentDatePlusFiveDaysRange());
  }, []);

  const queryClient = useQueryClient();

  type WeeklyOfferMutationType = {
    title: string;
    from: Date;
    to: Date;
    selectedProductIds: string[];
  };

  const {data} = useQuery<AdminProductsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/products`),
    queryKey: [["products"]],
  });

  const {data: weeklyOffersResponse} = useQuery<WeeklyOffersResponse>({
    queryFn: () => sdk.client.fetch("/admin/weekly-offers"),
    queryKey: ["offers"],
  });
  const mutation = useMutation({
    mutationFn: (data: WeeklyOfferMutationType) =>
        sdk.client.fetch(`/admin/weekly-offers`, {
          method: "POST",
          body: data,
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["offers"]});
    },
  });

  useEffect(() => {
    setWeeklyOffers(weeklyOffersResponse);
  }, [weeklyOffersResponse]);

  const handleSubmit = async () => {
    //TODO: implement submit
    console.log(selectedProductIds);
    console.log(dateRange);
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
    setTitle(`kw ${getWeekNumber(newDateRange.from ? newDateRange.from : new Date())}`);
    setDateRange(newDateRange);
  };

  return (
      <div>
        <h1>Weekly Offer</h1>

        <div>
          <p>Search</p>

        </div>
        {data ? (
            <ProductTable data={data.products.map(product => {
              const tableProduct: TableProduct = {
                id: product.id,
                title: product.title,
                thumbnail: product.thumbnail || ""
              }
              return tableProduct
            })}
            setSelectedProductIds={setSelectedProductIds}
            ></ProductTable>
        ):<p>Loading Products...</p>
        }
        <div className="mt-12 bg-gray-100 dark:bg-zinc-800 p-2 rounded-md w-[250px]">
          <p className="text-xs text-gray-900 dark:text-gray-300 mb-2">Title</p>
          <Input aria-label={"Title"} disabled={false} onChange={(e) => setTitle(e.target.value)} value={title}
                 className="text-xl"/>
        </div>
        <div className="flex w-full flex-col justify-start mt-3 items-start">
          <div className="w-[250px]">
            <h3>From</h3>
            <DatePicker
                aria-label="from"
                value={dateRange?.from}
                onChange={(date) => {
                  handleDateChange(date, true);
                }}
            />
            <h3 className="mt-4">To</h3>
            <DatePicker
                aria-label="to"
                value={dateRange?.to}
                onChange={(date) => {
                  handleDateChange(date, false);
                }}
            />
          </div>
          <div className="w-[250px] mt-4">
            <Button className="w-full" size="large" onClick={handleSubmit} disabled={selectedProductIds.length <= 0}>
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
        <h1 className="text-xl mt-8">Weekly Offers</h1>
        <div className="flex flex-wrap">
          {weeklyOffers?.map((weeklyOffer) => (
              <WeeklyOfferComponent
                  weeklyOffer={weeklyOffer}
              ></WeeklyOfferComponent>
          ))}
        </div>
      </div>
  );
};

export const config = defineRouteConfig({
  label: "Weekly Offer",
  icon: CalendarSolid,
});

export default WeeklyOfferPage;
