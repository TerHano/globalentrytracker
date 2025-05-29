import {
  Box,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { User } from "lucide-react";
import { LabelValue } from "~/components/ui/label-value";
import type { paths } from "~/types/api";
import { UserRoleBadge } from "./user-role-badge";
import { useQuery } from "@tanstack/react-query";
import { allRolesQuery } from "~/api/admin/roles-api";

type User =
  paths["/api/v1/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const UserModalBody = ({ user }: { user: User }) => {
  const allRoles = useQuery(allRolesQuery());
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
      <Group justify="space-between" align="center">
        <LabelValue label="External ID">
          <Text truncate maw={250}>
            {user.externalId ?? "N/A"}
          </Text>
        </LabelValue>{" "}
        <LabelValue label="Created At">
          {new Date(user.createdAt).toLocaleDateString()}
        </LabelValue>
      </Group>
      <Group justify="space-between" align="center">
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
      </Group>
      <Divider />
      <Group>
        <Button variant="light" color="red">
          Delete User
        </Button>
      </Group>
    </Stack>
  );
};
