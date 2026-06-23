/**
 * KFL Icon System — SVG icons (Lucide paths) via react-native-svg
 * Zero external dependency beyond react-native-svg (already installed).
 * Usage: <Icon name="Bell" size={20} color="#2C1810" />
 */
import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Polygon, Rect, G } from 'react-native-svg';

// ─── Icon path registry ──────────────────────────────────────────────────────
type IconDef = { paths: React.ReactNode };

const ICONS: Record<string, IconDef> = {
  Trash2: {
    paths: (
      <>
        <Path d="M3 6h18" />
        <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <Line x1="10" y1="11" x2="10" y2="17" />
        <Line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
  },
  SlidersHorizontal: {
    paths: (
      <>
        <Line x1="21" y1="4" x2="14" y2="4" />
        <Line x1="10" y1="4" x2="3" y2="4" />
        <Line x1="21" y1="12" x2="12" y2="12" />
        <Line x1="8" y1="12" x2="3" y2="12" />
        <Line x1="21" y1="20" x2="16" y2="20" />
        <Line x1="12" y1="20" x2="3" y2="20" />
        <Line x1="14" y1="2" x2="14" y2="6" />
        <Line x1="8" y1="10" x2="8" y2="14" />
        <Line x1="16" y1="18" x2="16" y2="22" />
      </>
    ),
  },
  Headphones: {
    paths: (
      <>
        <Path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3v-7a9 9 0 1 1 18 0v7h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      </>
    ),
  },
  Moon: {
    paths: (
      <>
        <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </>
    ),
  },
  Monitor: {
    paths: (
      <>
        <Rect x="2" y="3" width="20" height="14" rx="2" />
        <Line x1="8" y1="21" x2="16" y2="21" />
        <Line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
  Bell: {
    paths: (
      <>
        <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  BellOff: {
    paths: (
      <>
        <Path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 1 .6 5" />
        <Path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" />
        <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <Line x1="2" y1="2" x2="22" y2="22" />
      </>
    ),
  },
  Search: {
    paths: (
      <>
        <Circle cx="11" cy="11" r="8" />
        <Path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  Mic: {
    paths: (
      <>
        <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <Line x1="12" y1="19" x2="12" y2="22" />
      </>
    ),
  },
  Camera: {
    paths: (
      <>
        <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <Circle cx="12" cy="13" r="3" />
      </>
    ),
  },
  ScanLine: {
    paths: (
      <>
        <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <Line x1="7" y1="12" x2="17" y2="12" />
      </>
    ),
  },
  Home: {
    paths: (
      <>
        <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <Polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  Heart: {
    paths: (
      <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
  },
  Bookmark: {
    paths: (
      <Path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    ),
  },
  User: {
    paths: (
      <>
        <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <Circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  Users: {
    paths: (
      <>
        <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  MapPin: {
    paths: (
      <>
        <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <Circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  ChevronRight: {
    paths: <Path d="m9 18 6-6-6-6" />,
  },
  ChevronLeft: {
    paths: <Path d="m15 18-6-6 6-6" />,
  },
  ChevronDown: {
    paths: <Path d="m6 9 6 6 6-6" />,
  },
  ChevronUp: {
    paths: <Path d="m18 15-6-6-6 6" />,
  },
  X: {
    paths: (
      <>
        <Path d="M18 6 6 18" />
        <Path d="m6 6 12 12" />
      </>
    ),
  },
  ArrowLeft: {
    paths: (
      <>
        <Path d="m12 19-7-7 7-7" />
        <Path d="M19 12H5" />
      </>
    ),
  },
  ArrowRight: {
    paths: (
      <>
        <Path d="M5 12h14" />
        <Path d="m12 5 7 7-7 7" />
      </>
    ),
  },
  Flame: {
    paths: (
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    ),
  },
  Trophy: {
    paths: (
      <>
        <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <Path d="M4 22h16" />
        <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </>
    ),
  },
  Calendar: {
    paths: (
      <>
        <Path d="M8 2v4" />
        <Path d="M16 2v4" />
        <Rect x="3" y="4" width="18" height="18" rx="2" />
        <Path d="M3 10h18" />
      </>
    ),
  },
  Globe: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <Path d="M2 12h20" />
      </>
    ),
  },
  Star: {
    paths: (
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
  },
  Settings: {
    paths: (
      <>
        <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <Circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  Plus: {
    paths: (
      <>
        <Path d="M5 12h14" />
        <Path d="M12 5v14" />
      </>
    ),
  },
  Check: {
    paths: <Path d="M20 6 9 17l-5-5" />,
  },
  Lock: {
    paths: (
      <>
        <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
  Mail: {
    paths: (
      <>
        <Rect x="2" y="4" width="20" height="16" rx="2" />
        <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
  Phone: {
    paths: (
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  Eye: {
    paths: (
      <>
        <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <Circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  EyeOff: {
    paths: (
      <>
        <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <Line x1="2" y1="2" x2="22" y2="22" />
      </>
    ),
  },
  Filter: {
    paths: (
      <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    ),
  },
  MessageCircle: {
    paths: (
      <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    ),
  },
  Clock: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  Info: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 16v-4" />
        <Path d="M12 8h.01" />
      </>
    ),
  },
  Sparkles: {
    paths: (
      <>
        <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <Path d="M5 3v4" />
        <Path d="M19 17v4" />
        <Path d="M3 5h4" />
        <Path d="M17 19h4" />
      </>
    ),
  },
  ChefHat: {
    paths: (
      <>
        <Path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <Line x1="6" y1="17" x2="18" y2="17" />
      </>
    ),
  },
  PlayCircle: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Polygon points="10 8 16 12 10 16 10 8" />
      </>
    ),
  },
  Share2: {
    paths: (
      <>
        <Circle cx="18" cy="5" r="3" />
        <Circle cx="6" cy="12" r="3" />
        <Circle cx="18" cy="19" r="3" />
        <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </>
    ),
  },
  ThumbsUp: {
    paths: (
      <>
        <Path d="M7 10v12" />
        <Path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </>
    ),
  },
  Package: {
    paths: (
      <>
        <Path d="M16.5 9.4 7.55 4.24" />
        <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <Polyline points="3.29 7 12 12 20.71 7" />
        <Line x1="12" y1="22" x2="12" y2="12" />
      </>
    ),
  },
  GraduationCap: {
    paths: (
      <>
        <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <Path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
  },
  Gamepad2: {
    paths: (
      <>
        <Line x1="6" y1="12" x2="10" y2="12" />
        <Line x1="8" y1="10" x2="8" y2="14" />
        <Line x1="15" y1="13" x2="15.01" y2="13" />
        <Line x1="18" y1="11" x2="18.01" y2="11" />
        <Rect x="2" y="6" width="20" height="12" rx="2" />
      </>
    ),
  },
  BarChart2: {
    paths: (
      <>
        <Line x1="18" y1="20" x2="18" y2="10" />
        <Line x1="12" y1="20" x2="12" y2="4" />
        <Line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
  },
  QrCode: {
    paths: (
      <>
        <Rect x="3" y="3" width="7" height="7" />
        <Rect x="14" y="3" width="7" height="7" />
        <Rect x="14" y="14" width="7" height="7" />
        <Rect x="3" y="14" width="7" height="7" />
        <Rect x="5" y="5" width="3" height="3" />
        <Rect x="16" y="5" width="3" height="3" />
        <Rect x="16" y="16" width="3" height="3" />
        <Rect x="5" y="16" width="3" height="3" />
      </>
    ),
  },
  LogOut: {
    paths: (
      <>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Polyline points="16 17 21 12 16 7" />
        <Line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
  },
  Ticket: {
    paths: (
      <>
        <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <Line x1="9" y1="12" x2="15" y2="12" />
      </>
    ),
  },
  Send: {
    paths: (
      <>
        <Path d="m22 2-7 20-4-9-9-4Z" />
        <Path d="M22 2 11 13" />
      </>
    ),
  },
  Grid: {
    paths: (
      <>
        <Rect x="3" y="3" width="7" height="7" rx="1" />
        <Rect x="14" y="3" width="7" height="7" rx="1" />
        <Rect x="14" y="14" width="7" height="7" rx="1" />
        <Rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  RefreshCw: {
    paths: (
      <>
        <Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <Path d="M21 3v5h-5" />
        <Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <Path d="M8 16H3v5" />
      </>
    ),
  },
  Volume2: {
    paths: (
      <>
        <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ),
  },
  MoreHorizontal: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="1" />
        <Circle cx="19" cy="12" r="1" />
        <Circle cx="5"  cy="12" r="1" />
      </>
    ),
  },
  Square: {
    paths: <Rect x="3" y="3" width="18" height="18" rx="2" />,
  },
  SkipBack: {
    paths: (
      <>
        <Polygon points="19 20 9 12 19 4 19 20" />
        <Line x1="5" y1="19" x2="5" y2="5" />
      </>
    ),
  },
  SkipForward: {
    paths: (
      <>
        <Polygon points="5 4 15 12 5 20 5 4" />
        <Line x1="19" y1="5" x2="19" y2="19" />
      </>
    ),
  },
  Maximize2: {
    paths: (
      <>
        <Polyline points="15 3 21 3 21 9" />
        <Polyline points="9 21 3 21 3 15" />
        <Line x1="21" y1="3" x2="14" y2="10" />
        <Line x1="3"  y1="21" x2="10" y2="14" />
      </>
    ),
  },
  Award: {
    paths: (
      <>
        <Circle cx="12" cy="8" r="6" />
        <Path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
  },
  List: {
    paths: (
      <>
        <Line x1="8"  y1="6"  x2="21" y2="6" />
        <Line x1="8"  y1="12" x2="21" y2="12" />
        <Line x1="8"  y1="18" x2="21" y2="18" />
        <Line x1="3"  y1="6"  x2="3.01" y2="6" />
        <Line x1="3"  y1="12" x2="3.01" y2="12" />
        <Line x1="3"  y1="18" x2="3.01" y2="18" />
      </>
    ),
  },
  Play: {
    paths: <Polygon points="5 3 19 12 5 21 5 3" />,
  },
  Pause: {
    paths: (
      <>
        <Line x1="10" y1="15" x2="10" y2="9" />
        <Line x1="14" y1="15" x2="14" y2="9" />
        <Rect x="3" y="3" width="18" height="18" rx="2" />
      </>
    ),
  },
  Edit: {
    paths: (
      <>
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
  },
  FileText: {
    paths: (
      <>
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <Polyline points="14 2 14 8 20 8" />
        <Line x1="16" y1="13" x2="8" y2="13" />
        <Line x1="16" y1="17" x2="8" y2="17" />
        <Polyline points="10 9 9 9 8 9" />
      </>
    ),
  },
  Shield: {
    paths: <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  CreditCard: {
    paths: (
      <>
        <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <Line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
  Smartphone: {
    paths: (
      <>
        <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <Line x1="12" y1="18" x2="12.01" y2="18" />
      </>
    ),
  },
  Gift: {
    paths: (
      <>
        <Polyline points="20 12 20 22 4 22 4 12" />
        <Rect x="2" y="7" width="20" height="5" />
        <Path d="M12 22V7" />
        <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </>
    ),
  },
  Zap: {
    paths: <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
  CheckCircle: {
    paths: (
      <>
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
  },
  HelpCircle: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <Line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
  },
  Navigation: {
    paths: <Polygon points="3 11 22 2 13 21 11 13 3 11" />,
  },
  AlertTriangle: {
    paths: (
      <>
        <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <Path d="M12 9v4" />
        <Path d="M12 17h.01" />
      </>
    ),
  },
  DollarSign: {
    paths: (
      <>
        <Line x1="12" y1="1" x2="12" y2="23" />
        <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
  },
  TrendingUp: {
    paths: (
      <>
        <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <Polyline points="16 7 22 7 22 13" />
      </>
    ),
  },
  TrendingDown: {
    paths: (
      <>
        <Polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <Polyline points="16 17 22 17 22 11" />
      </>
    ),
  },
  Megaphone: {
    paths: (
      <>
        <Path d="m3 11 19-9-9 19-2-8-8-2z" />
        <Path d="M11 13 9 21" />
      </>
    ),
  },
  Wrench: {
    paths: (
      <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    ),
  },
  ShoppingBag: {
    paths: (
      <>
        <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <Line x1="3" y1="6" x2="21" y2="6" />
        <Path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  Truck: {
    paths: (
      <>
        <Path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v10H5" />
        <Polyline points="12 3 12 17 19 17 22 13 22 8 19 8" />
        <Circle cx="7.5" cy="17.5" r="2.5" />
        <Circle cx="17.5" cy="17.5" r="2.5" />
      </>
    ),
  },
  Flag: {
    paths: (
      <>
        <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <Line x1="4" y1="22" x2="4" y2="15" />
      </>
    ),
  },
  ShoppingCart: {
    paths: (
      <>
        <Circle cx="9" cy="21" r="1" />
        <Circle cx="20" cy="21" r="1" />
        <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </>
    ),
  },
  Percent: {
    paths: (
      <>
        <Line x1="19" y1="5" x2="5" y2="19" />
        <Circle cx="6.5" cy="6.5" r="2.5" />
        <Circle cx="17.5" cy="17.5" r="2.5" />
      </>
    ),
  },
  Radio: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="2" />
        <Path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
        <Path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <Path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ),
  },
  Video: {
    paths: (
      <>
        <Polygon points="23 7 16 12 23 17 23 7" />
        <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
  },
  Image: {
    paths: (
      <>
        <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <Circle cx="8.5" cy="8.5" r="1.5" />
        <Polyline points="21 15 16 10 5 21" />
      </>
    ),
  },
  Tag: {
    paths: (
      <>
        <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <Line x1="7" y1="7" x2="7.01" y2="7" />
      </>
    ),
  },
  UserCheck: {
    paths: (
      <>
        <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Polyline points="16 11 18 13 22 9" />
      </>
    ),
  },
  UserX: {
    paths: (
      <>
        <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Line x1="17" y1="8" x2="23" y2="14" />
        <Line x1="23" y1="8" x2="17" y2="14" />
      </>
    ),
  },
  Ban: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </>
    ),
  },
  PieChart: {
    paths: (
      <>
        <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <Path d="M22 12A10 10 0 0 0 12 2v10z" />
      </>
    ),
  },
  MessageSquare: {
    paths: (
      <>
        <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </>
    ),
  },
  Minus: {
    paths: <Line x1="5" y1="12" x2="19" y2="12" />,
  },
  Wifi: {
    paths: (
      <>
        <Path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <Path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <Line x1="12" y1="20" x2="12.01" y2="20" />
      </>
    ),
  },
  Sun: {
    paths: (
      <>
        <Circle cx="12" cy="12" r="5" />
        <Line x1="12" y1="1" x2="12" y2="3" />
        <Line x1="12" y1="21" x2="12" y2="23" />
        <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <Line x1="1" y1="12" x2="3" y2="12" />
        <Line x1="21" y1="12" x2="23" y2="12" />
        <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
  },
  Type: {
    paths: (
      <>
        <Polyline points="4 7 4 4 20 4 20 7" />
        <Line x1="9" y1="20" x2="15" y2="20" />
        <Line x1="12" y1="4" x2="12" y2="20" />
      </>
    ),
  },
  BookOpen: {
    paths: (
      <>
        <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
  Menu: {
    paths: (
      <>
        <Line x1="3" y1="12" x2="21" y2="12" />
        <Line x1="3" y1="6" x2="21" y2="6" />
        <Line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
  },
  ArrowUp: {
    paths: (
      <>
        <Path d="M12 19V5" />
        <Path d="m5 12 7-7 7 7" />
      </>
    ),
  },
  ArrowDown: {
    paths: (
      <>
        <Path d="M12 5v14" />
        <Path d="m19 12-7 7-7-7" />
      </>
    ),
  },
  Wallet: {
    paths: (
      <>
        <Path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <Path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <Path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </>
    ),
  },
  RotateCcw: {
    paths: (
      <>
        <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <Path d="M3 3v5h5" />
      </>
    ),
  },
};

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export default function Icon({ name, size = 20, color = '#2C1810', strokeWidth = 1.75, fill = 'none' }: Props) {
  const def = ICONS[name];
  if (!def) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {def.paths}
    </Svg>
  );
}
