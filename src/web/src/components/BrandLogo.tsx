import logoOnDarkSrc from "../../../../assets/images/logo/logo-dark-transparent.png";
import logoOnLightSrc from "../../../../assets/images/logo/logo.png";
import { LAB } from "@/config";

type BrandLogoProps = {
  className?: string;
  /** Surface behind the mark — not the page theme. */
  on?: "dark" | "light";
};

export function BrandLogo({ className = "brand-logo", on }: BrandLogoProps) {
  return (
    <span className={className} data-on={on}>
      <img
        className="brand-logo-mark brand-logo-mark-on-dark"
        src={logoOnDarkSrc}
        alt={LAB.name}
      />
      <img
        className="brand-logo-mark brand-logo-mark-on-light"
        src={logoOnLightSrc}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}
