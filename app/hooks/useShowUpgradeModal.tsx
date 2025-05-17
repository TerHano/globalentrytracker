import { useContext } from "react";
import { ShowUpgradeModalContext } from "~/context/show-upgrade-modal-context";

export const useShowUpgradeModalContext = () => {
  const context = useContext(ShowUpgradeModalContext);
  if (!context) {
    throw new Error(
      "useShowUpgradeModalContext must be used within a ShowUpgradeModalProvider"
    );
  }
  return context;
};
