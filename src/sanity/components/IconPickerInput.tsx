"use client";

import { useCallback, useMemo, useState } from "react";
import { type StringInputProps, set, unset } from "sanity";
import {
  Autocomplete,
  Box as SanityBox,
  Card,
  Flex,
  Stack,
  Text,
} from "@sanity/ui";
import {
  /* ── Navigation / pages ── */
  Newspaper,
  BookOpen,
  Pickaxe,
  Map,
  MapPin,
  Compass,
  Home,
  LayoutDashboard,
  FileText,
  Scroll,
  BookMarked,
  Library,
  GraduationCap,
  School,
  Bookmark,
  FolderOpen,
  Archive,

  /* ── Actions / tools ── */
  Search,
  Settings,
  Wrench,
  Hammer,
  SlidersHorizontal,
  Filter,
  Crosshair,
  Target,
  Scan,
  Focus,
  Download,
  Upload,
  ExternalLink,
  Link,
  Share2,

  /* ── Data / charts ── */
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  Database,
  HardDrive,
  Server,

  /* ── Gaming / sci-fi ── */
  Sword,
  Shield,
  Zap,
  Flame,
  Skull,
  Atom,
  Rocket,
  Star,
  Award,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Coins,
  Banknote,
  Gamepad2,
  Joystick,
  Swords,

  /* ── People / social ── */
  Users,
  User,
  UserPlus,
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Heart,
  ThumbsUp,

  /* ── Media ── */
  Image,
  Camera,
  Video,
  Music,
  Headphones,
  Play,
  Mic,
  Monitor,
  Tv,
  Radio,

  /* ── Nature / world ── */
  Globe,
  Mountain,
  Trees,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Droplets,
  Wind,
  Waves,

  /* ── Status / indicators ── */
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Timer,
  Calendar,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,

  /* ── Shapes / misc ── */
  Box as BoxIcon,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Pentagon,
  Layers,
  Grid3x3,
  LayoutGrid,
  Package,
  Tag,
  Tags,
  Hash,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   Icon catalogue — kebab-case name → { component, category }
   ═══════════════════════════════════════════════════════════════════════════ */

interface IconEntry {
  icon: LucideIcon;
  category: string;
}

const ICON_MAP: Record<string, IconEntry> = {
  /* Navigation / pages */
  home: { icon: Home, category: "Navigation" },
  "layout-dashboard": { icon: LayoutDashboard, category: "Navigation" },
  newspaper: { icon: Newspaper, category: "Navigation" },
  "book-open": { icon: BookOpen, category: "Navigation" },
  "file-text": { icon: FileText, category: "Navigation" },
  scroll: { icon: Scroll, category: "Navigation" },
  "book-marked": { icon: BookMarked, category: "Navigation" },
  library: { icon: Library, category: "Navigation" },
  "graduation-cap": { icon: GraduationCap, category: "Navigation" },
  school: { icon: School, category: "Navigation" },
  bookmark: { icon: Bookmark, category: "Navigation" },
  "folder-open": { icon: FolderOpen, category: "Navigation" },
  archive: { icon: Archive, category: "Navigation" },

  /* Map / location */
  map: { icon: Map, category: "Map" },
  "map-pin": { icon: MapPin, category: "Map" },
  compass: { icon: Compass, category: "Map" },
  globe: { icon: Globe, category: "Map" },

  /* Actions / tools */
  search: { icon: Search, category: "Tools" },
  settings: { icon: Settings, category: "Tools" },
  wrench: { icon: Wrench, category: "Tools" },
  hammer: { icon: Hammer, category: "Tools" },
  "sliders-horizontal": { icon: SlidersHorizontal, category: "Tools" },
  filter: { icon: Filter, category: "Tools" },
  crosshair: { icon: Crosshair, category: "Tools" },
  target: { icon: Target, category: "Tools" },
  scan: { icon: Scan, category: "Tools" },
  focus: { icon: Focus, category: "Tools" },
  download: { icon: Download, category: "Tools" },
  upload: { icon: Upload, category: "Tools" },
  "external-link": { icon: ExternalLink, category: "Tools" },
  link: { icon: Link, category: "Tools" },
  "share-2": { icon: Share2, category: "Tools" },

  /* Data / charts */
  "bar-chart-3": { icon: BarChart3, category: "Data" },
  "line-chart": { icon: LineChart, category: "Data" },
  "pie-chart": { icon: PieChart, category: "Data" },
  "trending-up": { icon: TrendingUp, category: "Data" },
  "trending-down": { icon: TrendingDown, category: "Data" },
  activity: { icon: Activity, category: "Data" },
  gauge: { icon: Gauge, category: "Data" },
  database: { icon: Database, category: "Data" },
  "hard-drive": { icon: HardDrive, category: "Data" },
  server: { icon: Server, category: "Data" },

  /* Gaming / sci-fi */
  pickaxe: { icon: Pickaxe, category: "Gaming" },
  sword: { icon: Sword, category: "Gaming" },
  swords: { icon: Swords, category: "Gaming" },
  shield: { icon: Shield, category: "Gaming" },
  zap: { icon: Zap, category: "Gaming" },
  flame: { icon: Flame, category: "Gaming" },
  skull: { icon: Skull, category: "Gaming" },
  atom: { icon: Atom, category: "Gaming" },
  rocket: { icon: Rocket, category: "Gaming" },
  star: { icon: Star, category: "Gaming" },
  award: { icon: Award, category: "Gaming" },
  trophy: { icon: Trophy, category: "Gaming" },
  crown: { icon: Crown, category: "Gaming" },
  gem: { icon: Gem, category: "Gaming" },
  diamond: { icon: Diamond, category: "Gaming" },
  coins: { icon: Coins, category: "Gaming" },
  banknote: { icon: Banknote, category: "Gaming" },
  "gamepad-2": { icon: Gamepad2, category: "Gaming" },
  joystick: { icon: Joystick, category: "Gaming" },

  /* Social / people */
  users: { icon: Users, category: "Social" },
  user: { icon: User, category: "Social" },
  "user-plus": { icon: UserPlus, category: "Social" },
  "message-square": { icon: MessageSquare, category: "Social" },
  "message-circle": { icon: MessageCircle, category: "Social" },
  mail: { icon: Mail, category: "Social" },
  bell: { icon: Bell, category: "Social" },
  heart: { icon: Heart, category: "Social" },
  "thumbs-up": { icon: ThumbsUp, category: "Social" },

  /* Media */
  image: { icon: Image, category: "Media" },
  camera: { icon: Camera, category: "Media" },
  video: { icon: Video, category: "Media" },
  music: { icon: Music, category: "Media" },
  headphones: { icon: Headphones, category: "Media" },
  play: { icon: Play, category: "Media" },
  mic: { icon: Mic, category: "Media" },
  monitor: { icon: Monitor, category: "Media" },
  tv: { icon: Tv, category: "Media" },
  radio: { icon: Radio, category: "Media" },

  /* Nature / world */
  mountain: { icon: Mountain, category: "Nature" },
  trees: { icon: Trees, category: "Nature" },
  sun: { icon: Sun, category: "Nature" },
  moon: { icon: Moon, category: "Nature" },
  cloud: { icon: Cloud, category: "Nature" },
  snowflake: { icon: Snowflake, category: "Nature" },
  droplets: { icon: Droplets, category: "Nature" },
  wind: { icon: Wind, category: "Nature" },
  waves: { icon: Waves, category: "Nature" },

  /* Status / indicators */
  "alert-triangle": { icon: AlertTriangle, category: "Status" },
  "alert-circle": { icon: AlertCircle, category: "Status" },
  info: { icon: Info, category: "Status" },
  "check-circle": { icon: CheckCircle, category: "Status" },
  "x-circle": { icon: XCircle, category: "Status" },
  clock: { icon: Clock, category: "Status" },
  timer: { icon: Timer, category: "Status" },
  calendar: { icon: Calendar, category: "Status" },
  "calendar-days": { icon: CalendarDays, category: "Status" },
  eye: { icon: Eye, category: "Status" },
  "eye-off": { icon: EyeOff, category: "Status" },
  lock: { icon: Lock, category: "Status" },
  unlock: { icon: Unlock, category: "Status" },
  "shield-check": { icon: ShieldCheck, category: "Status" },

  /* Shapes / misc */
  box: { icon: BoxIcon, category: "Misc" },
  circle: { icon: Circle, category: "Misc" },
  square: { icon: Square, category: "Misc" },
  triangle: { icon: Triangle, category: "Misc" },
  hexagon: { icon: Hexagon, category: "Misc" },
  pentagon: { icon: Pentagon, category: "Misc" },
  layers: { icon: Layers, category: "Misc" },
  "grid-3x3": { icon: Grid3x3, category: "Misc" },
  "layout-grid": { icon: LayoutGrid, category: "Misc" },
  package: { icon: Package, category: "Misc" },
  tag: { icon: Tag, category: "Misc" },
  tags: { icon: Tags, category: "Misc" },
  hash: { icon: Hash, category: "Misc" },
  sparkles: { icon: Sparkles, category: "Misc" },
  "arrow-right": { icon: ArrowRight, category: "Misc" },
  "chevron-right": { icon: ChevronRight, category: "Misc" },
  "more-horizontal": { icon: MoreHorizontal, category: "Misc" },
};

/* ── Sorted option list for the Autocomplete ── */

const OPTIONS = Object.entries(ICON_MAP)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, { category }]) => ({
    value: name,
    category,
  }));

/* ═══════════════════════════════════════════════════════════════════════════
   IconPickerInput — Sanity custom string input
   ═══════════════════════════════════════════════════════════════════════════ */

export function IconPickerInput(props: StringInputProps) {
  const { onChange, value = "" } = props;
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (val: string) => {
      onChange(val ? set(val) : unset());
    },
    [onChange],
  );

  const handleQueryChange = useCallback(
    (q: string | null) => setQuery(q ?? ""),
    [],
  );

  const filtered = useMemo(() => {
    if (!query) return OPTIONS;
    const q = query.toLowerCase();
    return OPTIONS.filter(
      (o) => o.value.includes(q) || o.category.toLowerCase().includes(q),
    );
  }, [query]);

  /* Render each option with an icon preview */
  const renderOption = useCallback((option: { value: string }) => {
    const entry = ICON_MAP[option.value];
    if (!entry) {
      return (
        <Card as="button" padding={2}>
          <Text size={1}>{option.value}</Text>
        </Card>
      );
    }
    const IconComp = entry.icon;
    return (
      <Card as="button" padding={2}>
        <Flex align="center" gap={3}>
          <SanityBox
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--card-fg-color)",
            }}
          >
            <IconComp size={18} />
          </SanityBox>
          <Stack space={1} style={{ flex: 1 }}>
            <Text size={1} weight="medium">
              {option.value}
            </Text>
            <Text size={0} muted>
              {entry.category}
            </Text>
          </Stack>
        </Flex>
      </Card>
    );
  }, []);

  /* Current selection preview */
  const currentEntry = value ? ICON_MAP[value] : null;
  const CurrentIcon = currentEntry?.icon;

  return (
    <Stack space={3}>
      <Autocomplete
        id="icon-picker"
        options={filtered}
        value={value}
        placeholder="Search icons…"
        onQueryChange={handleQueryChange}
        onChange={handleChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderOption={renderOption as any}
        openButton
        filterOption={() => true} /* filtering handled by us */
        fontSize={1}
      />

      {CurrentIcon && (
        <Card padding={3} border radius={2} tone="primary">
          <Flex align="center" gap={3}>
            <SanityBox
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--card-fg-color)",
              }}
            >
              <CurrentIcon size={22} />
            </SanityBox>
            <Stack space={1}>
              <Text size={1} weight="medium">
                {value}
              </Text>
              <Text size={0} muted>
                {currentEntry.category}
              </Text>
            </Stack>
          </Flex>
        </Card>
      )}
    </Stack>
  );
}
