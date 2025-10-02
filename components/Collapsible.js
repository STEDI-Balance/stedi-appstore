import { Children, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";



export const Collapsible = ({ open, children, duration = 300 }) => {
  const animatedHeight = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? 1 : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [open, duration]);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight !== height) {
      setContentHeight(height);
    }
  };

  const animatedStyle = {
    height: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, contentHeight || 0],
    }),
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content} onLayout={handleLayout}>
        {children}
      </View>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});