import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SelectField, TextField } from "../../ui";
import { getSchools } from "../../../utils/api/schools";
import { space } from "../../../constants/theme";

const OTHER = "__other__";

/**
 * University picker: the schools HostelHubb operates in, plus "My school
 * isn't listed" with a box to type it. The value saved is the school's code
 * (e.g. "KNUST"), or the typed name for an unlisted school.
 */
export default function UniversityField({ value, onChange, label = "University", hint, error }) {
  const [schools, setSchools] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let alive = true;
    getSchools().then((list) => alive && setSchools(list));
    return () => { alive = false; };
  }, []);

  const options = useMemo(
    () => [
      ...schools.map((s) => ({ value: s.code, label: s.code, subtitle: s.name })),
      { value: OTHER, label: "My school isn't listed" },
    ],
    [schools]
  );

  const listed = schools.some((s) => s.code === value);
  const showOther = typing || (Boolean(value) && schools.length > 0 && !listed);

  const choose = (v) => {
    if (v === OTHER) {
      setTyping(true);
      onChange("");
    } else {
      setTyping(false);
      onChange(v);
    }
  };

  return (
    <View style={{ gap: space.sm }}>
      <SelectField
        label={label}
        sheetTitle="Your university"
        options={options}
        value={showOther ? OTHER : value}
        onChange={choose}
        placeholder="Select your university"
        hint={showOther ? undefined : hint}
        error={showOther ? undefined : error}
      />
      {showOther ? (
        <TextField
          label="School name"
          placeholder="e.g. Accra Technical University"
          value={value}
          onChangeText={onChange}
          autoCapitalize="words"
          hint={hint}
          error={error}
        />
      ) : null}
    </View>
  );
}
