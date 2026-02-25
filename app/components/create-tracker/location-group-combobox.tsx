import {
  Combobox,
  InputBase,
  Stack,
  Text,
  Input,
  Group,
  useCombobox,
} from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import type { components } from "~/types/api";
import { Search } from "lucide-react";

type Location = components["schemas"]["AppointmentLocationDto"];

interface LocationGroupComboboxProps {
  locations: Location[] | undefined;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export const LocationGroupCombobox = ({
  locations,
  value,
  onChange,
  placeholder = "Search airports",
}: LocationGroupComboboxProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("selected"),
  });

  const [searchValue, setSearchValue] = useState("");
  const [cachedSelectedLocation, setCachedSelectedLocation] =
    useState<Location | null>(null);

  // Build a map of locations for quick lookup
  const locationMap = useMemo(() => {
    if (!locations) return {};
    const map: Record<string, Location> = {};
    locations.forEach((location) => {
      map[location.id.toString()] = location;
    });
    return map;
  }, [locations]);

  // Update cached location when value changes
  useEffect(() => {
    if (value && value !== "" && locations) {
      const found = locations.find(
        (location) => location.id.toString() === value,
      );
      if (found) {
        setCachedSelectedLocation(found);
      }
    } else if (!value || value === "") {
      setCachedSelectedLocation(null);
    }
  }, [value, locations]);

  // Group locations by state
  const groupedLocations = useMemo(() => {
    if (!locations) return {};

    const groups: Record<string, Location[]> = {};
    locations.forEach((location) => {
      const state = location.state || "Unknown";
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state]!.push(location);
    });
    return groups;
  }, [locations]);

  // Filter and search
  const filteredGroups = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    const filtered: Record<string, Location[]> = {};

    Object.entries(groupedLocations).forEach(([state, stateLocations]) => {
      const matchingLocations = stateLocations.filter(
        (location) =>
          location.city.toLowerCase().includes(searchLower) ||
          location.name.toLowerCase().includes(searchLower) ||
          state.toLowerCase().includes(searchLower),
      );
      if (matchingLocations.length > 0) {
        filtered[state] = matchingLocations;
      }
    });
    return filtered;
  }, [groupedLocations, searchValue]);

  const selectedLocation =
    (value && value !== "" && (locationMap[value] || cachedSelectedLocation)) ||
    cachedSelectedLocation ||
    null;

  // Build option elements with grouping
  const options = Object.entries(filteredGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, stateLocations]) => (
      <Combobox.Group label={state} key={state}>
        {stateLocations.map((location) => (
          <Combobox.Option
            value={location.id.toString()}
            key={location.id}
            active={value === location.id.toString()}
          >
            <LocationOption location={location} />
          </Combobox.Option>
        ))}
      </Combobox.Group>
    ));

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      onOptionSubmit={(val) => {
        // Update cache immediately
        const selected = locations?.find((l) => l.id.toString() === val);
        if (selected) {
          setCachedSelectedLocation(selected);
        }
        // Then call parent's onChange
        onChange(val);
        setSearchValue("");
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          styles={{
            input: {
              height: "auto",
              minHeight: "3.25rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
            },
          }}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          aria-haspopup="listbox"
          aria-expanded={combobox.dropdownOpened}
        >
          {selectedLocation ? (
            <SelectedLocationDisplay location={selectedLocation} />
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown
        style={{ maxHeight: 300, overflowY: "auto" }}
        onMouseDown={(e) => {
          // Prevent blur of the trigger button (keeps dropdown open on iOS touch),
          // but allow the search input itself to receive focus normally on desktop.
          if ((e.target as HTMLElement).tagName !== "INPUT") {
            e.preventDefault();
          }
        }}
      >
        <Combobox.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          placeholder={placeholder}
          leftSection={<Search size={14} />}
          styles={{ input: { fontSize: "16px" } }}
        />
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

const LocationOption = ({ location }: { location: Location }) => {
  return (
    <Group justify="space-between" gap="sm">
      <Stack gap={0}>
        <Text fw={500} size="sm">
          {location.city}
        </Text>
        <Text size="xs" opacity={0.7}>
          {location.name}
        </Text>
      </Stack>
      <Text size="xs" c="gray">
        {location.state}
      </Text>
    </Group>
  );
};

const SelectedLocationDisplay = ({ location }: { location: Location }) => {
  return (
    <div style={{ width: "100%", textAlign: "left" }}>
      <Text fw={600} size="sm" lineClamp={1}>
        {location.city}, {location.state}
      </Text>
      <Text size="xs" opacity={0.7} lineClamp={1}>
        {location.name}
      </Text>
    </div>
  );
};
