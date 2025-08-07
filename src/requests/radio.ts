import { MMKV_STORAGE, RADIO_BASE_URL } from '@/constants/index';
import { radio_stations } from '@/signals/radio';
import { RadioStationResponse, StationProps } from '@/types/radio';
import axios, { AxiosError } from 'axios';

type RadioProps = {
  callback: (arg: { success: boolean; result: RadioStationResponse[] | string | null }) => void;
};

export const getRadioChannels = async ({ callback }: RadioProps): Promise<void> => {
  try {
    const response = await axios.get(`${RADIO_BASE_URL}/ara/content/places`);

    const places = response.data?.data?.list?.filter(r => r?.country === 'Uganda');
    const filtered = places?.map(r => r?.id);
    const promises = filtered?.map(r => getStations(r));

    const stations = (await Promise.all(promises))
      ?.reduce((p, c) => [...p, ...(c?.data?.content?.[0]?.items || [])], [])
      ?.map(r => ({
        ...r?.page,
        id: r?.page?.url,
        url: `${RADIO_BASE_URL}/ara/content/listen/${r?.page?.url?.split('/').pop()}/channel.mp3`,
        artwork: r?.page?.website,
        artist: r?.page?.title,
      }));

    MMKV_STORAGE.set('STATIONS', JSON.stringify(stations));
    radio_stations.value = stations;
    callback({ success: true, result: stations });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      callback({ success: false, result: error.message });
    } else {
      callback({ success: false, result: 'An unknown error occurred.' });
    }
  }
};

export const getStations = async (placeId: string): Promise<void> => {
  try {
    const response = await axios.get(`${RADIO_BASE_URL}/ara/content/page/${placeId}/channels`);
    return response.data;
  } catch (error) {
    // console.log('ERRORR', error?.message);
  }
};
