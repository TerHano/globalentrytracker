import React from "react";

export interface ShowUpgradeModalContextType {
  open: boolean;
  showUpgradeModal: () => void;
}

export const ShowUpgradeModalContext =
  React.createContext<ShowUpgradeModalContextType | null>(null);
