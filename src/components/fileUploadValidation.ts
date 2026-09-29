export type FileUploadValidationReason = 'format' | 'quantity' | 'file-size' | 'total-size';

export interface FileUploadValidationIssue {
  reason: FileUploadValidationReason;
  fileName?: string;
  limit?: number | string;
}

export interface FileUploadValidationConfig {
  formats?: string;
  maxQuantity?: number;
  maxFileSize?: string;
  maxTotalSize?: string;
  currentQuantity?: number;
  currentTotalSize?: string;
  multiple?: boolean;
}

export const FILE_UPLOAD_DEFAULTS = {
  left: {
    formats: '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png',
    maxQuantity: 10,
    maxFileSize: '15 МБ',
    maxTotalSize: '50 МБ',
  },
  center: {
    formats: '.docx, xlsx',
    maxQuantity: 10,
    maxFileSize: '5 МБ',
    maxTotalSize: '50 МБ',
  },
} as const;

function normalizeFormatToken(token: string) {
  const trimmed = token.trim().toLowerCase();
  if (!trimmed) return '';
  if (trimmed.includes('/')) return trimmed;
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
}

export function parseFileFormats(formats: string) {
  return formats
    .split(',')
    .flatMap(part => part.trim().split(/\s+/))
    .map(normalizeFormatToken)
    .filter(Boolean);
}

export function formatsToAccept(formats?: string) {
  if (!formats) return undefined;
  const tokens = parseFileFormats(formats);
  return tokens.length ? tokens.join(',') : undefined;
}

function fileMatchesFormats(file: File, formats: string[]) {
  if (!formats.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return formats.some(format => {
    if (format.includes('/')) {
      if (format.endsWith('/*')) return type.startsWith(format.slice(0, -1));
      return type === format;
    }
    return name.endsWith(format);
  });
}

export function parseFileSizeToBytes(value?: string) {
  if (!value) return 0;
  const normalized = value
    .replace(/\u00a0/g, ' ')
    .replace(',', '.')
    .trim()
    .toLowerCase();
  const match = normalized.match(/([\d.]+)\s*(гб|gb|мб|mb|кб|kb|б|b)?/i);
  if (!match) return undefined;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return undefined;

  const unit = match[2]?.toLowerCase() ?? 'b';
  const multiplier = unit === 'гб' || unit === 'gb'
    ? 1024 ** 3
    : unit === 'мб' || unit === 'mb'
      ? 1024 ** 2
      : unit === 'кб' || unit === 'kb'
        ? 1024
        : 1;

  return amount * multiplier;
}

export function validateFileSelection(files: File[], config: FileUploadValidationConfig) {
  const issues: FileUploadValidationIssue[] = [];
  const currentQuantity = config.currentQuantity ?? 0;
  const currentTotalSizeBytes = parseFileSizeToBytes(config.currentTotalSize) ?? 0;
  const allowedFormats = config.formats ? parseFileFormats(config.formats) : [];
  const maxFileSizeBytes = config.maxFileSize ? parseFileSizeToBytes(config.maxFileSize) : undefined;
  const maxTotalSizeBytes = config.maxTotalSize ? parseFileSizeToBytes(config.maxTotalSize) : undefined;

  if (config.maxQuantity !== undefined) {
    const quantityLimit = config.multiple === false ? Math.min(config.maxQuantity, 1) : config.maxQuantity;
    if (currentQuantity + files.length > quantityLimit) {
      issues.push({ reason: 'quantity', limit: quantityLimit });
    }
  } else if (config.multiple === false && currentQuantity + files.length > 1) {
    issues.push({ reason: 'quantity', limit: 1 });
  }

  for (const file of files) {
    if (config.formats && !fileMatchesFormats(file, allowedFormats)) {
      issues.push({ reason: 'format', fileName: file.name, limit: config.formats });
    }
    if (maxFileSizeBytes !== undefined && file.size > maxFileSizeBytes) {
      issues.push({ reason: 'file-size', fileName: file.name, limit: config.maxFileSize });
    }
  }

  if (maxTotalSizeBytes !== undefined) {
    const selectedSize = files.reduce((sum, file) => sum + file.size, 0);
    if (currentTotalSizeBytes + selectedSize > maxTotalSizeBytes) {
      issues.push({ reason: 'total-size', limit: config.maxTotalSize });
    }
  }

  return issues;
}
