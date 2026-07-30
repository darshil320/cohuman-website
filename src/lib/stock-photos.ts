/**
 * Royalty-free stock photography (Unsplash — free license, commercial use OK,
 * no attribution required) standing in for real Cohuman product/project
 * photography. Swap every one of these for real photography as it arrives;
 * search the codebase for `stockPhotos.` to find every usage.
 */

function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?fm=jpg&q=80&w=${width}&auto=format&fit=crop`;
}

export const stockPhotos = {
  heroDeskClean: unsplash("photo-1497215728101-856f4ea42174", 1600),
  heroChairWhite: unsplash("photo-1750306957077-b74e45fe1819", 1600),
  executiveCabin: unsplash("photo-1723810388971-f8cd6474597f"),
  conferenceTable: unsplash("photo-1431540015161-0bf868a2d407"),
  storageCabinet: unsplash("photo-1752061905158-0faca489f6b8"),
  loungeReception: unsplash("photo-1758448093806-88b2089068ab"),
  loungeBar: unsplash("photo-1759038086454-082dc45d101d"),
  openOfficeDesks: unsplash("photo-1718220216044-006f43e3a9b1"),
  filingDrawer: unsplash("photo-1564652506496-de4dc4683c1a"),
  receptionMarble: unsplash("photo-1758448500688-3ababa93fd67"),
  lobbyElevators: unsplash("photo-1758448721149-aa0ce8e1b2c9"),
} as const;

export type StockPhotoKey = keyof typeof stockPhotos;

/** Product category (`Product.cat`) → representative stock photo. */
export const categoryPhoto: Record<string, string> = {
  task: stockPhotos.heroChairWhite,
  exec: stockPhotos.executiveCabin,
  work: stockPhotos.openOfficeDesks,
  conf: stockPhotos.conferenceTable,
  store: stockPhotos.storageCabinet,
  sofa: stockPhotos.loungeReception,
};

/** Collection (`Collection.slug`) → representative stock photo. */
export const collectionPhoto: Record<string, string> = {
  meridian: stockPhotos.executiveCabin,
  origin: stockPhotos.heroChairWhite,
  loom: stockPhotos.openOfficeDesks,
  parlour: stockPhotos.loungeReception,
};

/** Project (`Project.slug`) → representative stock photo — six distinct shots. */
export const projectPhoto: Record<string, string> = {
  "meridian-tower": stockPhotos.openOfficeDesks,
  "northline-studio": stockPhotos.lobbyElevators,
  "kelvin-labs": stockPhotos.filingDrawer,
  "harbour-chambers": stockPhotos.executiveCabin,
  "ground-floor-co": stockPhotos.loungeBar,
  "saraswati-institute": stockPhotos.receptionMarble,
};

/** Space (`Space.slug`) → representative stock photo. */
export const spacePhoto: Record<string, string> = {
  cabin: stockPhotos.executiveCabin,
  workstation: stockPhotos.openOfficeDesks,
  meeting: stockPhotos.conferenceTable,
  lounge: stockPhotos.loungeReception,
};
