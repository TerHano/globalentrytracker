import {
  Button,
  Modal,
  Image,
  Stack,
  Group,
  useModalsStack,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { Empty } from "./ui/empty";
import deleteAllTrackersImg from "~/assets/icons/delete-all-trackers.png";
import { useDeleteAllTrackers } from "~/hooks/api/useDeleteAllTrackers";
import celebrationImg from "~/assets/icons/celebrate.png";
import { Confetti, type ConfettiHandle } from "./ui/confetti";
import { useRef } from "react";
import { CalendarX } from "lucide-react";

export const DeleteAllTrackers = ({
  visible,
  trackerCount,
}: {
  visible: boolean;
  trackerCount: number;
}) => {
  const confettiRef = useRef<ConfettiHandle>(null);
  const modalStack = useModalsStack([
    "delete-all-trackers-confirm",
    "trackers-deleted",
  ]);
  const isSingleTracker = trackerCount === 1;
  const trackerLabel = isSingleTracker ? "tracker" : "trackers";

  const shootConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.shootConfetti();
    }
  };

  const deleteAllTrackersMutation = useDeleteAllTrackers({
    onSuccess: () => {
      modalStack.open("trackers-deleted");
    },
    onError: (error) => {
      console.error("Error deleting all trackers:", error);
    },
  });
  return (
    <>
      <Modal.Stack>
        <Modal
          {...modalStack.register("delete-all-trackers-confirm")}
          size="sm"
          centered
          closeOnClickOutside={!deleteAllTrackersMutation.isPending}
          closeOnEscape={!deleteAllTrackersMutation.isPending}
          withCloseButton={false}
        >
          <Stack align="center" justify="center" gap="lg">
            <Empty
              title={`Delete ${trackerCount} ${trackerLabel}?`}
              description={`This will permanently remove ${trackerCount} ${trackerLabel} from your account and stop all related notifications. This action cannot be undone.`}
              icon={<Image src={deleteAllTrackersImg} w="5rem" />}
            />
            <SimpleGrid w="100%" cols={2} spacing="xs">
              <Button
                onClick={() => modalStack.closeAll()}
                variant="default"
                disabled={deleteAllTrackersMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                loading={deleteAllTrackersMutation.isPending}
                onClick={() => {
                  deleteAllTrackersMutation.mutate({});
                }}
                size="sm"
                color="red"
                variant="filled"
              >
                {`Delete ${trackerCount} ${trackerLabel}`}
              </Button>
            </SimpleGrid>
          </Stack>
        </Modal>
        <Modal
          {...modalStack.register("trackers-deleted")}
          onClose={() => modalStack.closeAll()}
          centered
          onEnterTransitionEnd={() => {
            shootConfetti();
          }}
          withCloseButton={false}
        >
          <Stack align="center" justify="center" gap="lg">
            <Confetti ref={confettiRef} />
            <Empty
              title={`${trackerCount} ${trackerLabel} deleted`}
              description="You won't receive alerts from previous trackers anymore. If you still need notifications, you can create a new tracker anytime."
              icon={<Image src={celebrationImg} w="5rem" />}
            />
            <Stack w="100%" justify="center" gap="sm">
              <Button onClick={() => modalStack.closeAll()}>Close</Button>
              <Button
                size="xs"
                onClick={() => shootConfetti()}
                variant="subtle"
              >
                Celebrate again
              </Button>
            </Stack>
          </Stack>
        </Modal>
      </Modal.Stack>
      {visible ? (
        <Group p="xs" justify="center" gap={3}>
          <Text fw={600} c="dimmed" fz="sm">
            Got your appointment?
          </Text>
          <Button
            onClick={() => modalStack.open("delete-all-trackers-confirm")}
            variant="subtle"
            color="red"
            size="compact-xs"
            rightSection={<CalendarX size={12} />}
          >
            Delete all trackers
          </Button>
          {/* <DeleteAllTrackersButton
            buttonProps={{
              children: "",
              variant: "subtle",
              color: "red",
              size: "compact-xs",
             ,
            }}
          /> */}
        </Group>
      ) : null}
    </>
  );
};
