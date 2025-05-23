import { forwardRef, useImperativeHandle } from "react";
import { useReward } from "react-rewards";

export type ConfettiHandle = {
  shootConfetti: () => void;
};

type ConfettiProps = {
  spread?: number;
  startVelocity?: number;
};

export const Confetti = forwardRef<ConfettiHandle, ConfettiProps>(
  ({ spread = 90, startVelocity = 15 }, ref) => {
    const { reward: triggerConfetti } = useReward("confettiId", "confetti", {
      elementCount: 400,
      lifetime: 800,
      position: "absolute",
      spread: spread,
      startVelocity: startVelocity,
      colors: ["#4A90E2", "#B3D4FC", "#EAF6FF"], // Colors for the confetti
    });

    useImperativeHandle(ref, () => ({
      shootConfetti: () => {
        triggerConfetti();
      },
    }));

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none", // So it doesn't block clicks
          overflow: "hidden", // Prevent scrollbars from confetti
          justifyContent: "center",
          justifyItems: "center",
          display: "flex",
        }}
      >
        <span id="confettiId" />
      </div>
    );
  }
);

Confetti.displayName = "Confetti";
