import {
  Stack,
  SimpleGrid,
  Divider,
  Button,
  Group,
  Text,
  useModalsStack,
  Modal,
  Radio,
  ActionIcon,
  Avatar,
  CopyButton,
  Tooltip,
  Code,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { LabelValue } from "~/components/ui/label-value";
import { UserRoleBadge } from "./user-role-badge";
import { useState } from "react";
import { planQuery } from "~/api/plans-api";
import { ArrowLeft, Check, Copy, Gift, RefreshCw, Trash2, UserCheck, View } from "lucide-react";
import type { paths } from "~/types/api";
import { PlanFrequencyBadge } from "./plan-frequency-badge";
import { useGrantSubscription } from "~/hooks/api/admin/useGrantSubscription";
import { useSyncSubscriptionRole } from "~/hooks/api/admin/useSyncSubscriptionRole";
import { useShowNotification } from "~/hooks/useShowNotification";

type User =
  paths["/api/v1/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const UserModalButton = ({ user }: { user: User }) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const allPlans = useQuery(planQuery());
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const syncSubscriptionRoleMutation = useSyncSubscriptionRole({
    onSuccess: () => {
      showNotification({
        icon: <UserCheck size={16} />,
        title: "Success",
        message: `Subscription role synced successfully!`,
        status: "success",
      });
    },
    onError: (errors) => {
      showErrorCodeNotification(errors);
    },
  });

  const grantSubscriptionMutation = useGrantSubscription({
    onSuccess: () => {
      showNotification({
        icon: <UserCheck size={16} />,
        title: "Success",
        message: `Subscription granted successfully!`,
        status: "success",
      });
    },
    onError: (errors) => {
      showErrorCodeNotification(errors);
    },
  });

  const handleGrantSubscription = async () => {
    if (!selectedPlan) {
      showNotification({
        icon: <UserCheck size={16} />,
        title: "Error",
        message: `Please select a plan to grant.`,
        status: "error",
      });
      return;
    }
    await grantSubscriptionMutation.mutateAsync({
      body: {
        userId: user.id,
        priceId: selectedPlan,
      },
    });
    setSelectedPlan("");
  };

  const modals = useModalsStack(["user-modal", "grant-subscription-modal"]);

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      <Modal.Stack>
        <Modal size="xl" title="User Details" withCloseButton {...modals.register("user-modal")}>
          <Stack>
            {/* Header */}
            <Stack gap="xs" align="center" justify="center">
              <Avatar size="lg" radius="xl" color="blue">
                {initials}
              </Avatar>
              <UserRoleBadge roleCode={user.role?.code} />
              <Text lh={1} fz="2rem" fw={600}>{`${user.firstName} ${user.lastName}`}</Text>
              <Text lh={1} fz="1rem" c="dimmed">
                {user.email}
              </Text>
            </Stack>

            <Divider />

            {/* User Info */}
            <Stack gap="xs">
              <Title order={6} c="dimmed" tt="uppercase" fz="0.7rem" fw={700}>
                User Info
              </Title>
              <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xs">
                <LabelValue label="External ID">
                  {user.externalId ? (
                    <Group gap="xs">
                      <Code>{user.externalId}</Code>
                      <CopyButton value={user.externalId} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color={copied ? "teal" : "gray"}
                              onClick={copy}
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  ) : (
                    <Text c="dimmed">N/A</Text>
                  )}
                </LabelValue>
                <LabelValue label="Created At">
                  <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                </LabelValue>
              </SimpleGrid>
            </Stack>

            <Divider />

            {/* Subscription */}
            <Stack gap="xs">
              <Title order={6} c="dimmed" tt="uppercase" fz="0.7rem" fw={700}>
                Subscription
              </Title>
              <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xs">
                <LabelValue label="Customer ID">
                  {user.customerId ? (
                    <Group gap="xs">
                      <Text truncate maw={200} ff="monospace" fz="sm">
                        {user.customerId}
                      </Text>
                      <CopyButton value={user.customerId} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color={copied ? "teal" : "gray"}
                              onClick={copy}
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  ) : (
                    <Text c="dimmed">N/A</Text>
                  )}
                </LabelValue>
                <LabelValue label="Subscription ID">
                  {user.subscriptionId ? (
                    <Group gap="xs">
                      <Text truncate maw={200} ff="monospace" fz="sm">
                        {user.subscriptionId}
                      </Text>
                      <CopyButton value={user.subscriptionId} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color={copied ? "teal" : "gray"}
                              onClick={copy}
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  ) : (
                    <Text c="dimmed">N/A</Text>
                  )}
                </LabelValue>
              </SimpleGrid>
              <Group grow>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<Gift size={14} />}
                  onClick={() => modals.open("grant-subscription-modal")}
                >
                  Grant Subscription
                </Button>
                <Button
                  variant="light"
                  color="teal"
                  leftSection={<RefreshCw size={14} />}
                  loading={syncSubscriptionRoleMutation.isPending}
                  onClick={() =>
                    syncSubscriptionRoleMutation.mutate({
                      params: { path: { userId: user.id } },
                    })
                  }
                >
                  Sync Subscription Role
                </Button>
              </Group>
            </Stack>

            <Divider />

            {/* Danger Zone */}
            <Stack gap="xs">
              <Title order={6} c="red" tt="uppercase" fz="0.7rem" fw={700}>
                Danger Zone
              </Title>
              <Button variant="light" color="red" leftSection={<Trash2 size={14} />}>
                Delete User
              </Button>
            </Stack>
          </Stack>
        </Modal>
        <Modal
          withCloseButton={false}
          {...modals.register("grant-subscription-modal")}
          onExitTransitionEnd={() => setSelectedPlan("")}
        >
          <Stack>
            <Text size="lg" fw={500}>
              Grant Subscription to {user?.firstName} {user?.lastName}
            </Text>
            <Radio.Group
              value={selectedPlan}
              onChange={setSelectedPlan}
              label="Which plan would you like to grant?"
              description="Select a plan to grant this user a subscription."
            >
              <Stack pt="md" gap="xs">
                {allPlans.data?.map((plan) => (
                  <Radio.Card key={plan.id} value={plan.priceId} radius="md">
                    <Group p="md" wrap="nowrap" align="flex-start">
                      <Radio.Indicator />
                      <Stack w="100%" gap={0}>
                        <Group gap="xs" justify="space-between">
                          <Text fw="bold" fz="1.2rem">
                            {plan.name}
                          </Text>
                          <PlanFrequencyBadge frequency={plan.frequency} />
                        </Group>
                        <Group gap="xs" justify="space-between">
                          <Text fz="1rem" c="dimmed">
                            {plan.description}
                          </Text>
                          <Text fz="1.1rem" fw={500}>
                            {plan.priceFormatted}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                  </Radio.Card>
                ))}
              </Stack>
            </Radio.Group>
            <Group justify="space-between" pt="md">
              <Button
                onClick={() => modals.close("grant-subscription-modal")}
                w="fit-content"
                variant="subtle"
                color="gray"
                leftSection={<ArrowLeft size={12} />}
              >
                Back
              </Button>
              <Button
                loading={grantSubscriptionMutation.isPending}
                onClick={handleGrantSubscription}
                w="fit-content"
                color="blue"
                leftSection={<Gift size={14} />}
                disabled={!selectedPlan}
              >
                Grant Subscription
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Modal.Stack>

      <Tooltip label="View User" withArrow>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={() => modals.open("user-modal")}
        >
          <View size={16} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};
