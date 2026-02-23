import { SimpleGrid, Stack, ThemeIcon, Text } from "@mantine/core";
import { Section } from "~/components/ui/layout/section";

export const HowItWorks = () => {
  return (
    <Section
      layout="centered"
      sectionId="howItWorks"
      title="How It Works"
      description="Set your preferences once, and we continuously check for earlier Global Entry appointments that match what you want."
    >
      <SimpleGrid mt="md" cols={{ xs: 1, sm: 3 }} spacing="lg">
        <HowToStep
          step={1}
          label="Create an Account"
          description="Sign up in minutes to save your trackers and notification settings in one place."
        />
        <HowToStep
          step={2}
          label="Add Your Tracker"
          description="Choose your interview location, notification type, and the latest appointment date you are willing to accept."
        />
        <HowToStep
          step={3}
          label="Get Notified"
          description="We monitor appointment availability and send alerts when an earlier qualifying slot opens so you can book it fast."
        />
      </SimpleGrid>
    </Section>
  );
};

const HowToStep = ({
  step,
  label,
  description,
}: {
  step: number;
  label: string;
  description: string;
}) => {
  return (
    <Stack justify="start" align="center" gap="xs">
      <ThemeIcon size="xl" radius="xl" variant="light">
        <Text fw={800}>{step}</Text>
      </ThemeIcon>
      <Text ta="center" span fw={800} lh="1em" fz="1.5rem">
        {label}
      </Text>
      <Text ta="center" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
};
