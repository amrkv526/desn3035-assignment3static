'use client';

import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../styles/globals.css';

export default function FeaturedSongs() {
  const [currentTrack, setCurrentTrack] = useState('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { title: 'Chlär - Supermarket Hunting', url: '/assets/supermarket.m4a' },
    { title: 'D.Dan - Falling In A Dream', url: '/assets/dream.mp3' },
    { title: 'Stef Mendesidis - Celesta 33', url: '/assets/celesta33.mp3' },
    { title: 'Fadi Mohem - Process', url: '/assets/process.m4a' },
    { title: 'Chlär - Internet Soulmate', url: '/assets/internetsoulmate.m4a' },
    { title: 'D.Dan - Sudan Sedan', url: '/assets/sudansedan.mp3' },
  ];

  const handlePlay = (url: string) => {
    setCurrentTrack(url);

    if (!audioContext) {
      const newAudioContext = new AudioContext();
      const analyserNode = newAudioContext.createAnalyser();
      analyserNode.fftSize = 256;

      if (audioRef.current) {
        const source = newAudioContext.createMediaElementSource(audioRef.current);
        source.connect(analyserNode);
        analyserNode.connect(newAudioContext.destination);

        setAudioContext(newAudioContext);
        setAnalyser(analyserNode);
        visualize(analyserNode);
      }
    } else if (analyser) {
      visualize(analyser);
    }
  };

  const visualize = (analyserNode: AnalyserNode) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ff6f61');
    gradient.addColorStop(1, '#392061');

    const renderFrame = () => {
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      dataArray.forEach((value, index) => {
        const barHeight = (value / 255) * canvas.height;
        const x = index * barWidth;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      });

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="featured-songs content">
        <h1>Featured Songs</h1>
        <h2 className="featured-subheading">Click on a song to play it!</h2>
        <div className="track-list">
          {tracks.map((track, index) => (
            <button
              key={index}
              onClick={() => handlePlay(track.url)}
              className="track-button"
            >
              {track.title}
            </button>
          ))}
        </div>
        <canvas ref={canvasRef} className="audio-visualizer"></canvas>
        <audio ref={audioRef} src={currentTrack} controls className="audio-player" />
      </div>
      <Footer />
    </>
  );
}
