import { useEffect, useState } from "react";
import { Container, Button, usePrompt } from "@medusajs/ui";
import { AdminProduct } from "@medusajs/framework/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { ProductTable, TableProduct } from "./ProductTable.tsx";
import { XMark } from "@medusajs/icons";

export type WeeklyOfferComponentType = {
  id: string;
  title: string;
  start: string;
  end: string;
  products: [{ id: string }];
};

export type EndNowAndDeleteType = {
  weeklyOfferId: string;
};

const WeeklyOfferComponent = ({
  weeklyOffer,
}: {
  weeklyOffer: WeeklyOfferComponentType;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActiveOffer, setIsActiveOffer] = useState(false);

  useEffect(() => {
    setIsActiveOffer(
      Date.parse(weeklyOffer.start) <= Date.now() &&
        Date.now() <= Date.parse(weeklyOffer.end)
    );
  }, [weeklyOffer.start, weeklyOffer.end]);

  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => {
      const newExpanded = !prevIsExpanded;
      setDisplayedProducts(
        newExpanded ? weeklyOffer.products : weeklyOffer.products.slice(0, 3)
      );
      return newExpanded;
    });
  };

  const [displayedProducts, setDisplayedProducts] = useState(
    weeklyOffer.products.slice(0, 3)
  );

  const queryClient = useQueryClient();

  const endNowMutation = useMutation({
    mutationFn: (data: EndNowAndDeleteType) =>
      sdk.client.fetch(`/admin/weekly-offers`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: EndNowAndDeleteType) =>
      sdk.client.fetch(`/admin/weekly-offers`, {
        method: "DELETE",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const handleEndNow = async (weeklyOfferId: string) => {
    endNowMutation.mutate({ weeklyOfferId: weeklyOfferId });
    window.location.reload();
  };

  const handleDelete = async (weeklyOfferId: string) => {
    deleteMutation.mutate({ weeklyOfferId: weeklyOfferId });
    window.location.reload();
  };

  const deleteConfirmation = usePrompt();
  const deleteConfirmationDialog = async () => {
    const confirmed = await deleteConfirmation({
      title: "Are you sure?",
      description: "Please confirm that you want to delete this Offer",
    });
    if (confirmed) {
      await handleDelete(weeklyOffer.id);
    }
  };

  const endConfirmation = usePrompt();
  const endConfirmationDialog = async () => {
    const confirmed = await endConfirmation({
      title: "Are you sure?",
      description: "Please confirm that you want to end this Offer now?",
    });
    if (confirmed) {
      await handleEndNow(weeklyOffer.id);
    }
  };

  return (
    <Container
      className={`w-auto h-auto m-3 relative flex flex-col ${
        isActiveOffer ? "border-green-500 border" : ""
      }`}
    >
      <h1 className="text-xl">{weeklyOffer.title}</h1>
      <div className="flex text-xs">
        <p>
          {new Date(weeklyOffer.start).toDateString()} -{" "}
          {new Date(weeklyOffer.end).toDateString()}
        </p>
      </div>
      <p className="text-xs">products: {weeklyOffer.products.length}</p>

      <ProductTable
        key={displayedProducts.length}
        data={displayedProducts.map((product) => {
          const adminProduct = product as AdminProduct;
          const tableProduct: TableProduct = {
            id: adminProduct.id,
            title: adminProduct.title,
            thumbnail: adminProduct.thumbnail || "",
          };
          return tableProduct;
        })}
      />
      <div className="flex flex-wrap items-center mt-4">
        {isActiveOffer && (
          <Button
            variant="danger"
            className={`mt-4 ${
              weeklyOffer.products.length > 3 ? "mr-auto" : "mx-auto"
            }`}
            onClick={() => endConfirmationDialog()}
          >
            End Now
          </Button>
        )}
        {weeklyOffer.products.length > 3 && (
          <Button
            onClick={toggleExpand}
            className={`mt-4 ${isActiveOffer ? "ml-auto" : "mx-auto"}`}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>
      <Button
        className="absolute top-3 right-3 pl-2 pr-2"
        onClick={() => deleteConfirmationDialog()}
      >
        <XMark></XMark>
      </Button>
    </Container>
  );
};

export default WeeklyOfferComponent;
