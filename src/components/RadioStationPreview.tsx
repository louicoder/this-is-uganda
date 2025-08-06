import { View, Pressable, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import { TrackProps } from '@/types/radio';
import { activeTrack, radio_stations } from '@/signals/radio';
import { useResponsiveFontSize } from '@/hooks/useDimensions';
import Typography from './Typography';
import { isRadioPlayerVisible } from '@/signals/global';
import { LucideHeart } from 'lucide-react-native';
import { RFVALUE } from '@/constants/index';
import { useTheme } from '@/hooks/useTheme';

type StationProps = {
  item: TrackProps;
  index: number | undefined;
};

const RadioStationPreview: React.FC<StationProps> = ({ item, index }) => {
  const { BOTTOM } = useResponsiveFontSize();
  const { isDarkMode } = useTheme();

  const setActiveTrack = useCallback(
    (track: TrackProps) => {
      if (activeTrack.value?.id !== track?.id) {
        isRadioPlayerVisible.value = true;
        activeTrack.value = track;
      }
    },
    [activeTrack.value?.id],
  );

  return (
    <Pressable
      style={[
        styles.container,
        {
          borderTopWidth: index && index > 0 ? StyleSheet.hairlineWidth : 0,
          marginBottom: index === radio_stations.value?.length - 1 ? BOTTOM + RFVALUE(100) : 0,
          borderColor: '#aaa',
        },
      ]}
      onPress={() => setActiveTrack(item)}
    >
      <View style={{ width: '80%' }}>
        <Typography text={`${item?.title}`} color={isDarkMode ? '#fff' : '#000'} />
        <Typography text={item?.stream ?? item?.website} bold color={'#aaa'} />
        <Typography text={item?.website} bold size={12} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <LucideHeart style={{ marginLeft: RFVALUE(15) }} color="#ff0000" />
      </View>
    </Pressable>
  );
};

export default RadioStationPreview;

const styles = StyleSheet.create({
  container: {
    padding: RFVALUE(10),
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
