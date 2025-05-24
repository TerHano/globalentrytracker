import {
  Button,
  Modal,
  Image,
  Stack,
  Group,
  useModalsStack,
  Text,
} from "@mantine/core";
import { Empty } from "./ui/empty";
import deleteAllTrackersImg from "~/assets/icons/delete-all-trackers.png";
import { useDeleteAllTrackers } from "~/hooks/api/useDeleteAllTrackers";
import celebrationImg from "~/assets/icons/celebrate.png";
import { Confetti, type ConfettiHandle } from "./ui/confetti";
import { useRef } from "react";
import { CalendarX } from "lucide-react";

export const DeleteAllTrackers = ({ visible }: { visible: boolean }) => {
  const confettiRef = useRef<ConfettiHandle>(null);
  const modalStack = useModalsStack([
    "delete-all-trackers-confirm",
    "trackers-deleted",
  ]);

  const shootConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.shootConfetti();
    }
  };

  const deleteAllTrackersMutation = useDeleteAllTrackers({
    onSuccess: () => {
      console.log("All trackers deleted successfully");
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
          withCloseButton={false}
        >
          <Stack align="center" justify="center" gap="lg">
            <Empty
              title="Delete All Trackers?"
              description="Are you sure you want to delete all trackers? This action cannot be
            undone."
              icon={<Image src={deleteAllTrackersImg} w="5rem" />}
            />
            <Group w="100%" justify="end" gap="xs">
              <Button onClick={() => modalStack.closeAll()} variant="outline">
                Cancel
              </Button>
              <Button
                loading={deleteAllTrackersMutation.isPending}
                onClick={() => {
                  deleteAllTrackersMutation.mutate({});
                }}
                color="red"
                variant="filled"
              >
                Delete All Trackers
              </Button>
            </Group>
          </Stack>
        </Modal>
        <Modal
          {...modalStack.register("trackers-deleted")}
          onClose={() => modalStack.closeAll()}
          onEnterTransitionEnd={() => {
            shootConfetti();
          }}
          withCloseButton={false}
        >
          <Stack align="center" justify="center" gap="lg">
            <Confetti ref={confettiRef} />
            <Empty
              title="Congratulations!"
              description="Glad you got your appointment! All your trackers have been
            successfully deleted and you should no longer receive
            notifications."
              icon={<Image src={celebrationImg} w="5rem" />}
            />
            <Stack w="100%" justify="center" gap="sm">
              <Button onClick={() => modalStack.closeAll()}>Close</Button>
              <Button
                size="xs"
                onClick={() => shootConfetti()}
                variant="subtle"
              >
                Celebrate Again
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
            Delete All Your Trackers
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
