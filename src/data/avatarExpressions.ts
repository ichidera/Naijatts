// Enhanced facial expressions for sign language avatar
export const facialExpressions: Record<string, { 
  eyebrows: string; mouth: string; eyes: string;
  leftPupilOffset?: { x: number; y: number };
  rightPupilOffset?: { x: number; y: number };
  mouthFill?: boolean;
}> = {
  neutral: { 
    eyebrows: "M70 75 Q80 72 90 75 M110 75 Q120 72 130 75", 
    mouth: "M80 130 Q100 130 120 130", 
    eyes: "M75 90 Q85 88 95 90 M105 90 Q115 88 125 90" 
  },
  smile: { 
    eyebrows: "M70 72 Q80 68 90 72 M110 72 Q120 68 130 72", 
    mouth: "M75 125 Q100 142 125 125", 
    eyes: "M76 88 Q85 82 94 88 M106 88 Q115 82 124 88" 
  },
  big_smile: {
    eyebrows: "M68 70 Q80 64 92 70 M108 70 Q120 64 132 70",
    mouth: "M72 124 Q100 148 128 124",
    eyes: "M76 86 Q85 80 94 86 M106 86 Q115 80 124 86",
    mouthFill: true,
  },
  serious: { 
    eyebrows: "M70 70 Q80 75 90 70 M110 70 Q120 75 130 70", 
    mouth: "M82 132 Q100 128 118 132", 
    eyes: "M75 92 Q85 90 95 92 M105 92 Q115 90 125 92" 
  },
  questioning: { 
    eyebrows: "M70 78 Q80 72 90 66 M110 68 Q120 72 130 78", 
    mouth: "M82 128 Q100 134 118 128", 
    eyes: "M75 90 Q85 88 95 90 M105 90 Q115 88 125 90",
    leftPupilOffset: { x: 2, y: -1 },
    rightPupilOffset: { x: 2, y: -1 },
  },
  surprised: { 
    eyebrows: "M70 62 Q80 55 90 62 M110 62 Q120 55 130 62", 
    mouth: "M88 126 Q100 140 112 126 Q100 144 88 126", 
    eyes: "M72 88 Q85 80 98 88 M102 88 Q115 80 128 88",
    mouthFill: true,
  },
  sad: {
    eyebrows: "M72 72 Q80 76 90 78 M110 78 Q120 76 128 72",
    mouth: "M80 134 Q100 126 120 134",
    eyes: "M76 92 Q85 90 94 92 M106 92 Q115 90 124 92",
  },
  focused: {
    eyebrows: "M68 72 Q80 69 92 72 M108 72 Q120 69 132 72",
    mouth: "M84 130 Q100 130 116 130",
    eyes: "M78 90 Q85 89 92 90 M108 90 Q115 89 122 90",
  },
  emphatic: {
    eyebrows: "M66 68 Q80 62 94 68 M106 68 Q120 62 134 68",
    mouth: "M76 126 Q100 140 124 126",
    eyes: "M74 86 Q85 82 96 86 M104 86 Q115 82 126 86",
    mouthFill: true,
  },
  angry: {
    eyebrows: "M70 78 Q80 70 92 68 M108 68 Q120 70 130 78",
    mouth: "M82 134 Q100 130 118 134",
    eyes: "M76 92 Q85 88 94 90 M106 90 Q115 88 124 92",
  },
  thinking: {
    eyebrows: "M70 72 Q80 68 90 72 M108 66 Q118 62 130 66",
    mouth: "M84 130 Q92 130 100 132 Q108 130 116 130",
    eyes: "M76 90 Q85 88 94 90 M106 88 Q115 86 124 88",
    leftPupilOffset: { x: -2, y: -1 },
    rightPupilOffset: { x: -2, y: -1 },
  },
  excited: {
    eyebrows: "M66 66 Q80 58 94 66 M106 66 Q120 58 134 66",
    mouth: "M72 122 Q100 150 128 122",
    eyes: "M74 84 Q85 78 96 84 M104 84 Q115 78 126 84",
    mouthFill: true,
  },
  concerned: {
    eyebrows: "M72 74 Q80 70 88 72 M112 72 Q120 70 128 74",
    mouth: "M82 132 Q100 128 118 132",
    eyes: "M76 90 Q85 88 94 90 M106 90 Q115 88 124 90",
  },
};
