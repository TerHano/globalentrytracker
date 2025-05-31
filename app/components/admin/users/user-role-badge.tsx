import { Badge } from "@mantine/core";

export const UserRoleBadge = ({
  roleCode,
}: {
  roleCode: string | undefined | null;
}) => {
  return (
    <Badge variant="light" color={colorForRole(roleCode)}>
      {roleCode ?? "N/A"}
    </Badge>
  );
};

const colorForRole = (roleCode: string | null | undefined) => {
  switch (roleCode) {
    case "admin":
      return "red";
    case "free":
      return "blue";
    case "subscriber":
      return "yellow";
    default:
      return "dark";
  }
};
