import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, LayoutAnimation, Platform, View } from "react-native";

/**
 * Keeps typing areas above the on-screen keyboard on iOS and Android.
 *
 * RN's KeyboardAvoidingView does nothing on Android unless a behavior is set,
 * and Android no longer resizes the window for the keyboard now that apps draw
 * edge to edge, so fields and sheet buttons ended up hidden. This view
 * measures where it sits on screen and pads its bottom by exactly the part the
 * keyboard covers. If the system did resize the window (older Android),
 * nothing is covered and no padding is added, so it never lifts twice.
 *
 * Use it in place of a screen's main content wrapper (it is flex: 1 by
 * default). No offsets needed: it measures its real position.
 */
export default function KeyboardView({ style, children, enabled = true, ...rest }) {
  const ref = useRef(null);
  const keyboard = useRef(null); // last keyboard frame, null when hidden
  const [inset, setInset] = useState(0);

  const update = useCallback(
    (duration) => {
      const kb = keyboard.current;
      const apply = (next) =>
        setInset((prev) => {
          if (Math.abs(prev - next) < 1) return prev;
          if (Platform.OS === "ios" && duration) {
            LayoutAnimation.configureNext({ duration, update: { duration, type: LayoutAnimation.Types.keyboard } });
          }
          return next;
        });
      if (!enabled || !kb) return apply(0);
      ref.current?.measureInWindow((x, y, w, h) => {
        if (h == null) return;
        apply(Math.max(0, y + h - kb.screenY));
      });
    },
    [enabled]
  );

  useEffect(() => {
    const show = Platform.OS === "ios" ? "keyboardWillChangeFrame" : "keyboardDidShow";
    const hide = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subs = [
      Keyboard.addListener(show, (e) => {
        keyboard.current = e.endCoordinates;
        update(e.duration);
      }),
      Keyboard.addListener(hide, (e) => {
        keyboard.current = null;
        update(e?.duration);
      }),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [update]);

  useEffect(() => {
    update(0);
  }, [enabled, update]);

  return (
    <View ref={ref} style={[{ flex: 1 }, style, inset ? { paddingBottom: inset } : null]} {...rest}>
      {children}
    </View>
  );
}
