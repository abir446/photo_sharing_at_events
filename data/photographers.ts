export type StyleTag =
'Cinematic' |
'Candid' |
'Wedding' |
'Drone' |
'Editorial';

export type Photographer = {
  id: string;
  name: string;
  initials: string;
  accent: string;
  location: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  styles: StyleTag[];
  portfolio: string[];
  verified: boolean;
  responseTime: string;
};

const IMAGES = {
  wedding: "/02a74ae1-6fed-4ab4-8276-b8f3511a4829.jpg",

  cinematic: "/3f1afd8d-d279-45e5-b67d-a3b67b58393c.jpg",

  drone: "/46509ce7-0ff0-4655-8ae1-90dbda10e78b.jpg",

  candid: "/a19a50ad-ed90-4c71-872c-5dde7db1256e.jpg",

  editorial: "/dc224eb7-258b-4e68-8e98-e638fbff0ea4.jpg",

  detail: "/ad800406-eaf5-44a6-851e-e7c28e1ac51b.jpg",

  corporate: "/7d1ee6d5-d014-43fb-b7ca-239bd9f573bd.jpg",

  engagement: "/c5209e6a-fdf0-4bc6-a7e5-c6793faf6c9e.jpg"

};

export const HERO_IMAGES = {
  marketplace: "/33c39f57-d46e-4f25-addf-129ca2506ae8.jpg",

  qrStand: "/ca35071e-ec2d-4a7b-bd13-f26939f90801.jpg"

};

export const STYLE_TAGS: StyleTag[] = [
'Cinematic',
'Candid',
'Wedding',
'Drone',
'Editorial'];


export const LOCATIONS = [
'Austin, TX',
'Brooklyn, NY',
'Chicago, IL',
'Denver, CO',
'Los Angeles, CA',
'Seattle, WA'];


export const photographers: Photographer[] = [
{
  id: 'mara-oswin',
  name: 'Mara Oswin',
  initials: 'MO',
  accent: '#6366F1',
  location: 'Austin, TX',
  rating: 4.9,
  reviews: 120,
  startingPrice: 800,
  styles: ['Cinematic', 'Wedding'],
  portfolio: [IMAGES.cinematic, IMAGES.wedding, IMAGES.detail],
  verified: true,
  responseTime: 'Replies in ~2h'
},
{
  id: 'devon-hale',
  name: 'Devon Hale',
  initials: 'DH',
  accent: '#0EA5E9',
  location: 'Brooklyn, NY',
  rating: 4.8,
  reviews: 94,
  startingPrice: 1200,
  styles: ['Editorial', 'Candid'],
  portfolio: [IMAGES.editorial, IMAGES.candid, IMAGES.corporate],
  verified: true,
  responseTime: 'Replies in ~1h'
},
{
  id: 'juno-park',
  name: 'Juno Park',
  initials: 'JP',
  accent: '#F59E0B',
  location: 'Los Angeles, CA',
  rating: 5.0,
  reviews: 63,
  startingPrice: 2400,
  styles: ['Drone', 'Cinematic'],
  portfolio: [IMAGES.drone, IMAGES.engagement, IMAGES.cinematic],
  verified: true,
  responseTime: 'Replies in ~4h'
},
{
  id: 'ana-ferreira',
  name: 'Ana Ferreira',
  initials: 'AF',
  accent: '#EC4899',
  location: 'Chicago, IL',
  rating: 4.7,
  reviews: 208,
  startingPrice: 650,
  styles: ['Candid', 'Wedding'],
  portfolio: [IMAGES.candid, IMAGES.wedding, IMAGES.engagement],
  verified: false,
  responseTime: 'Replies in ~6h'
},
{
  id: 'theo-rand',
  name: 'Theo Rand',
  initials: 'TR',
  accent: '#22C55E',
  location: 'Denver, CO',
  rating: 4.9,
  reviews: 147,
  startingPrice: 1750,
  styles: ['Drone', 'Editorial'],
  portfolio: [IMAGES.drone, IMAGES.corporate, IMAGES.editorial],
  verified: true,
  responseTime: 'Replies in ~3h'
},
{
  id: 'nia-collins',
  name: 'Nia Collins',
  initials: 'NC',
  accent: '#A855F7',
  location: 'Seattle, WA',
  rating: 4.8,
  reviews: 76,
  startingPrice: 3200,
  styles: ['Cinematic', 'Editorial', 'Wedding'],
  portfolio: [IMAGES.engagement, IMAGES.cinematic, IMAGES.detail],
  verified: true,
  responseTime: 'Replies in ~2h'
}];