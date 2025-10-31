import { atom, useAtomValue, useSetAtom } from "jotai";

export const userLocationAtom = atom(null);

export function useUserLocation() {
  return useAtomValue(userLocationAtom);
}

export function useSetUserLocation() {
  return useSetAtom(userLocationAtom);
}
