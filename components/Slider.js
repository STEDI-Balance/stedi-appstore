import { StyleSheet } from "react-native";
import ReactNativeSlider from "@react-native-community/slider";
import { customTheme } from "../utils/Constants";

<<<<<<< HEAD

=======
>>>>>>> origin/main
export const Slider = ({ value, onSlidingComplete, min, max, step }) => {
  return (
    <ReactNativeSlider
      step={step}
      style={style.slider}
      minimumValue={min}
      value={value}
      maximumValue={max}
      minimumTrackTintColor={customTheme.colors.secondary}
      maximumTrackTintColor={customTheme.colors.surfaceVariant}
      onValueChange={onSlidingComplete}
    />
  );
};

const style = StyleSheet.create({
  slider: {
    width: "100%",
  },
});