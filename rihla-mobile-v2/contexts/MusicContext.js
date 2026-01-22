import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

// Playlist of songs
const SONGS = [
  require('../assets/songs/f791d7c6-a561-45d7-a97c-69c8c66a0ef9.mp4'),
  require('../assets/songs/Daniel Caesar - Always Lyrics.mp3'),
  require('../assets/songs/HER - Best Part Lyrics Ft Daniel Caesar.mp3'),
  require('../assets/songs/KAYTRANADA - Intimidated Official Audio ft HER.mp3'),
  require('../assets/songs/Frank Ocean - Self Control.mp3'),
];

export function MusicProvider({ children }) {
  const [sound, setSound] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Setup audio mode
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting up audio mode:', error);
      }
    }
    setupAudio();
  }, []);

  // Load and play music
  useEffect(() => {
    async function loadAndPlayMusic() {
      try {
        // Unload previous sound if exists
        if (sound) {
          await sound.unloadAsync();
        }

        // Load new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          SONGS[currentSongIndex],
          { shouldPlay: isPlaying, volume: 0.5 },
          onPlaybackStatusUpdate
        );

        setSound(newSound);
      } catch (error) {
        console.error('Error loading music:', error);
      }
    }

    loadAndPlayMusic();

    // Cleanup function
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSongIndex]);

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      // Move to next song, or loop back to first song
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % SONGS.length);
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      try {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    }
  };

  const skipToNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % SONGS.length);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlayPause, skipToNext, currentSongIndex }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
