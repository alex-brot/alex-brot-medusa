import { AdminPostProductsReq, Region } from "@medusajs/medusa"

type SampleProductsOptions = {
  regions: Region[]
  collection_id?: string
}

// can't use the ProductStatus imported
// from the core within admin cusotmizations
enum ProductStatus {
  PUBLISHED = "published"
}

export default function getSampleProducts ({
  regions,
  collection_id
}: SampleProductsOptions): AdminPostProductsReq[] {
  return [
    {
      title: "Nussbrötchen",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: [
        "http://localhost:9000/uploads/1731245227286-IMG-20190624-WA0004.jpg",
      ],
      options: [],
      variants: [],
    },
    {
      title: "Baguette",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731245124599-_DSC4692.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Haferbrot",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731244972376-_DSC3482.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Käsebrötchen",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: [
        "http://localhost:9000/uploads/1731245200240-IMG-20190604-WA0000.jpg",
      ],
      options: [],
      variants: [],
    },
    {
      title: "Nussbrot",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731245034341-_DSC3883.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Roggenbrötchen",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731245034341-_DSC3883.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Schwarzbrot",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731244941595-_DSC3225.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Schwarzbrot Brötchen",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731245157906-DSCF4518.jpg"],
      options: [],
      variants: [],
    },
    {
      title: "Vollkornbrot",
      status: ProductStatus.PUBLISHED,
      collection_id,
      discountable: true,
      subtitle: null,
      description: "",
      is_giftcard: false,
      weight: 400,
      images: ["http://localhost:9000/uploads/1731245080205-_DSC3929.jpg"],
      options: [],
      variants: [],
    },
  ];
}