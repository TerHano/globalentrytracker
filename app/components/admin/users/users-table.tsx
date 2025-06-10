import { Skeleton, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { allUsersQuery } from "~/api/admin/all-users-api";
import { DataTable } from "mantine-datatable";
import { UserRoleBadge } from "./user-role-badge";
import { UserModalButton } from "./user-modal-button";

export const UsersTable = () => {
  const allUsers = useQuery(allUsersQuery());
  // const deleteUserMutation = useDeleteUser({
  //   onSuccess: (data, userId) => {
  //     console.log("User deleted successfully:", data, userId);
  //   },
  //   onError: (errors) => {
  //     console.error("Error deleting user:", errors);
  //   },
  // });

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
        { title: "ID", width: 100, accessor: "id" },

        { title: "First Name", width: 150, accessor: "firstName" },
        { title: "Last Name", width: 150, accessor: "lastName" },
        { title: "Email", width: 200, accessor: "email" },
        {
          accessor: "user.role.code",
          title: "Role",
          width: 150,
          render: (user) => <UserRoleBadge roleCode={user.role?.code} />,
        },
        {
          accessor: "__none",
          textAlign: "center",
          title: "Actions",
          width: 80,
          render: (user) => <UserModalButton user={user} />,
        },
      ]}
      borderRadius="xs"
      withTableBorder
      //rowBackgroundColor={(record) => "red"}
      pinLastColumn
      striped
      // onRowClick={(row) => {
      //   const user = row.record;
      //   modals.open({
      //     centered: true,
      //     size: "xl",
      //     withCloseButton: false,
      //     children: <UserModalBody user={user} />,
      //   });
      //   // Handle row click, e.g., navigate to user details page
      // }}
    />
  );
};
