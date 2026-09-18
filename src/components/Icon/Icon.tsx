import type { CSSProperties, HTMLAttributes } from 'react';
import iconAssets from './icon-assets.json';
import './Icon.css';

export type IconName = "1c-logo" | "24-7" | "academic-cap" | "action-menu" | "android-logo" | "api" | "apple-logo" | "archive" | "archive-box" | "armchair" | "arrow-back" | "arrow-chevron-down" | "arrow-chevron-left" | "arrow-chevron-left-first" | "arrow-chevron-right" | "arrow-chevron-right-last" | "arrow-chevron-up" | "arrow-circle-path" | "arrow-clockwise" | "arrow-clockwise-dotted" | "arrow-counter-clockwise-dotted" | "arrow-down" | "arrow-down-arrow-up" | "arrow-down-left" | "arrow-down-right" | "arrow-download" | "arrow-drop-down" | "arrow-drop-up" | "arrow-left" | "arrow-login" | "arrow-logout" | "arrow-path" | "arrow-right" | "arrow-right-arrow-left" | "arrow-right-tab" | "arrow-sublevel" | "arrow-up" | "arrow-up-left" | "arrow-up-right" | "arrow-upload" | "arrows-frame-in" | "arrows-frame-out" | "balloon" | "bank" | "bank_badge-plus" | "bear" | "bell" | "bell_badge-plus" | "bitrix-logo" | "bookmark" | "briefcase" | "briefcase-arrow-in" | "burger" | "bus" | "business-office" | "calculator" | "calendar" | "calendar_badge-check" | "calendar_badge-clock" | "calendar_badge-percent" | "calendar_badge-question" | "camera" | "car" | "card" | "card-arrow-in" | "card_badge-arrow-circle-path" | "card_badge-check" | "card_badge-clock" | "card_badge-cross" | "card_badge-exclamation" | "card_badge-minus" | "card_badge-percent" | "card_badge-plus" | "cards" | "caret" | "cash" | "cash-arrow-down" | "cash-arrow-up" | "cash-register" | "certificate" | "certificate-crossed" | "chart-bar_square" | "chart-candlestick" | "chart-line" | "chart-line_square" | "chart-pie" | "check" | "check-double" | "check_circle" | "check_square" | "clip" | "clipboard" | "clipboard_badge-link" | "clock-alarm" | "clock_circle" | "coins" | "column-left" | "columns" | "components" | "computer-mouse" | "copy" | "copy-check" | "copy-clipboard" | "copy-cross" | "copy-doc-list" | "copy-exclamation" | "cross" | "cross_circle" | "crossed_circle" | "crown" | "currency/argentine-peso-sign_medium" | "currency/argentine-peso-sign_regular" | "currency/bahraini-dinar-sign_medium" | "currency/bahraini-dinar-sign_regular" | "currency/baht-sign_medium" | "currency/baht-sign_regular" | "currency/balboa-sign_medium" | "currency/balboa-sign_regular" | "currency/belarusian-ruble-sign_medium" | "currency/belarusian-ruble-sign_regular" | "currency/bolivar-sign_medium" | "currency/bolivar-sign_regular" | "currency/boliviano-sign_medium" | "currency/boliviano-sign_regular" | "currency/chilean-peso-sign_medium" | "currency/chilean-peso-sign_regular" | "currency/dirham-sign_medium" | "currency/dirham-sign_regular" | "currency/dollar-sign_medium" | "currency/dollar-sign_regular" | "currency/dong-sign_medium" | "currency/dong-sign_regular" | "currency/drahm-sign_medium" | "currency/drahm-sign_regular" | "currency/euro-sign_medium" | "currency/euro-sign_regular" | "currency/franc-sign_medium" | "currency/franc-sign_regular" | "currency/hong-kong-dollar-sign_medium" | "currency/hong-kong-dollar-sign_regular" | "currency/lirasi-sign_medium" | "currency/lirasi-sign_regular" | "currency/manat-sign_medium" | "currency/manat-sign_regular" | "currency/mexican-peso-sign_medium" | "currency/mexican-peso-sign_regular" | "currency/minus-font-regular" | "currency/minus-font_medium" | "currency/north-korean-won-sign_medium" | "currency/north-korean-won-sign_regular" | "currency/philippine-peso-sign_medium" | "currency/philippine-peso-sign_regular" | "currency/pieces" | "currency/pieces_medium" | "currency/plus-font-regular" | "currency/plus-font_medium" | "currency/points" | "currency/points_medium" | "currency/pound-sterling-sign_medium" | "currency/pound-sterling-sign_regular" | "currency/real-sign_medium" | "currency/real-sign_regular" | "currency/rial-sign_medium" | "currency/rial-sign_regular" | "currency/ringgit-sign_medium" | "currency/ringgit-sign_regular" | "currency/riyal-sign_medium" | "currency/riyal-sign_regular" | "currency/ruble-sign_medium" | "currency/ruble-sign_regular" | "currency/rupee-sign_medium" | "currency/rupee-sign_regular" | "currency/rupiah-sign_medium" | "currency/rupiah-sign_regular" | "currency/singapore-dollar-sign_medium" | "currency/singapore-dollar-sign_regular" | "currency/sol-sign_medium" | "currency/sol-sign_regular" | "currency/som-sign_medium" | "currency/som-sign_regular" | "currency/somoni-sign_medium" | "currency/somoni-sign_regular" | "currency/south-korean-won-sign_medium" | "currency/south-korean-won-sign_regular" | "currency/tenge-sign_medium" | "currency/tenge-sign_regular" | "currency/uruguayan-peso-sign_medium" | "currency/uruguayan-peso-sign_regular" | "currency/yen-sign_medium" | "currency/yen-sign_regular" | "cursor-click" | "cursors/closedhand" | "cursors/cursor" | "cursors/hand" | "cursors/openhand" | "device-list-checked" | "device-shopping-basket" | "devices" | "dialpad" | "disconnect" | "doc-bulleted" | "doc-bulleted_badge-check" | "doc-bulleted_badge-clock" | "doc-bulleted_badge-coins" | "doc-bulleted_badge-cross" | "doc-bulleted_badge-exclamation" | "doc-bulleted_badge-plus" | "doc-invoice" | "doc-invoice_badge-link" | "doc-list" | "doc-list_badge-check" | "doc-list_badge-cross" | "doc-list_badge-link" | "doc-paper" | "doc-paper-arrow-right" | "doc-paper_badge-check" | "doc-reconciliation" | "doc-report" | "doc-scan" | "doc-waybill" | "doc-waybill_badge-link" | "double-eagle" | "drag-vertical" | "exclamation_circle" | "exclamation_triangle" | "eye" | "eye-closed" | "family" | "file-jpg" | "file-pdf" | "file-png" | "file-tiff" | "file-xls" | "filled/android-logo_filled" | "filled/apple-logo_filled" | "filled/bell_badge-plus_filled" | "filled/bitrix-logo_filled" | "filled/bookmark_filled" | "filled/chart-bar_square_filled" | "filled/chart-line_square_filled" | "filled/chart-pie_filled" | "filled/check_circle_filled" | "filled/clock_circle_filled" | "filled/columns_filled" | "filled/cross_circle_filled" | "filled/exclamation_circle_filled" | "filled/google-logo_circle_filled" | "filled/heart_filled" | "filled/metro_circle_filled" | "filled/pause_filled" | "filled/person_circle_filled" | "filled/play_filled" | "filled/send-chat_circle_filled" | "filled/send-chat_filled" | "filled/star_filled" | "filled/thumbs-down_filled" | "filled/thumbs-up_filled" | "fire" | "flag_chevron/Country=Earth, State=Default" | "flag_chevron/Country=Earth, State=Disabled" | "flag_chevron/Country=Earth, State=Focused" | "flag_chevron/Country=Earth, State=Hover" | "flag_chevron/Country=Earth, State=Open" | "flag_chevron/Country=Earth, State=Pressed" | "flag_chevron/Country=Rus, State=Default" | "flag_chevron/Country=Rus, State=Disabled" | "flag_chevron/Country=Rus, State=Focused" | "flag_chevron/Country=Rus, State=Hover" | "flag_chevron/Country=Rus, State=Open" | "flag_chevron/Country=Rus, State=Pressed" | "flip-horizontal" | "flip-vertical" | "folder" | "folder-person" | "food-plate-moving" | "fork-knife" | "funnel" | "gamepad" | "gas-station" | "gear" | "gift" | "glasses" | "globe" | "google-logo_circle" | "gosuslugi-logo" | "gosuslugi-symbol" | "graph-bar" | "hand-card" | "hand-heart" | "hands-heart" | "heart" | "helicopter" | "hierarchy" | "history" | "house" | "info_circle" | "invalid" | "key" | "letter" | "lifebuoy" | "light-bulb" | "lightning" | "link" | "link-broken" | "link-external" | "list-bulleted" | "list-checked" | "loader-icon" | "lock" | "lock-open" | "magnifying-glass" | "marker" | "marker-surface" | "medical-cross" | "metro_circle" | "microphone" | "minus" | "minus_circle" | "more-horisontal" | "more-horisontal_circle" | "more-vertical" | "multicolor/gosuslugi-logo_color" | "multicolor/gosuslugi-symbol_color" | "multicolor/mastercard" | "multicolor/mir" | "multicolor/sbp" | "multicolor/sbp_circle" | "multicolor/visa" | "newspaper" | "number-field" | "paint-roller" | "paperplane" | "payment-contactless" | "payment-terminal" | "payment-terminal-receipt" | "payment-terminal_badge-plus" | "pencil" | "pencil-paper" | "people" | "percent" | "percent-arrow-up-right" | "person" | "person-connections" | "person-walking" | "person_badge-plus" | "person_circle" | "phone-handset" | "picture" | "piggy-bank" | "plane" | "planet-arrow-circle-path" | "planet-earth" | "plus" | "plus_circle" | "plus_square" | "printer" | "propeller-plane" | "puzzle-piece" | "qr-code" | "question_circle" | "receipt" | "rocket" | "router" | "safe" | "send" | "send-chat" | "share" | "shield" | "shop" | "shopping-cart" | "signature" | "skeleton_icon" | "sliders" | "smartphone" | "smiling-face_circle" | "social/Dzen" | "social/Dzen_filled" | "social/Telegram" | "social/Telegram_filled" | "social/VK" | "social/VK_filled" | "social/Youtube" | "social/Youtube_filled" | "social/max-messenger" | "social/max-messenger_filled" | "speech-bubble" | "speedometer" | "star" | "star-plus" | "stopwatch" | "t-shirt" | "tag" | "thumbs-down" | "thumbs-up" | "ticket" | "toy-horse" | "trash-can" | "travel-bag" | "truck-moving" | "truck-percent" | "tv" | "umbrella-waves" | "virus" | "wallet" | "wallet-arrow-in" | "wallet-arrow-in_badge-link" | "wallet-arrow-out" | "warehouse" | "whatsapp" | "wordpress-logo";

export const iconNames = Object.keys(iconAssets) as IconName[];

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Имя иконки из экспортированной библиотеки Figma. */
  name: IconName;
  /** Размер иконки в px. */
  size?: number;
  /** Доступное имя для самостоятельной иконки. */
  title?: string;
  /** Цвет монохромной иконки. */
  color?: string;
}

// These SVGs contain intentional multiple fills (for example, the white
// center of the cursor). CSS masks keep only alpha and would flatten them.
const colorAssetPrefixes = ['multicolor/', 'flag_chevron/', 'cursors/'];

function isColorAsset(name: IconName) {
  return colorAssetPrefixes.some((prefix) => name.startsWith(prefix));
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Icon({
  name,
  size = 24,
  title,
  color,
  className,
  style,
  ...props
}: IconProps) {
  const svg = iconAssets[name];
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const iconStyle = {
    ...style,
    '--fdoc-icon-size': `${size}px`,
    ...(color ? { color } : {}),
  } as CSSProperties;
  const accessibleProps = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true as const };

  if (isColorAsset(name)) {
    return (
      <img
        {...props}
        {...accessibleProps}
        className={joinClassNames('fdoc-icon', 'fdoc-icon--color', className)}
        style={iconStyle}
        src={dataUrl}
        alt={title ?? ''}
        data-icon={name}
      />
    );
  }

  const maskStyle = {
    ...iconStyle,
    '--fdoc-icon-mask': `url("${dataUrl}")`,
  } as CSSProperties;

  return (
    <span
      {...props}
      {...accessibleProps}
      className={joinClassNames('fdoc-icon', className)}
      style={maskStyle}
      data-icon={name}
    />
  );
}
