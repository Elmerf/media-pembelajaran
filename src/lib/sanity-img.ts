import urlBuilder from "@sanity/image-url";
import { client } from "./sanity-client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = urlBuilder(client);

export const converToImg = (source: SanityImageSource) => {
  return builder.image(source);
};
