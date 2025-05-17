import { useModalsStack } from "@mantine/core";
import { useState, type PropsWithChildren } from "react";
import { UpgradeModal } from "~/components/upgrade-modal/upgrade-modal";
import { ShowUpgradeModalContext } from "~/context/show-upgrade-modal-context";

export const UpgradeModalProvider = ({ children }: PropsWithChildren) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const stack = useModalsStack([
    "upgrade-benefits",
    "validation-successful",
    "validation-failed",
  ]);

  return (
    <ShowUpgradeModalContext.Provider
      value={{
        open: showUpgradeModal,
        showUpgradeModal: () => {
          setShowUpgradeModal(true);
        },
      }}
    >
      {children}
      <UpgradeModal
        stack={stack}
        open={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
        }}
      />
    </ShowUpgradeModalContext.Provider>
  );
};
