/** @jsxImportSource @builder.io/qwik */
import { component$ } from "@builder.io/qwik";
import { MegaMenu } from "./MegaMenu";
import type { NavItem } from "./MegaMenu";

// Example usage of the MegaMenu component
export const MegaMenuExample = component$(() => {
  const sampleNavData: NavItem[] = [
    {
      label: "Services",
      link: "/services",
      submenu: [
        {
          label: "Web Development",
          link: "/services/web-development",
          description: "Custom web applications built with modern technologies",
        },
        {
          label: "Mobile Apps",
          link: "/services/mobile-apps",
          description: "Native and cross-platform mobile applications",
        },
        {
          label: "Consulting",
          link: "/services/consulting",
          description: "Technical consulting and architecture planning",
        },
      ],
    },
    {
      label: "Products",
      link: "/products",
      submenu: [
        {
          label: "SaaS Platform",
          link: "/products/saas",
          description: "Enterprise-grade software as a service solutions",
        },
        {
          label: "API Tools",
          link: "/products/api-tools",
          description: "Developer tools and API management platforms",
        },
        {
          label: "Analytics",
          link: "/products/analytics",
          description: "Real-time data analytics and reporting tools",
        },
      ],
    },
    {
      label: "About",
      link: "/about",
    },
    {
      label: "Contact",
      link: "/contact",
    },
  ];

  return (
    <div>
      <h1>Qwik MegaMenu Example</h1>
      <MegaMenu primaryNav={sampleNavData} />
    </div>
  );
});

export default MegaMenuExample;
