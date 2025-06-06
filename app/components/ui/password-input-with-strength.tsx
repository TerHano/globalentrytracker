import { Popover, Progress, Text, Box } from "@mantine/core";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

export const PasswordInputWithStrength = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const [popoverOpened, setPopoverOpened] = useState(false);

  const requirements = useMemo(
    () => [
      { re: /[0-9]/, label: "Includes number" },
      { re: /[a-z]/, label: "Includes lowercase letter" },
      { re: /[A-Z]/, label: "Includes uppercase letter" },
      { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
    ],
    []
  );

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(requirements, value);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          {children}
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />
        <PasswordRequirement
          label="Includes at least 6 characters"
          meets={value.length > 5}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
};

type PasswordRequirement = {
  re: RegExp;
  label: string;
};

const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <Check size={14} /> : <X size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};

const getStrength = (requirements: PasswordRequirement[], password: string) => {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};
