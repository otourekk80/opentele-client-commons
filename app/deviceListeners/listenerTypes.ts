export interface EventWrapper {
    type: string;
    device?: Device;
}

export interface Device {
    systemId: string;
}

export interface Event {
    type: string;
}

export interface StatusEvent extends Event {
    message: string;
}

export interface MeasurementEvent extends Event {
    value: any;
}

export interface BloodPressureEvent extends Event {
    value: BloodPressure;
}

export interface BloodPressure {
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
}

export interface PulseEvent extends Event {
    value: Pulse;
}

export type Pulse = number;

export interface SaturationEvent extends Event {
    value: Saturation;
}

export type Saturation = number;

export interface WeightEvent extends Event {
    value: Weight;
}

export type Weight = number;

export interface TemperatureEvent extends Event {
    value: Temperature;
}

export type Temperature = number;

export interface DeviceEventHandler {
    (model: any, event : MeasurementEvent): void;
}

export interface EventListener {
    (model: any, event: EventWrapper, measurementHandler: DeviceEventHandler) : void;
}

export interface DeviceListener {
    overrideStatusEventHandler(eventType: string, handler: DeviceEventHandler): void;
    eventListener: EventListener;
}
