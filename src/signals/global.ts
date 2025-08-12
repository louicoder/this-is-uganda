import { signal } from '@preact/signals-react';

// This signal is responsible for the visiblity of the radio player
export const isRadioPlayerVisible = signal<boolean>(false);

export const TAB_BAR_HEIGHT = signal<number>(0);

// This is a network signal responsible for tracking if the user is
// connected to the internet or not
export const isConnected = signal<boolean | null>(true);
