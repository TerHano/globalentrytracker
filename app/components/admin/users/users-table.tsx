import { Skeleton, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { allUsersQuery } from "~/api/admin/all-users-api";
import { useDeleteUser } from "~/hooks/api/admin/useDeleteUser";
import { DataTable } from "mantine-datatable";
import { modals } from "@mantine/modals";
import { UserModalBody } from "./user-modal-body";
import { UserRoleBadge } from "./user-role-badge";

export const UsersTable = () => {
  const allUsers = useQuery(allUsersQuery());
  const deleteUserMutation = useDeleteUser({
    onSuccess: (data, userId) => {
      console.log("User deleted successfully:", data, userId);
    },
    onError: (errors) => {
      console.error("Error deleting user:", errors);
    },
  });

  if (allUsers.isLoading) {
    return (
      <Stack>
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </Stack>
    );
  }

  return (
    <DataTable
      records={allUsers.data ?? []}
      columns={[
        { title: "ID", width: 100, accessor: "id", sortable: true },

        { title: "First Name", width: 150, accessor: "firstName" },
        { title: "Last Name", width: 150, accessor: "lastName" },
        { title: "Email", width: 200, accessor: "email" },
        {
          accessor: "user.role.code",
          title: "Role",
          width: 100,
          render: (user) => <UserRoleBadge roleCode={user.role?.code} />,
        },
      ]}
      withTableBorder
      highlightOnHover
      striped
      stripedColor="red"
      borderRadius="xs"
      onRowClick={(row) => {
        const user = row.record;
        modals.open({
          centered: true,
          size: "md",
          withCloseButton: false,
          children: <UserModalBody user={user} />,
        });
        // Handle row click, e.g., navigate to user details page
      }}
    />
  );
};
