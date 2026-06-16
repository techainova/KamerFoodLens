import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, Text as SvgText, G, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function KFLLogo({ size = 56 }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;

  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* White outline circle */}
      <Circle cx={50} cy={50} r={48} fill="white" />

      {/* Orange outer ring */}
      <Circle cx={50} cy={50} r={46} fill="#E8591A" />
      {/* Inner cream ring */}
      <Circle cx={50} cy={50} r={42} fill="#FFFAF5" />

      {/* Gold/yellow arcs at top — two concentric arcs */}
      <Path
        d="M 16 52 A 34 34 0 0 1 84 52"
        fill="none" stroke="#F9A825" strokeWidth="4"
      />
      <Path
        d="M 20 54 A 30 30 0 0 1 80 54"
        fill="none" stroke="#F9A825" strokeWidth="3"
      />

      {/* Green laurel leaves left */}
      <G transform="translate(10,38) rotate(-30)">
        <Ellipse cx={0} cy={0} rx={7} ry={3.5} fill="#2E7D32" />
      </G>
      <G transform="translate(14,28) rotate(-15)">
        <Ellipse cx={0} cy={0} rx={6} ry={3} fill="#2E7D32" />
      </G>
      <G transform="translate(10,20) rotate(5)">
        <Ellipse cx={0} cy={0} rx={5.5} ry={2.5} fill="#2E7D32" />
      </G>

      {/* Green laurel leaves right */}
      <G transform="translate(90,38) rotate(30)">
        <Ellipse cx={0} cy={0} rx={7} ry={3.5} fill="#2E7D32" />
      </G>
      <G transform="translate(86,28) rotate(15)">
        <Ellipse cx={0} cy={0} rx={6} ry={3} fill="#2E7D32" />
      </G>
      <G transform="translate(90,20) rotate(-5)">
        <Ellipse cx={0} cy={0} rx={5.5} ry={2.5} fill="#2E7D32" />
      </G>

      {/* Green top leaf */}
      <Path d="M 50 4 C 46 10 43 18 50 22 C 57 18 54 10 50 4 Z" fill="#2E7D32" />
      <Path d="M 50 6 C 50 12 50 18 50 22" stroke="#1B5E20" strokeWidth="0.5" fill="none" />

      {/* Center food placeholder circle */}
      <Circle cx={50} cy={44} r={18} fill="#F5F0EB" />

      {/* Simple food icon — bowl */}
      <Ellipse cx={50} cy={48} rx={12} ry={4} fill="#8D6E63" />
      <Path d="M 38 44 Q 38 36 50 36 Q 62 36 62 44 Z" fill="#A1887F" />
      {/* Small items in bowl */}
      <Circle cx={45} cy={40} r={2.5} fill="#4CAF50" />
      <Circle cx={50} cy={39} r={3} fill="#FFFFFF" opacity="0.8" />
      <Circle cx={55} cy={41} r={2} fill="#F9A825" />
      {/* Steam lines */}
      <Path d="M 46 34 Q 44 31 46 28" stroke="#8C8278" strokeWidth="1" fill="none" strokeLinecap="round" />
      <Path d="M 50 33 Q 48 29 50 26" stroke="#8C8278" strokeWidth="1" fill="none" strokeLinecap="round" />
      <Path d="M 54 34 Q 56 31 54 28" stroke="#8C8278" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Red banner */}
      <Path
        d="M 18 62 Q 18 58 22 57 L 78 57 Q 82 58 82 62 Q 82 68 78 69 L 22 69 Q 18 68 18 62 Z"
        fill="#C62828"
      />
      {/* Banner tails */}
      <Path d="M 18 58 L 12 62 L 18 66 Z" fill="#B71C1C" />
      <Path d="M 82 58 L 88 62 L 82 66 Z" fill="#B71C1C" />
      {/* Gold lines on banner */}
      <Path d="M 18 60 L 82 60" stroke="#F9A825" strokeWidth="0.5" />
      <Path d="M 18 66 L 82 66" stroke="#F9A825" strokeWidth="0.5" />

      {/* KFL text */}
      <SvgText
        x={50} y={67}
        fontSize={12} fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        KFL
      </SvgText>

      {/* Bottom half circle */}
      <Path d="M 18 69 Q 18 80 50 80 Q 82 80 82 69 Z" fill="#E8591A" />
      <Path d="M 24 74 Q 24 78 50 78 Q 76 78 76 74" fill="none" stroke="#F9A825" strokeWidth="0.8" />
    </Svg>
  );
}
