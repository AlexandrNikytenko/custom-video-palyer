import "./App.css";
import { useState, useRef, useEffect } from "react";
import video from "./video/217262_small.mp4";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1); // Начальная скорость воспроизведения
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const appRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgress = () => {
    const value =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    progressRef.current.value = value;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const vol = e.target.value;
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  const handleVolumeToggle = (e) => {
    if (videoRef.current.volume === 0) {
      videoRef.current.volume = 1;
      setVolume(1);
    } else {
      videoRef.current.volume = 0;
      setVolume(0);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else appRef.current.requestFullscreen();
  };

  const skipForward = () => {
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      videoRef.current.duration
    );
    setCurrentTime(videoRef.current.currentTime);
  };

  const skipBackward = () => {
    videoRef.current.currentTime = Math.max(
      videoRef.current.currentTime - 10,
      0
    );
    setCurrentTime(videoRef.current.currentTime);
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  useEffect(() => {
    const video = videoRef.current;

    video.onloadedmetadata = () => {
      setDuration(video.duration);
    };
  }, []);

  return (
    <div className="App" ref={appRef}>
      <div className="video-container">
        <video
          ref={videoRef}
          className="custom-video"
          onClick={togglePlay}
          onTimeUpdate={handleProgress}
          volume={volume}
        >
          <source src={video} type="video/mp4" />
          Ваш браузер не поддерживает видео тег.
        </video>
      </div>
      <div className="controls">
        <div className="options">
          <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
          <input
            ref={progressRef}
            type="range"
            className="progress"
            min="0"
            max="100"
            step="0.1"
            defaultValue="0"
            onChange={handleSeek}
          />

          <button onClick={skipBackward}>⏪ 10 sec</button>
          <button onClick={skipForward}>10 sec ⏩</button>
          <button onClick={toggleFullscreen}>Fullscreen</button>
        </div>

        <div className="playback-rate-controls">
          <span>Speed: </span>
          <button
            onClick={() => changePlaybackRate(0.5)}
            disabled={playbackRate === 0.5}
            style={playbackRate === 0.5 ? {opacity: '0.5'} : {}}
          >
            0.5x
          </button>
          <button
            onClick={() => changePlaybackRate(1)}
            disabled={playbackRate === 1}
            style={playbackRate === 1 ? {opacity: '0.5'} : {}}
          >
            1x (Normal)
          </button>
          <button
            onClick={() => changePlaybackRate(1.5)}
            disabled={playbackRate === 1.5}
            style={playbackRate === 1.5 ? {opacity: '0.5'} : {}}
          >
            1.5x
          </button>
          <button
            onClick={() => changePlaybackRate(2)}
            disabled={playbackRate === 2}
            style={playbackRate === 2 ? {opacity: '0.5'} : {}}
          >
            2x
          </button>
        </div>

        <div className="playback-rate-controls">
          Time: {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="playback-rate-controls">
          Volume:
          <input
            ref={volumeRef}
            type="range"
            className="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <button onClick={handleVolumeToggle}>
            Volume {volume === 1 ? "Off" : "On"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
