import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DeviceSetupOnboarding from '../components/DeviceSetupOnboarding';

describe('DeviceSetupOnboarding Component', () => {
  it('renders all six steps when visible', () => {
    const onFinish = jest.fn();

    const { getByText } = render(
      <DeviceSetupOnboarding visible={true} onFinish={onFinish} />
    );

    expect(getByText('Step1')).toBeTruthy();
    expect(getByText('Step2')).toBeTruthy();
    expect(getByText('Step3')).toBeTruthy();
    expect(getByText('Step4')).toBeTruthy();
    expect(getByText('Step5')).toBeTruthy();
    expect(getByText('Step6')).toBeTruthy();
  });

  it('calls onFinish when completed', () => {
    const onFinish = jest.fn();

    const { getByTestId } = render(
      <DeviceSetupOnboarding visible={true} onFinish={onFinish} />
    );

    fireEvent(getByTestId('onboarding-component'), 'onDone');
    expect(onFinish).toHaveBeenCalled();
  });
});
