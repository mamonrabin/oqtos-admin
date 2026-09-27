export type TLandingpage =
  | 'Categories'
  | 'Best Selling'
  | 'Flash Sale'
  | 'Featured Products'
  | 'New Arrivals'
  | 'Top Rated'
  | 'Trending'
  | 'About'
  | 'Brands'
  | 'Testimonials'
  | 'Blog'
  | 'Newsletter';

export type TOrder =
  | 'first'
  | 'second'
  | 'third'
  | 'fourth'
  | 'fifth'
  | 'sixth'
  | 'seventh'
  | 'eighth'
  | 'ninth'
  | 'tenth'
  | 'eleventh'
  | 'twelfth';

export enum Status {
  Active = 'Active',
  InActive = 'InActive',
}

export type THome = {
  title?: string;
  subTitle?: string;
  status: Status;
  order: TOrder;
  landing: TLandingpage;
};
