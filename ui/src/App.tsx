import React, { useState, useEffect } from 'react';
import './MediaPlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconPlay from './components/icons/Play';
import IconPause from './components/icons/Pause';
import IconStepForward from './components/icons/StepForward';
import IconStepBackward from './components/icons/StepBackward';
import { getAndroidDevices, getCurrentMediaSong } from './services/adb';

function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState({
    title: "Unknown Song",
    artist: "Unknown Artist",
    album: "Unknown Album",
    position: 0
  });

  const [backgroundImage, setBackgroundImage] = useState("https://cdns-images.dzcdn.net/images/cover/5b7c4f4b5b8e7c2d9a0d6d7c9a4a6f2e/1900x1900-000000-80-0-0.jpg");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const interval = setInterval(async () => {
      const songFromAndroid = await getCurrentMediaSong()
      if (songFromAndroid && songFromAndroid.title !== currentSong.title) {
        setCurrentSong(songFromAndroid);
        setBackgroundImage(`https://picsum.photos/seed/${Math.random()}/512/512`);
        setIsPlaying(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentSong]);

  const progressPercentage = (currentTime / duration) * 100;

  const handleNextSong = () => {
    setCurrentTime(0);
  }

  const handlePreviousSong = () => {
    setCurrentTime(0);
  }

  return (
    <div className="music-player">
      {/* Blurred background */}
      <img
        className="background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Fade overlay on top of the background */}
      <div className="fade-overlay"></div>

      <div className="header">
        <img
          src={"https://images.seeklogo.com/logo-png/9/2/nissan-logo-png_seeklogo-99770.png?v=638653847060000000"}
          alt="Nissan Logo"
          className="nissan-logo"
        />
        <h1 className="nissan-text">ALTIMA</h1>
      </div>

      {/* Content overlay */}
      <div className="content">
        <img src={backgroundImage} alt="Song Thumbnail" className="thumbnail" />

        <div className="song-info">
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist}</p>
          <small>{currentSong.album}</small>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
          <div className="current-time">{currentTime}</div>
        </div>

        <div className="controls">
          <button onClick={handleNextSong}><IconStepBackward /></button>
          <button onClick={togglePlay}>{isPlaying ? <IconPause /> : <IconPlay />}</button>
          <button onClick={handlePreviousSong}><IconStepForward /></button>
        </div>

      </div>
    </div>
  );
}

export default MusicPlayer;
