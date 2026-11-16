import { Dispatch, SetStateAction } from "react";

export type SerializablePrimitive = number | string | boolean;

export type SerializableValue =
  | SerializablePrimitive
  | SerializablePrimitive[]
  | Record<string | number, SerializablePrimitive>;

export type UseStateFromHistoryProps<T> = {
  fromHistory<T>(value: SerializableValue | undefined): T | undefined;
  defaultValue: T;
  prop: string | symbol | number;
};

export type UseStateFromHistoryReturn<T> = [T, Dispatch<SetStateAction<T>>];

export function getStateFromHistory<T>(
  state: object | undefined | null,
  props: UseStateFromHistoryProps<T>,
): T;

export default function useStateFromHistory<T>(
  props: UseStateFromHistoryProps<T>,
): UseStateFromHistoryReturn<T>;
