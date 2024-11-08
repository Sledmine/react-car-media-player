import React, { useState, useEffect } from 'react';
import './MediaPlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconPlay from './components/icons/Play';
import IconPause from './components/icons/Pause';
import IconStepForward from './components/icons/StepForward';
import IconStepBackward from './components/icons/StepBackward';

function MusicPlayer() {
  const [songs, setSongs] = useState([
    {
      title: "One X",
      artist: "Three Days Grace",
      album: "One X",
      thumbnail: "https://cdns-images.dzcdn.net/images/cover/40ee194a256aad119746d7718b66977b/1900x1900-000000-80-0-0.jpg",
      duration: 180,
    },
    {
      title: "In The End",
      artist: "Linkin Park",
      album: "Hybrid Theory",
      thumbnail: "https://cdns-images.dzcdn.net/images/cover/033a271b5ec10842c287827c39244fb5/1900x1900-000000-80-0-0.jpg",
      duration: 180,
    },
    {
      title: "Unknown Song",
      artist: "Unknown Artist",
      album: "Unknown Album",
      thumbnail: "https://cdns-images.dzcdn.net/images/cover/5b7c4f4b5b8e7c2d9a0d6d7c9a4a6f2e/1900x1900-000000-80-0-0.jpg",
      duration: 180,
    },
  ]);

  const [currentSong, setCurrentSong] = useState(songs[0]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Simulate song progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => (prevTime < currentSong.duration ? prevTime + 1 : prevTime));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const progressPercentage = (currentTime / currentSong.duration) * 100;

  const currentSongIndex = songs.findIndex((song) => song.title === currentSong.title);

  const handleNextSong = () => {
    const nextSongIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSong(songs[nextSongIndex]);
    setCurrentTime(0);
  }

  const handlePreviousSong = () => {
    const nextSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[nextSongIndex]);
    setCurrentTime(0);
  }

  return (
    <div className="music-player">
      {/* Blurred background */}
      <div
        className="background"
        style={{ backgroundImage: `url(${currentSong.thumbnail})` }}
      />

      {/* Fade overlay on top of the background */}
      <div className="fade-overlay"></div>

      <div className="header">
        <img
          src="https://images.seeklogo.com/logo-png/9/2/nissan-logo-png_seeklogo-99770.png?v=638653847060000000"
          alt="Nissan Logo"
          className="nissan-logo"
        />
        <h1 className="nissan-text">ALTIMA</h1>
      </div>

      {/* Content overlay */}
      <div className="content">
        <img src={currentSong.thumbnail} alt="Song Thumbnail" className="thumbnail" />

        <div className="song-info">
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist}</p>
          <small>{currentSong.album}</small>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="controls">
          <button onClick={handleNextSong}><IconStepBackward/></button>
          <button onClick={togglePlay}>{isPlaying ? <IconPause /> : <IconPlay />}</button>
          <button onClick={handlePreviousSong}><IconStepForward /></button>
        </div>

      </div>
    </div>
  );
}

export default MusicPlayer;
