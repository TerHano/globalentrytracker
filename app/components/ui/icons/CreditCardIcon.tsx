import { CreditCard } from "lucide-react";
import { useMemo } from "react";
import AmexIcon from "~/assets/icons/credit-card/amex.png";
import discoverIcon from "~/assets/icons/credit-card/discover.png";
import VisaIcon from "~/assets/icons/credit-card/visa.png";
import MasterCardIcon from "~/assets/icons/credit-card/master-card.png";
import { Image } from "@mantine/core";

export type CreditCardIconName =
  | "amex"
  | "diners"
  | "discover"
  | "jcb"
  | "mastercard"
  | "visa";

export const CreditCardIcon = ({ name }: { name: string | undefined }) => {
  const imgSrc = useMemo(() => {
    switch (name) {
      case "amex":
        return AmexIcon;
      case "visa":
        return VisaIcon;
      case "mastercard":
        return MasterCardIcon;
      case "discover":
        return discoverIcon;
      default:
        return null;
    }
  }, [name]);
  if (!imgSrc) {
    return <CreditCard size={24} />;
  }
  return <Image src={imgSrc} alt={name} w={40} radius="sm" h={24} />;
};
