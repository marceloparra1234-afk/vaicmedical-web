export type CatalogDocument = {
  name: string;
  url: string | null;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  featured?: boolean;
  type: string;
  description: string;
  longDescription: string;
  brand: string;
  model: string;
  internalCode: string;
  tags: string;
  image: string;
  gallery: string[];
  documents: {
    technicalSheet: CatalogDocument | null;
    manual: CatalogDocument | null;
    certificates: CatalogDocument | null;
    brochure: CatalogDocument | null;
  };
  additionalDocuments?: CatalogDocument[];
};

export type CatalogLine = {
  id: string;
  name: string;
  description: string;
  summary: string;
  products: CatalogProduct[];
  sublines?: string[];
  featured?: boolean;
  image?: string;
};
