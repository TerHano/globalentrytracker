import { SimpleGrid, Stack, ThemeIcon, Text } from "@mantine/core";
import { Section } from "~/components/ui/layout/section";

export const HowItWorks = () => {
  return (
    <Section
      layout="centered"
      sectionId="howItWorks"
      title="How It Works"
      description="Three simple steps to secure your Global Entry appointment
"
    >
      <SimpleGrid mt="md" cols={{ xs: 1, sm: 3 }} spacing="lg">
        <HowToStep
          step={1}
          label="Create an Account"
          description="Sign up and create your account."
        />
        <HowToStep
          step={2}
          label="Set Preferences"
          description="Select your preferred locations and times."
        />
        <HowToStep
          step={3}
          label="Get Notified"
          description="Receive alerts when slots become available."
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
