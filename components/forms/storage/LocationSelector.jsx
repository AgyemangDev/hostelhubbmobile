import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SelectField, TextField } from "../../ui";
import { space } from "../../../constants/theme";

/**
 * Where to pick up from / deliver to. Points come from the school's
 * storage setup (on-campus halls and off-campus areas). Emits
 * { area, offCampusArea, hostel, room } through onSelectLocation.
 *
 * Choosing "Off campus" shows every field it needs at once (area, hostel
 * name, room number) instead of revealing them one by one.
 *
 * errors:        { area?, offCampusArea?, hostel?, room? } messages to show
 * registerField: (field, viewRef) => void, lets the screen scroll to a field
 */
export default function LocationSelector({
  placeholder,
  value,
  onSelectLocation,
  selectedType = "pickup",
  points = [],
  errors = {},
  registerField,
}) {
  const [area, setArea] = useState(value?.area || null);
  const [offCampusArea, setOffCampusArea] = useState(value?.offCampusArea || null);
  const [hostel, setHostel] = useState(value?.hostel || "");
  const [room, setRoom] = useState(value?.room || "");

  // Keep local state in sync if the parent resets this field externally
  // (e.g. clearing delivery info when "decide later" is enabled).
  useEffect(() => {
    setArea(value?.area || null);
    setOffCampusArea(value?.offCampusArea || null);
    setHostel(value?.hostel || "");
    setRoom(value?.room || "");
  }, [value?.area, value?.offCampusArea, value?.hostel, value?.room]);

  const emit = (next) =>
    onSelectLocation({ area, offCampusArea, hostel: hostel || null, room, ...next });

  const onCampus = points.filter((p) => p.point_type === "on_campus").map((p) => p.name);
  const offCampus = points.filter((p) => p.point_type === "off_campus").map((p) => p.name);
  const areas = [...onCampus, ...(offCampus.length ? ["Off Campus"] : [])];
  const isOff = area === "Off Campus";
  const noun = selectedType === "pickup" ? "Pickup" : "Delivery";

  // collapsable={false} keeps the wrapper as a real native view on Android
  // so the screen can measure it for scroll-to-error.
  const slot = (field) => ({
    collapsable: false,
    ref: (node) => registerField?.(field, node),
  });

  return (
    <View style={{ gap: space.md }}>
      <View {...slot("area")}>
        <SelectField
          label={`${noun} spot`}
          sheetTitle={`${noun} spot`}
          placeholder={placeholder || "Choose a spot"}
          value={area}
          error={errors.area}
          options={areas.map((a) =>
            a === "Off Campus" ? { value: a, label: "Off campus", subtitle: "Private hostel or house near campus" } : a
          )}
          onChange={(a) => {
            setArea(a);
            setOffCampusArea(null);
            setHostel("");
            onSelectLocation({ area: a, offCampusArea: null, hostel: null, room });
          }}
        />
      </View>
      {isOff ? (
        <View {...slot("offCampusArea")}>
          <SelectField
            label="Area"
            sheetTitle="Off-campus area"
            placeholder="Choose your area"
            value={offCampusArea}
            error={errors.offCampusArea}
            options={offCampus}
            onChange={(a) => {
              setOffCampusArea(a);
              emit({ offCampusArea: a });
            }}
          />
        </View>
      ) : null}
      {isOff ? (
        <View {...slot("hostel")}>
          <TextField
            label="Hostel name"
            value={hostel}
            placeholder="e.g. Nana Ama Hostel"
            error={errors.hostel}
            onChangeText={(t) => {
              setHostel(t);
              emit({ hostel: t || null });
            }}
          />
        </View>
      ) : null}
      {area ? (
        <View {...slot("room")}>
          <TextField
            label="Room number"
            value={room}
            placeholder="e.g. B12"
            autoCapitalize="characters"
            error={errors.room}
            onChangeText={(t) => {
              setRoom(t);
              emit({ room: t });
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
