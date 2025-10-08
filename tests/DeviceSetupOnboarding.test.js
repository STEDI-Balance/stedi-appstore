import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DeviceSetupOnboarding from "../components/DeviceSetupOnboarding";

jest.mock("react-native-onboarding-swiper", () => {
  const React = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockedOnboarding({ pages = [], onDone, onSkip, testID }) {
    return (
      <View testID={testID}>
        {pages.map((p, i) => (
          <View key={i}>{p.image || null}</View>
        ))}
        <Pressable onPress={onSkip}>
          <Text>Skip</Text>
        </Pressable>
        <Pressable onPress={onDone}>
          <Text>Done</Text>
        </Pressable>
      </View>
    );
  };
});

describe("DeviceSetupOnboarding (modern UI)", () => {
  it("renders the three panels (Checking / Setup / Find)", () => {
    const { getByText } = render(
      <DeviceSetupOnboarding visible={true} onFinish={() => {}} />
    );

    expect(getByText("Checking Device")).toBeTruthy();
    expect(getByText("Setup Device")).toBeTruthy();
    expect(getByText("Find Device")).toBeTruthy();

    expect(getByText(/let.?s set up your device!/i)).toBeTruthy();
  });

  it("enables Save after entering Device ID and calls onFinish", () => {
    const onFinish = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <DeviceSetupOnboarding visible={true} onFinish={onFinish} />
    );

    const input = getByPlaceholderText("eg. MN-145-U89010");
    fireEvent.changeText(input, "MN-145-U89010");

    fireEvent.press(getByText("Save"));
    expect(onFinish).toHaveBeenCalledTimes(1);

    const payload = onFinish.mock.calls[0][0];
    expect(payload).toHaveProperty("hasDevice");
    expect(payload).toHaveProperty("deviceId", "MN-145-U89010");
  });

  it("hides completely when not visible", () => {
    const { queryByTestId, queryByText } = render(
      <DeviceSetupOnboarding visible={false} onFinish={() => {}} />
    );
    expect(queryByTestId("onboarding-component")).toBeNull();
    expect(queryByText("Checking Device")).toBeNull();
  });

  it("fires finish when pressing Done (from swiper controls)", () => {
    const onFinish = jest.fn();
    const { getByText } = render(
      <DeviceSetupOnboarding visible={true} onFinish={onFinish} />
    );
    fireEvent.press(getByText("Done"));
    expect(onFinish).toHaveBeenCalled();
  });
});
