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
  Segment,
  Chips,
  Chip,
  type FieldProps,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type CheckboxProps,
  type SegmentOption,
  type SegmentProps,
  type ChipProps,
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
  type KeypadProps,
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
