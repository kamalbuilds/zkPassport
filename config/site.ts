export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "zkPassport",
  description:
    "Cross-Chain Privacy Passport (zkPassport) - Prove credentials across chains without exposing personal data using zkLogin and Polyhedra's zkBridge.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Credentials",
      href: "/credentials",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    twitter: "https://twitter.com/kamalbuilds",
    github: "https://github.com/kamalbuilds/zkpassport",
    docs: "https://docs.zkpassport.com",
  },
}
