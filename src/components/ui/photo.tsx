import Image, { type ImageProps } from "next/image";
import type { ImageRef } from "@data/images";
import { getImage } from "@/lib/utils";

type PhotoProps = Omit<ImageProps, "src" | "alt" | "priority"> & {
  /** Key from data/images.ts, or a full image URL. */
  name: ImageRef;
  /** Override the library alt text; pass "" for decorative images. */
  alt?: string;
  /**
   * Above-the-fold image (hero, main product photo): load immediately at high
   * priority. Uses loading="eager" + fetchPriority="high" as recommended for
   * Next.js 16, which avoids downloading a second, differently sized copy.
   */
  priority?: boolean;
};

/** next/image bound to the image library, so swapping photos never touches components. */
export function Photo({ name, alt, priority, ...props }: PhotoProps) {
  const image = getImage(name);
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      {...(priority ? { loading: "eager", fetchPriority: "high" } : {})}
      {...props}
    />
  );
}
