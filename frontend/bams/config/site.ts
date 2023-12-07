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
      href: "/",
    },
  ],
  sideNav: {
    teacher: [
      {
        title: "Dashboard",
        href: "/",
        icon: Icons.layoutDashboard,
      },
      {
        title: "Manage Attendance",
        href: "/classes",
        icon: Icons.bookA,
      },
      {
        title: "Manage Classes",
        href: "/classes",
        icon: Icons.bookMarked,
      },
      {
        title: "Manage Students",
        href: "/courses",
        icon: Icons.users,
      },
    ],
    student: [
      {
        title: "Dashboard",
        href: "/",
        icon: Icons.layoutDashboard,
      },
      {
        title: "View Attendance",
        href: "/courses",
        icon: Icons.bookA,
      },
      {
        title: "View Classes",
        href: "/classes",
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
        href: "/",
        icon: Icons.layoutDashboard,
      },
      {
        title: "Manage Attendance",
        href: "/classes",
        icon: Icons.bookA,
      },
      {
        title: "Manage Classes",
        href: "/classes",
        icon: Icons.bookMarked,
      },
      {
        title: "Manage Students",
        href: "/courses",
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
