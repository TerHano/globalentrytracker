import { useCallback } from "react";
import { useWindowScroll } from "@mantine/hooks";

const useIdScroll = () => {
  const [, scrollTo] = useWindowScroll();

  const scrollToId = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 80;
        scrollTo({ y: scrollTop });
      }
    },
    [scrollTo]
  );

  return { scrollToId };
};

export default useIdScroll;
