import margueritePng from "@/assets/images/marguerite.png";
import Image from "next/image";
export function Logo(p: {}) {
  return (
    <Image
      src={margueritePng.src}
      height={512}
      width={512}
      className="w-12 h-12 mr-2"
      alt="Marguerite"
    />
  );
}
