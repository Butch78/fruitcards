import type { Transaction } from "~/types";

export const transactions: Transaction[] = [
  {
    company: "Acme Corp",
    description: "Leading provider of widgets",
    domain: "finance",
    location: "New York, USA",
    contact: {
      name: "James Anderson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "james.anderson@acme.com",
    },
    status: "Active",
  },
  {
    company: "Globex Inc",
    description: "Innovative tech solutions",
    domain: "healthcare",
    location: "London, UK",
    contact: {
      name: "Mia White",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "mia.white@globex.com",
    },
    status: "Inactive",
  },
  {
    company: "Soylent Corp",
    description: "Food and beverage leader",
    domain: "education",
    location: "Berlin, Germany",
    contact: {
      name: "William Brown",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      email: "william.brown@soylent.com",
    },
    status: "Pending",
  },
  {
    company: "Initech",
    description: "Business process experts",
    domain: "retail",
    location: "Paris, France",
    contact: {
      name: "Emma Davis",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      email: "emma.davis@initech.com",
    },
    status: "Active",
  },
  {
    company: "Umbrella Corp",
    description: "Pharmaceuticals and biotech",
    domain: "finance",
    location: "Tokyo, Japan",
    contact: {
      name: "Ethan Harris",
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      email: "ethan.harris@umbrella.com",
    },
    status: "Inactive",
  },
];
