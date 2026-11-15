import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SelectField, TextField } from "../ui/ds";
import { space } from "../../constants/theme";

/**
 * Where to pick up from / deliver to. Points come from the school's
 * storage setup (on-campus halls and off-campus areas). Emits
 * { area, offCampusArea, hostel, room } through onSelectLocation.
 */
export default function LocationSelector({ placeholder, value, onSelectLocation, selectedType = "pickup", points = [] }) {
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
  const showRoom = area && (!isOff || (offCampusArea && hostel));
  const noun = selectedType === "pickup" ? "Pickup" : "Delivery";

  return (
    <View style={{ gap: space.md }}>
      <SelectField
        label={`${noun} spot`}
        sheetTitle={`${noun} spot`}
        placeholder={placeholder || "Choose a spot"}
        value={area}
        options={areas.map((a) => (a === "Off Campus" ? { value: a, label: "Off campus", subtitle: "Choose your area next" } : a))}
        onChange={(a) => {
          setArea(a);
          setOffCampusArea(null);
          setHostel("");
          if (a !== "Off Campus") onSelectLocation({ area: a, offCampusArea: null, hostel: null, room });
        }}
      />
      {isOff ? (
        <SelectField
          label="Area"
          sheetTitle="Off-campus area"
          placeholder="Choose your area"
          value={offCampusArea}
          options={offCampus}
          onChange={(a) => {
            setOffCampusArea(a);
            emit({ offCampusArea: a });
          }}
        />
      ) : null}
      {isOff && offCampusArea ? (
        <TextField
          label="Hostel name"
          value={hostel}
          placeholder="e.g. Nana Ama Hostel"
          onChangeText={(t) => {
            setHostel(t);
            if (t) emit({ hostel: t });
          }}
        />
      ) : null}
      {showRoom ? (
        <TextField
          label="Room number"
          value={room}
          placeholder="e.g. B12"
          autoCapitalize="characters"
          onChangeText={(t) => {
            setRoom(t);
            emit({ room: t });
          }}
        />
      ) : null}
    </View>
  );
}
