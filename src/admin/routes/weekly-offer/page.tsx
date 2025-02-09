import {defineRouteConfig} from "@medusajs/admin-sdk";
import {AdminProduct} from "@medusajs/framework/types";
import {CalendarSolid} from "@medusajs/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {sdk} from "../../lib/sdk";
import {Button, Container, DatePicker, DateRange, Heading, Input,} from "@medusajs/ui";
import WeeklyOfferComponent, {WeeklyOfferComponentType,} from "../../components/weekly-offer/WeeklyOfferComponent";
import {ProductTable, TableProduct} from "../../components/weekly-offer/ProductTable.tsx";
import { Toaster, toast } from "@medusajs/ui"

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
            toast.error("Invalid Date", {
                description: "Date is empty",
            })
            return;
        }

        if (dateRange.from > dateRange.to) {
            toast.error("Invalid Date", {
                description: "From can't be after To",
            })
            return;
        }

        if (weeklyOffers?.some(offer =>
            dateRange.from <= Date.parse(offer.to) && dateRange.to >= Date.parse(offer.from)
        )) {
            toast.error("Invalid Dates", {
                description: "The Date range overlaps with one of your weekly offers",
            })
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
            <Heading className="text-2xl mt-8 mb-6">New Weekly Offer</Heading>
            <div className="flex flex-col-reverse sm:flex-row">
                <div className="mr-4 flex flex-col justify-between w-full mt-6 sm:mt-0 sm:w-[250px]">
                    <div>
                        <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-md w-full sm:w-[250px]">
                            <p className="text-xs text-gray-900 dark:text-gray-300 mb-2">Title</p>
                            <Input aria-label={"Title"} disabled={false} onChange={(e) => setTitle(e.target.value)}
                                   value={title} className="text-xl"/>
                        </div>
                        <div className="flex w-full flex-col justify-start mt-3 items-start">
                            <div className="w-full sm:w-[250px]">
                                <h3>From</h3>
                                <DatePicker
                                    aria-label="from"
                                    value={dateRange?.from}
                                    onChange={(date) => {
                                        handleDateChange(date, true);
                                    }}
                                />
                                <div>
                                    <h3 className="mt-4">To</h3>
                                    <DatePicker
                                        aria-label="to"
                                        value={dateRange?.to}
                                        onChange={(date) => {
                                            handleDateChange(date, false);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-[250px] mt-4">
                        <Button className="w-full" size="large" onClick={handleSubmit}
                                disabled={selectedProductIds.length <= 0}>
                            Create Offer
                        </Button>
                    </div>
                </div>
                {data ? (
                    <Container className="flex-1">
                        <ProductTable data={data.products.map(product => {
                            const tableProduct: TableProduct = {
                                id: product.id,
                                title: product.title,
                                thumbnail: product.thumbnail || ""
                            };
                            return tableProduct;
                        })}
                                      setSelectedProductIds={setSelectedProductIds}
                        ></ProductTable>
                    </Container>
                ) : <p>Loading Products...</p>}
            </div>
            <Heading className="text-2xl mt-8">Weekly Offers</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {weeklyOffers?.sort((a, b) => new Date(b.to).getTime() - new Date(a.to).getTime()).map((weeklyOffer) => (                    <WeeklyOfferComponent
                        key={weeklyOffer.id}
                        weeklyOffer={weeklyOffer}
                        className="w-full"
                    ></WeeklyOfferComponent>
                ))}
            </div>
            <Toaster />
        </div>
    );
};

export const config = defineRouteConfig({
    label: "Weekly Offer",
    icon: CalendarSolid,
});

export default WeeklyOfferPage;
