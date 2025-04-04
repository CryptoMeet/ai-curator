export interface Tag {
  id: string;
  name: string;
}

export interface Metadata {
  author: string | null;
  publishedAt: string | null;
  siteName: string | null;
  image: string | null;
}

export interface Item {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: 'ARTICLE' | 'VIDEO' | 'IMAGE' | 'OTHER';
  metadata: Metadata | null;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CollectionWithItems = Collection & {
  items: Item[];
};