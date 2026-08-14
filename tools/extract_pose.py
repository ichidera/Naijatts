"""
extract_pose.py — Extract hand + upper-body landmark sequences from a video
of a real signer, for the NaijaTTS sign language avatar project.

This doesn't need any video to exist yet. It's the tool that turns video
(once you have it) into structured landmark data — the input the "real
pose-data pipeline" task list item calls for, and the format a small
gloss-to-pose model would eventually train on.

Setup (one-time, on a machine with normal internet access):
    pip install mediapipe opencv-python --break-system-packages
    wget -O hand_landmarker.task https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
    wget -O pose_landmarker.task https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task

Usage:
    python extract_pose.py --video path/to/signer.mp4 --word HELLO --out signs/

Output: one JSON file per (video, word) with a per-frame array of hand and
upper-body landmark coordinates, rescaled to the [-1, 1] range that
SignGesture.dominantHand positions already use in useSignLanguage.ts /
SignLanguageAvatar.tsx — so this plugs into the existing data shape instead
of requiring a redesign.

A note on how this was checked: MediaPipe's API changed since a lot of
tutorials/training data were written — the old `mp.solutions.hands` /
`mp.solutions.pose` interface is gone in current mediapipe (0.10.x); it now
lives under `mediapipe.tasks.python.vision`. Every class and field name
below (HandLandmarkerOptions, HandLandmarkerResult.handedness,
NormalizedLandmark.x/y/z, PoseLandmarkerResult.pose_landmarks, etc.) was
confirmed by reading the actually-installed package's source, not assumed
from memory. What ISN'T verified here: real detection against real footage.
The .task model files are hosted on storage.googleapis.com, which this
sandbox's network can't reach, so the ML detection itself is untested on my
end — the video-read/JSON-write plumbing around it is (see the accompanying
note in the chat). Run it against one real clip first and sanity-check the
output before trusting it for the full vocabulary.
"""

import argparse
import json
import os

import cv2
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions, vision

POSE_JOINTS = {
    "L_SHOULDER": 11,
    "R_SHOULDER": 12,
    "L_ELBOW": 13,
    "R_ELBOW": 14,
    "L_WRIST": 15,
    "R_WRIST": 16,
}


def to_signal_range(value: float) -> float:
    """MediaPipe landmarks are normalized to [0, 1] image space.
    SignGesture positions in the existing NaijaTTS code are [-1, 1]."""
    return value * 2 - 1


def build_detectors(hand_model_path: str, pose_model_path: str):
    hand_options = vision.HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=hand_model_path),
        running_mode=vision.RunningMode.VIDEO,
        num_hands=2,
    )
    pose_options = vision.PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=pose_model_path),
        running_mode=vision.RunningMode.VIDEO,
    )
    return (
        vision.HandLandmarker.create_from_options(hand_options),
        vision.PoseLandmarker.create_from_options(pose_options),
    )


def extract(video_path, out_dir, word, hand_model_path, pose_model_path, sample_every=1):
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Could not open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    hand_landmarker, pose_landmarker = build_detectors(hand_model_path, pose_model_path)

    frames = []
    frame_idx = 0
    try:
        while cap.isOpened():
            ok, frame = cap.read()
            if not ok:
                break

            if frame_idx % sample_every == 0:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                timestamp_ms = int(frame_idx / fps * 1000)

                hand_result = hand_landmarker.detect_for_video(mp_image, timestamp_ms)
                pose_result = pose_landmarker.detect_for_video(mp_image, timestamp_ms)

                frame_data = {"frame": frame_idx, "hands": [], "pose": None}

                for handedness, hand_landmarks in zip(hand_result.handedness, hand_result.hand_landmarks):
                    side = handedness[0].category_name  # "Left" / "Right"
                    pts = [
                        {"x": to_signal_range(lm.x), "y": to_signal_range(lm.y), "z": lm.z}
                        for lm in hand_landmarks
                    ]
                    frame_data["hands"].append({"side": side, "landmarks": pts})

                if pose_result.pose_landmarks:
                    lm = pose_result.pose_landmarks[0]
                    frame_data["pose"] = {
                        name: {"x": to_signal_range(lm[i].x), "y": to_signal_range(lm[i].y)}
                        for name, i in POSE_JOINTS.items()
                    }

                frames.append(frame_data)

            frame_idx += 1
    finally:
        cap.release()
        hand_landmarker.close()
        pose_landmarker.close()

    out_path = os.path.join(out_dir, f"{word.upper()}.json")
    with open(out_path, "w") as f:
        json.dump(
            {"word": word.upper(), "source_video": video_path, "frame_count": len(frames), "frames": frames},
            f,
            indent=2,
        )

    return out_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--video", required=True, help="Path to a video of one sign being performed")
    parser.add_argument("--word", required=True, help="The English word/gloss this video demonstrates")
    parser.add_argument("--out", default="signs/", help="Output directory for the JSON file")
    parser.add_argument("--hand-model", default="hand_landmarker.task", help="Path to the downloaded hand_landmarker.task file")
    parser.add_argument("--pose-model", default="pose_landmarker.task", help="Path to the downloaded pose_landmarker.task file")
    parser.add_argument("--sample-every", type=int, default=1, help="Process every Nth frame (2-3 cuts file size on longer clips)")
    args = parser.parse_args()

    written = extract(args.video, args.out, args.word, args.hand_model, args.pose_model, args.sample_every)
    print(f"Wrote {written}")
