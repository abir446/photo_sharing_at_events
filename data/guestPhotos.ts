export type ModerationState = 'approved' | 'pending' | 'hidden' | 'flagged';

export type GuestPhoto = {
  id: string;
  src: string;
  aspect: 'portrait' | 'landscape' | 'square';
  guest: string;
  initials: string;
  caption: string;
  minutesAgo: number;
  state: ModerationState;
};

const IMG = {
  toast: "/3ac1ba3f-f926-4c15-b821-4c1697ebf326.jpg",

  dance: "/fe4bb6da-85ba-45ec-9a31-09e4d363235a.jpg",

  selfie: "/6507d9fa-5757-41a9-b152-7b331a693f80.jpg",

  cake: "/c95b8965-0abd-453f-b1e5-8397b246b854.jpg",

  confetti: "/bf7e04ff-095a-4bc3-bdff-3b57ed0991d9.jpg",

  candid: "/a19a50ad-ed90-4c71-872c-5dde7db1256e.jpg",

  detail: "/ad800406-eaf5-44a6-851e-e7c28e1ac51b.jpg",

  wedding: "/02a74ae1-6fed-4ab4-8276-b8f3511a4829.jpg",

  engagement: "/c5209e6a-fdf0-4bc6-a7e5-c6793faf6c9e.jpg"

};

export const EVENTS = [
"Sarah & Alex's Wedding",
"Mia's 30th Birthday",
'Northwind Summit 2026'];


export const guestPhotos: GuestPhoto[] = [
{
  id: 'p1',
  src: IMG.toast,
  aspect: 'portrait',
  guest: 'Priya Raman',
  initials: 'PR',
  caption: 'To the happy couple! 🥂',
  minutesAgo: 1,
  state: 'pending'
},
{
  id: 'p2',
  src: IMG.dance,
  aspect: 'landscape',
  guest: 'Tom Beckett',
  initials: 'TB',
  caption: 'First dance, sparklers everywhere',
  minutesAgo: 3,
  state: 'approved'
},
{
  id: 'p3',
  src: IMG.selfie,
  aspect: 'square',
  guest: 'Layla Ortiz',
  initials: 'LO',
  caption: 'Photobooth crew ✨',
  minutesAgo: 6,
  state: 'approved'
},
{
  id: 'p4',
  src: IMG.cake,
  aspect: 'portrait',
  guest: 'Daniel Kim',
  initials: 'DK',
  caption: 'Cake time',
  minutesAgo: 9,
  state: 'approved'
},
{
  id: 'p5',
  src: IMG.confetti,
  aspect: 'landscape',
  guest: 'Rosa Vidal',
  initials: 'RV',
  caption: 'Confetti exit outside the hall',
  minutesAgo: 12,
  state: 'pending'
},
{
  id: 'p6',
  src: IMG.candid,
  aspect: 'landscape',
  guest: 'Chris Ndiaye',
  initials: 'CN',
  caption: 'Dance floor was unreal',
  minutesAgo: 15,
  state: 'approved'
},
{
  id: 'p7',
  src: IMG.detail,
  aspect: 'square',
  guest: 'Hannah Lowe',
  initials: 'HL',
  caption: 'Table styling is perfect',
  minutesAgo: 18,
  state: 'approved'
},
{
  id: 'p8',
  src: IMG.wedding,
  aspect: 'portrait',
  guest: 'Marcus Hale',
  initials: 'MH',
  caption: 'Golden hour portraits',
  minutesAgo: 22,
  state: 'approved'
},
{
  id: 'p9',
  src: IMG.engagement,
  aspect: 'landscape',
  guest: 'Ivy Chen',
  initials: 'IC',
  caption: 'Walk through the gardens',
  minutesAgo: 27,
  state: 'flagged'
}];


export const activityFeed = [
{ guest: 'Priya Raman', initials: 'PR', action: 'uploaded 3 photos', ago: 'just now' },
{ guest: 'Tom Beckett', initials: 'TB', action: 'uploaded 1 photo', ago: '3m ago' },
{ guest: 'Layla Ortiz', initials: 'LO', action: 'left a guestbook note', ago: '6m ago' },
{ guest: 'Daniel Kim', initials: 'DK', action: 'uploaded 2 photos', ago: '9m ago' },
{ guest: 'Rosa Vidal', initials: 'RV', action: 'joined the gallery', ago: '12m ago' },
{ guest: 'Chris Ndiaye', initials: 'CN', action: 'uploaded 5 photos', ago: '15m ago' }];