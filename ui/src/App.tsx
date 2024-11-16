import { useState, useEffect } from "react"
import "./MediaPlayer.css"
import IconPlay from "./components/icons/Play"
import IconPause from "./components/icons/Pause"
import IconStepForward from "./components/icons/StepForward"
import IconStepBackward from "./components/icons/StepBackward"
import { getCurrentMediaSong, sendMediaCommand } from "./services/adb"
import { SpectroBars } from "./components/SpectroBars/SpectroBars"

let interval: number
const defaultBackgroundImage =
  "https://cdns-images.dzcdn.net/images/cover/5b7c4f4b5b8e7c2d9a0d6d7c9a4a6f2e/1900x1900-000000-80-0-0.jpg"
let lastMediaState = {
  title: "Unknown Song",
  artist: "Unknown Artist",
  album: "Unknown Album",
  position: 0,
  isPlaying: false,
  cover: defaultBackgroundImage
}

function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(lastMediaState)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (isPlaying) {
      sendMediaCommand("85")
    } else {
      sendMediaCommand("85")
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    interval = setInterval(async () => {
      const songFromAndroid = await getCurrentMediaSong()
      if (
        songFromAndroid &&
        (songFromAndroid.title !== lastMediaState.title || songFromAndroid.isPlaying !== lastMediaState.isPlaying)
      ) {
        lastMediaState = { ...songFromAndroid, cover: songFromAndroid.cover || defaultBackgroundImage }
        setCurrentSong(lastMediaState)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsPlaying(false)
    // Set is playing with a delay to avoid flickering
    setTimeout(() => {
      setIsPlaying(currentSong.isPlaying)
    }, 600)
  }, [currentSong])

  const handleNextSong = () => {
    sendMediaCommand("87")
  }

  const handlePreviousSong = () => {
    sendMediaCommand("88")
  }

  return (
    <div className="music-player">
      {/* Blurred background */}
      <img className="background" style={{ backgroundImage: `url(${currentSong.cover})` }} />

      {/* Fade overlay on top of the background */}
      <div className="fade-overlay"></div>

      <div className="header">
        <img
          src={
            "https://images.seeklogo.com/logo-png/9/2/nissan-logo-png_seeklogo-99770.png?v=638653847060000000"
          }
          alt="Nissan Logo"
          className="nissan-logo"
        />
        <h1 className="nissan-text">ALTIMA</h1>
      </div>

      {/* Content overlay */}
      <div className="content">
        <img src={currentSong.cover} alt="Song Thumbnail" className="thumbnail" />

        {isPlaying && <SpectroBars />}

        <div className="song-info">
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist}</p>
          <small>{currentSong.album}</small>
        </div>

        <div className="controls">
          <button onClick={handlePreviousSong}>
            <IconStepBackward />
          </button>
          <button onClick={togglePlay}>{isPlaying ? <IconPause /> : <IconPlay />}</button>
          <button onClick={handleNextSong}>
            <IconStepForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
