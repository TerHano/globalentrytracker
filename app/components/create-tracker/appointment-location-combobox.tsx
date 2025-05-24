// import {
//   useCombobox,
//   Combobox,
//   InputBase,
//   Stack,
//   Text,
//   Input,
// } from "@mantine/core";
// import { useState } from "react";
// import type { Location } from "~/api/location-api";

// export const AppointmentLocationCombobox = ({
//   locations,
// }: {
//   locations: Location[];
// }) => {
//   const combobox = useCombobox({
//     onDropdownClose: () => combobox.resetSelectedOption(),
//   });

//   const [value, setValue] = useState<string | null>(null);
//   const selectedOption = locations.find((item) => item.value === value);

//   const options = locations.map((item) => (
//     <Combobox.Option value={item.value} key={item.value}>
//       <SelectOption {...item} />
//     </Combobox.Option>
//   ));

//   return (
//     <Combobox
//       store={combobox}
//       withinPortal={false}
//       onOptionSubmit={(val) => {
//         setValue(val);
//         combobox.closeDropdown();
//       }}
//     >
//       <Combobox.Target>
//         <InputBase
//           component="button"
//           type="button"
//           pointer
//           rightSection={<Combobox.Chevron />}
//           onClick={() => combobox.toggleDropdown()}
//           rightSectionPointerEvents="none"
//           multiline
//         >
//           {selectedOption ? (
//             <SelectOption {...selectedOption} />
//           ) : (
//             <Input.Placeholder>Pick value</Input.Placeholder>
//           )}
//         </InputBase>
//       </Combobox.Target>

//       <Combobox.Dropdown>
//         <Combobox.Options>{options}</Combobox.Options>
//       </Combobox.Dropdown>
//     </Combobox>
//   );
// };

// const SelectOption = ({ name, city }: { name: string; city: string }) => {
//   return (
//     <Stack>
//       <Text fz="sm" fw={500}>
//         {city}
//       </Text>
//       <Text fz="xs" opacity={0.6}>
//         {name}
//       </Text>
//     </Stack>
//   );
// };
