import { Table, type TableData } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { allUsersQuery } from "~/api/admin/all-users-api";

export const UsersTable = () => {
  const { data } = useQuery(allUsersQuery());
  const tableData: TableData = {
    caption: "Users in the system",
    head: ["First Name", "Last Name"],
    body: data?.map((user) => [
      user.firstName || "N/A",
      user.lastName || "N/A",
    ]),
  };

  return <Table data={tableData} />;
};
