export enum Status {
  draft = 'draft',
  published = 'published',
}

export type TBlog = {
  title: string;
  slug: string;
  cardDescription?: string;
  content: string;
  image: string;
  images?: string[];
  tags?: string[];
  status: Status;
};
