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
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { LabelValue } from "~/components/ui/label-value";
import { UserRoleBadge } from "./user-role-badge";
import { useState } from "react";
import { planQuery } from "~/api/plans-api";
import { ArrowLeft, Pencil, UserCheck } from "lucide-react";
import type { paths } from "~/types/api";
import { PlanFrequencyBadge } from "./plan-frequency-badge";
import { useGrantSubscription } from "~/hooks/api/admin/useGrantSubscription";
import { useShowNotification } from "~/hooks/useShowNotification";

type User =
  paths["/api/v1/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const UserModalButton = ({ user }: { user: User }) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const allPlans = useQuery(planQuery());
  const [selectedPlan, setSelectedPlan] = useState<string>("");

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
  return (
    <>
      <Modal.Stack>
        <Modal
          size="xl"
          withCloseButton={false}
          {...modals.register("user-modal")}
        >
          <Stack>
            <Stack gap="xs" align="center" justify="center">
              <UserRoleBadge roleCode={user.role?.code} />
              <Text
                lh={1}
                fz="2rem"
                fw={600}
              >{`${user.firstName} ${user.lastName}`}</Text>
              <Text lh={1} fz="1rem" c="dimmed">
                {user.email}
              </Text>
            </Stack>
            <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xs">
              <LabelValue label="External ID">
                <Text truncate maw={250}>
                  {user.externalId ?? "N/A"}
                </Text>
              </LabelValue>{" "}
              <LabelValue label="Created At">
                {new Date(user.createdAt).toLocaleDateString()}
              </LabelValue>
            </SimpleGrid>
            <Divider />
            <Stack>
              <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xs">
                <LabelValue label="Customer ID">
                  <Text truncate maw={250}>
                    {user.customerId ?? "N/A"}
                  </Text>
                </LabelValue>
                <LabelValue label="Subscription ID">
                  <Text truncate maw={250}>
                    {user.subscriptionId ?? "N/A"}
                  </Text>
                </LabelValue>
              </SimpleGrid>
              <Button
                variant="light"
                color="blue"
                onClick={() => modals.open("grant-subscription-modal")}
              >
                Grant Subscription
              </Button>
            </Stack>

            {/* <Group justify="space-between" align="center">
        <Select
          maw={100}
          variant="filled"
          label="Role"
          comboboxProps={{
            transitionProps: {
              transition: "fade-down",
            },
          }}
          // defaultSearchValue={user.role?.code}

          data={
            allRoles.data?.map((role) => ({
              value: role.code,
              label: role.name,
            })) ?? []
          }
          defaultValue={user.role?.code}
          allowDeselect={false}
        />
      </Group> */}
            <Divider />
            <Group>
              <Button variant="light" color="red">
                Delete User
              </Button>
            </Group>
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
              label="Pick one package to install"
              description="Choose a package that you will need in your application"
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
                color="white"
                leftSection={<ArrowLeft size={12} />}
              >
                Back
              </Button>
              <Button
                loading={grantSubscriptionMutation.isPending}
                onClick={handleGrantSubscription}
                w="fit-content"
                color="blue"
                disabled={!selectedPlan}
              >
                Grant Subscription
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Modal.Stack>

      <ActionIcon
        variant="subtle"
        color="white"
        size="lg"
        onClick={() => modals.open("user-modal")}
      >
        <Pencil size={16} />
      </ActionIcon>
    </>
  );
};
