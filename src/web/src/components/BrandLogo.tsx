import { publicAssetSrc } from "@/lib/members";

const LOGO_SRC = publicAssetSrc("assets/images/logo/logo.png");

export function BrandLogo({ className = "brand-logo" }: { className?: string }) {
  return <img className={className} src={LOGO_SRC} alt="" />;
}
