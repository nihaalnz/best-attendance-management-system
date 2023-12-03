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
  sideNav: {
    teacher: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Icons.layoutDashboard,
      },
      {
        title: "Manage Attendance",
        href: "/attendance",
        icon: Icons.bookA,
      },
      {
        title: "Manage Classes",
        href: "/students",
        icon: Icons.bookMarked,
      },
      {
        title: "Manage Students",
        href: "/settings",
        icon: Icons.users,
      },
    ],
    student: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Icons.layoutDashboard,
      },
      {
        title: "View Attendance",
        href: "/attendance",
        icon: Icons.bookA,
      },
      {
        title: "View Classes",
        href: "/students",
        icon: Icons.bookMarked,
      },
      {
        title: "View Result",
        href: "/settings",
        icon: Icons.bookMarked,
      },
      {
        title: "Absentee Application",
        href: "/settings",
        icon: Icons.scrollText,
      },
    ],
    admin: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Icons.layoutDashboard,
      },
      {
        title: "Manage Attendance",
        href: "/attendance",
        icon: Icons.bookA,
      },
      {
        title: "Manage Classes",
        href: "/students",
        icon: Icons.bookMarked,
      },
      {
        title: "Manage Students",
        href: "/settings",
        icon: Icons.users,
      },
      {
        title: "Manage Teachers",
        href: "/settings",
        icon: Icons.users,
      },
      {
        title: "Enroll Students",
        href: "/settings",
        icon: Icons.graduationCap,
      },
    ],
  },
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
