export const projectCategories = {
  PORTFOLIO: "Portfolio Sites",
  ECOMMERCE: "E-Commerce Sites",
  COMPANY: "Company Sites",
  PORTAL: "Portal and Dashboards"
};

export const projects = [
  // Portfolio Sites
  {
    id: 1,
    title: "BCF",
    location: "Netherlands",
    year: "2025",
    tags: ["Website"],
    image: "/images/bcf.png",
    category: projectCategories.PORTFOLIO
  },
  {
    id: 2,
    title: "Personal Brand",
    location: "USA",
    year: "2024",
    tags: ["Creative"],
    image: "/images/zapp.png",
    category: projectCategories.PORTFOLIO
  },

  // E-Commerce Sites
  {
    id: 3,
    title: "Zapp Shop",
    location: "India",
    year: "2024",
    tags: ["Shopify", "3D"],
    image: "/images/zapp.png",
    category: projectCategories.ECOMMERCE
  },
  {
    id: 4,
    title: "Summr Store",
    location: "India",
    year: "2025",
    tags: ["Retail"],
    image: "/images/summr.png",
    category: projectCategories.ECOMMERCE
  },

  // Company Sites
  {
    id: 5,
    title: "GRIFA",
    location: "Global",
    year: "2024",
    tags: ["Corporate"],
    image: "/images/bcf.png",
    category: projectCategories.COMPANY
  },
  {
    id: 6,
    title: "MKAVS Tech",
    location: "Global",
    year: "2025",
    tags: ["SaaS"],
    image: "/images/summr.png",
    category: projectCategories.COMPANY
  },

  // Portals and Dashboards
  {
    id: 7,
    title: "Admin Portal",
    location: "Internal",
    year: "2025",
    tags: ["Dashboard", "React"],
    image: "/images/bcf.png",
    category: projectCategories.PORTAL
  },
  {
    id: 8,
    title: "Client Dashboard",
    location: "Global",
    year: "2024",
    tags: ["Portal", "API"],
    image: "/images/summr.png",
    category: projectCategories.PORTAL
  }
];
