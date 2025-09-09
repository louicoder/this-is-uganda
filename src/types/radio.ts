export interface RadioPlaces {
  size: number;
  skipRide: boolean;
  id: string;
  geo: number[];
  url: string;
  boost: boolean;
  title: string;
  country: string;
}

export type StationProps = {
  url: string;
  type: string;
  place: {
    title: string;
    id: string;
  };
  title: string;
  secure: boolean;
  country: {
    title: string;
    id: string;
  };
  preroll: boolean;
  website: string;
  stream: string;
  id: string;
  streamUrl: string;
};

export type TrackProps = {
  url: string;
  id: string;
  title: string;
  artwork: string;
  artist: string;
  streamUrl: string;
  stream?: string;
  website: string;
};

export type RadioStationResponse = {
  url: string;
  type: string;
  place: {
    id: string;
    title: string;
  };
  title: string;
  secure: boolean;
  country: {
    id: string;
    title: string;
  };
  preroll: boolean;
  website: string;
  stream: string;
  streamUrl: string;
};
