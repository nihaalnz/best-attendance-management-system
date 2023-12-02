import { Icons } from "@/components/icons";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BAMS.",
  description: "Attendance management system in the palm of your hands",
  logo: {
    icon: Icons.logo,
    url: "/",
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ],
  links: [
    {
      title: "Notification",
      url: "/notification",
      icon: Icons.bell,
    },
    {
      title: "GitHub",
      url: "https://github.com/nihaalnz/best-attendance-management-system",
      icon: Icons.gitHub,
    },
  ],
};
