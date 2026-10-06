/**
 * OpenEOS Designsystem.
 *
 * Styles separat importieren — einmal pro App, im Root-Layout:
 *
 *   import '@openeos/ui/styles.css';
 *
 * In Tailwind-Projekten mit Untitled UI zusätzlich die Bridge, damit
 * die bestehenden Komponenten die OpenEOS-Palette übernehmen:
 *
 *   @import "tailwindcss";
 *   @import "./theme.css";
 *   @import "@openeos/ui/css/bridge-untitled.css";
 */

export { cx, bem } from './react/utils';

export { Icon, type IconProps } from './react/icon';
export type { IconName } from './icons/generated';

export {
  Button,
  ButtonLink,
  ButtonGroup,
  Actions,
  type ButtonProps,
  type ButtonLinkProps,
  type ButtonVariant,
  type ButtonSize,
} from './react/button';

export {
  Card,
  CardHead,
  CardBody,
  CardFoot,
  Kpis,
  Kpi,
  Meter,
  PageHead,
  Tabs,
  Toolbar,
  type CardProps,
  type CardVariant,
  type KpiProps,
  type MeterProps,
  type PageHeadProps,
  type TabItem,
  type TabsProps,
} from './react/surfaces';

export {
  Badge,
  Pill,
  StatusDot,
  Status,
  Delta,
  Avatar,
  AvatarStack,
  TableWrap,
  Table,
  Spinner,
  Skeleton,
  Rank,
  StatusPill,
  type StatusPillProps,
  type BadgeProps,
  type BadgeTone,
  type DotTone,
  type AvatarProps,
  type TableProps,
} from './react/data-display';

export {
  Banner,
  Toast,
  EmptyState,
  NoData,
  Modal,
  Scrim,
  Tooltip,
  Prompt,
  type PromptProps,
  type BannerProps,
  type BannerTone,
  type ToastProps,
  type EmptyStateProps,
  type ModalProps,
} from './react/feedback';

export {
  Field,
  Input,
  Textarea,
  Select,
  InputGroup,
  SearchInput,
  Checkbox,
  Radio,
  Switch,
  SettingToggle,
  Segment,
  Chips,
  Chip,
  Stepper,
  ChoiceGroup,
  type StepperProps,
  type ChoiceOption,
  type ChoiceGroupProps,
  type FieldProps,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type CheckboxProps,
  type SegmentOption,
  type SegmentProps,
  type ChipProps,
  type SettingToggleProps,
} from './react/forms';

export {
  Shell,
  Sidebar,
  SidebarGroup,
  SidebarFoot,
  NavItem,
  OrgCard,
  EventCard,
  Topbar,
  Main,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuCaption,
  type ShellProps,
  type NavItemProps,
  type OrgCardProps,
  type EventCardProps,
  type TopbarProps,
} from './react/shell';

export {
  Tile,
  TileGrid,
  Ticket,
  TableChip,
  TableGrid,
  TableMap,
  Keypad,
  Receipt,
  Terminal,
  Stream,
  type TileProps,
  type TicketProps,
  type TicketState,
  type TicketLine,
  type TableChipProps,
  type TableGridProps,
  type KeypadProps,
  type KeypadKey,
  type ReceiptProps,
  type ReceiptLine,
  type StreamRow,
} from './react/domain';

export {
  Dropdown,
  DropdownOption,
  DropdownLink,
  DropdownCaption,
  DropdownSeparator,
  DropdownSearch,
  type DropdownProps,
  type DropdownOptionProps,
  type DropdownLinkProps,
  type DropdownSearchProps,
} from './react/dropdown';

export {
  IconBox,
  Legend,
  CartLine,
  CartBar,
  CategoryNav,
  CategoryButton,
  UserChip,
  type IconBoxProps,
  type LegendItem,
  type CartLineProps,
  type CartBarProps,
  type CategoryNavProps,
  type CategoryButtonProps,
  type UserChipProps,
} from './react/pos';

export { Sheet, type SheetProps } from './react/sheet';

export {
  FloorPlan,
  type FloorPlanProps,
  type FloorTable,
  type FloorDecor,
  type FloorChange,
  type FloorItemKind,
} from './react/floor-plan';

export {
  snapToGrid,
  clampToArea,
  pxToUnits,
  rotateBy,
  toPercent,
  moveRect,
  resizeRect,
  FLOOR_MIN_SIZE,
  type FloorRect,
  type FloorArea,
} from './react/floor-plan-math';
