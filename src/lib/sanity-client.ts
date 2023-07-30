import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "o79o2xy0",
  dataset: "production",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
  apiVersion: "2021-10-21",
  ignoreBrowserTokenWarning: true,
  perspective: "published",
});
