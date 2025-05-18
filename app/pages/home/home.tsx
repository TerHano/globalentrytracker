import {
  Button,
  Container,
  Group,
  Image,
  List,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import travelersImage from "~/assets/images/travelers.svg";
import classes from "./home.module.css";
import { CircleCheck } from "lucide-react";
import { NavLink } from "react-router";
import { Page } from "~/components/ui/page";
import { PricingCard } from "~/components/pricing/pricing-card";
import { planQuery } from "~/api/plans-api";
import { useQuery } from "@tanstack/react-query";

export const HomePage = () => {
  const { data: plans } = useQuery(planQuery());
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>modern</span> <br /> Global
            Entry Appointment Tracker
          </Title>
          <Text c="dimmed" mt="md">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <CircleCheck size={12} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>TypeScript based</b> – build type safe applications, all
              components and hooks export types
            </List.Item>
            <List.Item>
              <b>Free and open source</b> – all packages have MIT license, you
              can use Mantine in any project
            </List.Item>
            <List.Item>
              <b>No annoying focus ring</b> – focus ring will appear only when
              user navigates with keyboard
            </List.Item>
          </List>

          <Group mt={30}>
            <NavLink to="/login">
              <Button size="md" className={classes.control}>
                Login
              </Button>
            </NavLink>
            <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button>
          </Group>
        </div>
        <Image src={travelersImage} className={classes.image} />
      </div>
      <Page.Subsection
        header="Pricing"
        description="Choose a plan that works for you"
      >
        <SimpleGrid maw={800} cols={2} spacing="lg" mt="lg">
          <PricingCard
            title="Free"
            description="Free forever"
            price={"0"}
            features={["Two Trackers", "Notifications Every 48 Hours"]}
            buttonText={"Upgrade"}
            onButtonPress={""}
            isCurrentPlan
          />
          {plans?.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.name}
              description={plan.description}
              price={plan.price.toString()}
              discountPrice={plan.discountedPrice.toString()}
              features={plan.features}
              buttonText={"Upgrade"}
              onButtonPress={""}
            />
          ))}
        </SimpleGrid>
      </Page.Subsection>
    </Container>
  );
};
