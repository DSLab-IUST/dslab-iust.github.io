import logoSrc from "../../../../assets/images/logo/logo.png";
import { LAB } from "@/config";

export function BrandLogo({ className = "brand-logo" }: { className?: string }) {
  return <img className={className} src={logoSrc} alt={LAB.name} />;
}
