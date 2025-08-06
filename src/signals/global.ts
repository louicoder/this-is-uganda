import { signal } from '@preact/signals-react';

// This signal is responsible for the visiblity of the radio player
export const isRadioPlayerVisible = signal<boolean>(false);

export const TAB_BAR_HEIGHT = signal<number>(0);
