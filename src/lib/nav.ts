export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "Collections", href: "/collections" },
  { label: "Sectors", href: "/sectors" },
  // { label: "Catalog", href: "/catalog" },
  { label: "B2B / Bulk Orders", href: "/b2b" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

export const fullNav: NavLink[] = [
  { label: "Home", href: "/" },
  ...primaryNav,
  { label: "Services", href: "/services" },
  { label: "Contact & Showroom", href: "/contact" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      // { label: "Full catalog", href: "/catalog" },
      { label: "Collections", href: "/collections" },
      { label: "Sectors we serve", href: "/sectors" },
      { label: "Workspace solutions", href: "/solutions" },
      { label: "B2B / Bulk orders", href: "/b2b" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Cohuman", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Services", href: "/services" },
      { label: "Contact & showroom", href: "/contact" },
    ],
  },
];
