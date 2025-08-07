import { StationProps, TrackProps } from '@/types/radio';
import { signal } from '@preact/signals-react';

export const activePlaceId = signal<string>('');

export const isRadioPlaying = signal<boolean>(false);

// This signal holds the active track being played on the player.
export const activeTrack = signal<TrackProps>({
  url: '',
  id: '',
  title: '',
  artwork: '',
  artist: '',
  streamUrl: '',
  website: '',
});

export const radio_stations = signal<StationProps[]>([]);
