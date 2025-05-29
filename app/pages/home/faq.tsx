import { Accordion, Text } from "@mantine/core";
import { Section } from "~/components/ui/layout/section";
import { useFAQ } from "~/hooks/useFAQ";

export const FAQ = () => {
  const { data: faq } = useFAQ();
  return (
    <Section
      layout="centered"
      sectionId="faq"
      title="Frequently Asked Questions"
      description="Answers to common questions about our service."
    >
      <Accordion mt="md" variant="separated">
        {faq?.map((item) => (
          <Accordion.Item key={item.id} value={item.id.toString()}>
            <Accordion.Control>
              <Text fw="bold">{item.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>{item.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Section>
  );
};
