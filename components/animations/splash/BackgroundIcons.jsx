
import React from "react";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const hostelIcons = [
  { icon: "bed", lib: FontAwesome5 },
  { icon: "door-closed", lib: FontAwesome5 },
  { icon: "wifi", lib: MaterialCommunityIcons },
  { icon: "chair-school", lib: MaterialCommunityIcons },
  { icon: "shower", lib: MaterialCommunityIcons },
  { icon: "lock", lib: FontAwesome5 },
];

const BackgroundIcons = () => {
  return (
    <>
      {hostelIcons.map((item, index) => {
        const IconLib = item.lib;
        const top = Math.random() * 100 + "%";
        const left = Math.random() * 100 + "%";

        return (
          <IconLib
            key={index}
            name={item.icon}
            size={50}
            color="rgba(97,11,12,0.05)"
            style={{ position: "absolute", top, left }}
          />
        );
      })}
    </>
  );
};

export default BackgroundIcons;