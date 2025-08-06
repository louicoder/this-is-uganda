import { View, StatusBar } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getRadioChannels } from '@/requests/radio';
import { useSignal } from '@preact/signals-react';
import { LegendList } from '@legendapp/list';
import Typography from './Typography';
import { useSignals } from '@preact/signals-react/runtime';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RadioStationsList from './RadioStationsList';
import Modal from 'react-native-modal';
import { TrackProps } from '@/types/radio';
import { activeTrack, isRadioPlaying, radio_stations } from '@/signals/radio';
import RadioStationPreview from './RadioStationPreview';
import { useTheme } from '@/hooks/useTheme';
import { RFVALUE } from '@/constants/index';
import { useFocusEffect } from '@react-navigation/native';
import { isRadioPlayerVisible } from '@/signals/global';
import { AudioWaveform } from 'lucide-react-native';

const Radios: React.FC = ({ navigation }) => {
  useSignals();
  const { top: TOP, bottom: BOTTOM } = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const placeId = useSignal('');
  const visible = useSignal(false);

  useFocusEffect(
    useCallback(() => {
      if (activeTrack.value?.id !== '') isRadioPlayerVisible.value = true;

      // ✅ Cleanup function
      return () => {
        isRadioPlayerVisible.value = false;
      };
    }, []),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <>
          <View style={{ height: TOP, backgroundColor: isDarkMode ? '#000' : '#eee' }} />
          <View
            style={{
              height: RFVALUE(50),
              backgroundColor: isDarkMode ? '#000' : '#eee',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: RFVALUE(10),
            }}
          >
            <AudioWaveform style={{ marginRight: RFVALUE(10) }} color={isDarkMode ? '#fff' : '#000'} />
            <Typography text="Radio" size={16} color={isDarkMode ? '#fff' : '#000'} />
          </View>
        </>
      ),
    });
  }, [navigation, isDarkMode]);

  const getRadioChannelsHandler = () => {
    try {
      getRadioChannels({
        callback: res => {
          // log here
        },
      });
    } catch (error) {
      // console.log('XXXXX')
    }
  };

  useEffect(() => {
    if (!radio_stations.value?.length) getRadioChannelsHandler();
  }, []);

  const renderItem = useCallback(({ item, index }: { item: TrackProps; index: number | undefined }) => {
    return <RadioStationPreview index={index} item={item} />;
  }, []);

  const keyExtractor = useCallback((item: TrackProps) => item?.id, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <LegendList
          data={[...radio_stations.value?.sort((a, b) => a.title?.localeCompare(b?.title))]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          recycleItems
          // onScrollBeginDrag={onScrollBeginDrag}
        />
      </View>
    </View>
  );
};

export default Radios;
