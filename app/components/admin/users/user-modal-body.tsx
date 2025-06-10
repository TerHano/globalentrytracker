import { Button, Divider, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { User } from "lucide-react";
import { LabelValue } from "~/components/ui/label-value";
import type { paths } from "~/types/api";
import { UserRoleBadge } from "./user-role-badge";

type User =
  paths["/api/v1/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const UserModalBody = ({ user }: { user: User }) => {
  return (
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
  );
};
