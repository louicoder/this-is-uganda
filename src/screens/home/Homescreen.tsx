import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Moon, Sun} from 'lucide-react-native';
import {Haptics} from 'react-native-nitro-haptics';
import {Typography} from '@/components';
import Config from 'react-native-config';
import {useTheme} from '@/hooks/useTheme';

const Home = () => {
  const {toggleTheme, isDarkMode} = useTheme();

  const toggleThemeHandler = () => {
    Haptics.impact('heavy');
    toggleTheme();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? 'black' : 'white'},
      ]}>
      <Typography
        style={[styles.title, {color: isDarkMode ? 'white' : 'black'}]}
        text="This is Uganda"
        underline
        bold
      />

      <Typography style={[styles.subtitle]} text="Coming soon..." />

      <TouchableOpacity
        onPress={toggleThemeHandler}
        style={styles.buttonContainer}>
        {!isDarkMode ? (
          <Moon size={30} color={'black'} />
        ) : (
          <Sun size={30} color={'black'} />
        )}
      </TouchableOpacity>

      <Typography
        text={
          "Discover the beauty and richness of Uganda like never before with our app, a vibrant digital gateway to the heart of East Africa. Explore stunning landscapes, uncover hidden gems, and dive into the rich cultural heritage that makes Uganda unique. \n\nWhether you're looking to visit breathtaking national parks, experience diverse traditions, or learn about the country's history, our app brings Uganda's spirit to your fingertips. Ready to embark on a journey of discovery? Uganda awaits."
        }
        style={{color: isDarkMode ? 'white' : 'black', marginTop: 40}}
        align="center"
      />

      <Typography
        text={Config.LINK}
        style={{color: isDarkMode ? 'orange' : 'blue', marginTop: 40}}
        align="center"
        underline>
        <Typography text={'\n\nhttps://instagram.com/louicoder'} underline />
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
});

export default Home;
