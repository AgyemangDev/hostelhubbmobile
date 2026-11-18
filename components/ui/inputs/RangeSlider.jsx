import React from "react";
import { StyleSheet, View } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import SectionHeader from "../headers/SectionHeader";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

/**
 * Two-handle range slider with a title and the selected range under it.
 * value: [low, high]; format(n) turns a number into display text.
 */
export default function RangeSlider({ label, value, onChange, min, max, step = 1, format = String, style }) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <SectionHeader title={label} /> : null}
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={colors.text}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.text}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
      />
      <Text variant="bodyStrong">
        {format(value[0])} — {format(value[1])}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  track: { height: 5, borderRadius: 3 },
  thumb: { height: 22, width: 22, borderRadius: 11 },
});
