import { Stack, Divider, Button } from "@mantine/core";
import { AddEditPricingPlanButton } from "~/components/admin/pricing/add-edit-pricing-plan-button";
import { PricingList } from "~/components/admin/pricing/pricing-list";
import { UsersTable } from "~/components/admin/users/users-table";
import { Page } from "~/components/ui/layout/page";

export const AdminConsolePage = () => (
  <Page header="Admin Console" description="Manage users and permissions">
    <Stack gap="xl" className="fade-in-up-animation">
      <Divider />
      {/* <Paper p="md" shadow="xs" withBorder> */}
      <Page.Subsection
        header="Users"
        description="Manage users in the system. You can view, edit, or delete users here."
      >
        <UsersTable />
      </Page.Subsection>

      {/* </Paper> */}
      {/* <Paper p="md" shadow="xs" withBorder> */}
      <Page.Subsection
        action={
          <AddEditPricingPlanButton
            buttonProps={{
              variant: "light",
              size: "sm",
              color: "blue",
              children: "Add Pricing Plan",
            }}
          />
        }
        header="Pricing Plans"
        description="Manage your pricing plans here."
      >
        <PricingList />
      </Page.Subsection>
      {/* </Paper> */}
    </Stack>
  </Page>
);
