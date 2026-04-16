import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

interface RecorderOptions {
  fps?: number;
  quality?: number;
  width?: number;
  height?: number;
}

export function useAvatarRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const framesRef = useRef<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const startRecording = useCallback((element: HTMLDivElement, options: RecorderOptions = {}) => {
    const { fps = 10 } = options;
    targetRef.current = element;
    framesRef.current = [];
    setIsRecording(true);
    setProgress(0);

    const captureFrame = async () => {
      if (!targetRef.current) return;
      try {
        const canvas = await html2canvas(targetRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true,
          width: targetRef.current.offsetWidth,
          height: targetRef.current.offsetHeight,
        });
        framesRef.current.push(canvas.toDataURL("image/png"));
      } catch (err) {
        console.warn("Frame capture failed:", err);
      }
    };

    intervalRef.current = setInterval(captureFrame, 1000 / fps);
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecording(false);
    setIsProcessing(true);

    const frames = framesRef.current;
    if (frames.length === 0) {
      setIsProcessing(false);
      return null;
    }

    try {
      // Create an animated GIF using canvas-based approach
      const firstImg = await loadImage(frames[0]);
      const width = firstImg.width;
      const height = firstImg.height;
      
      // Build a WebM video from frames using MediaRecorder
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(0);
      const recorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType(),
        videoBitsPerSecond: 2_000_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      const done = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: recorder.mimeType }));
        };
      });

      recorder.start();

      for (let i = 0; i < frames.length; i++) {
        const img = await loadImage(frames[i]);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        // @ts-ignore – requestFrame exists on captured streams
        stream.getVideoTracks()[0]?.requestFrame?.();
        setProgress(Math.round(((i + 1) / frames.length) * 100));
        await delay(100); // ~10fps playback
      }

      recorder.stop();
      const blob = await done;
      const url = URL.createObjectURL(blob);

      setIsProcessing(false);
      setProgress(100);
      return url;
    } catch (err) {
      console.error("Video processing failed:", err);
      setIsProcessing(false);
      
      // Fallback: return last frame as image
      if (frames.length > 0) {
        const blob = dataURLtoBlob(frames[frames.length - 1]);
        return URL.createObjectURL(blob);
      }
      return null;
    }
  }, []);

  const downloadRecording = useCallback(async (url: string, filename = "sign-language-avatar") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const cancelRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    framesRef.current = [];
    setIsRecording(false);
    setIsProcessing(false);
    setProgress(0);
  }, []);

  return {
    isRecording,
    isProcessing,
    progress,
    startRecording,
    stopRecording,
    downloadRecording,
    cancelRecording,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getSupportedMimeType(): string {
  const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "video/webm";
}

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}
