/**
 * SHOWROOMS (demo addresses)
 * `map` is an OpenStreetMap embed URL. To get one for your address: open
 * openstreetmap.org, find the location, choose Share → HTML, and copy the
 * iframe `src` value here.
 */
export type Store = {
  name: string;
  address: string[];
  hours: string[];
  phone: string;
  map: string;
};

export const stores: Store[] = [
  {
    name: "Brooklyn showroom",
    address: ["45 Harbor Lane", "Brooklyn, NY 11249"],
    hours: ["Mon–Fri 11:00–19:00", "Sat–Sun 10:00–18:00"],
    phone: "+1 (212) 555-0148",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-73.9661%2C40.7176%2C-73.9541%2C40.7246&layer=mapnik&marker=40.7211%2C-73.9601",
  },
  {
    name: "Copenhagen workshop",
    address: ["Snedkervej 12", "1432 København K, Denmark"],
    hours: ["Thu–Sat 10:00–17:00", "Workshop tours on Saturdays"],
    phone: "+45 32 55 01 48",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=12.6000%2C55.6880%2C12.6200%2C55.6960&layer=mapnik&marker=55.6920%2C12.6100",
  },
];
