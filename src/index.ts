/**
 * @fileoverview SVGR type definitions - shared contract between API and clients.
 * Provides types for image-to-SVG conversion requests/responses and helper functions
 * for constructing standardized API responses.
 * @module @sudobility/svgr_types
 */

// ============================================
// Re-exports from @sudobility/types
// ============================================
export type {
  ApiResponse,
  BaseResponse,
  ConsumableBalanceResponse,
  ConsumableUseResponse,
  ConsumablePurchaseRecord,
  ConsumableUsageRecord,
} from '@sudobility/types';

// Local import for use in type aliases and helper functions below
import type {
  BaseResponse,
  ConsumableBalanceResponse,
  ConsumableUseResponse,
  ConsumablePurchaseRecord,
  ConsumableUsageRecord,
} from '@sudobility/types';

// ============================================
// Request Types
// ============================================

/**
 * Controls how the image is preprocessed before vectorization.
 * The full taxonomy is shared across clients and backend so the frontend can
 * release new modes gradually without changing the contract later.
 * - `auto` — auto-detect the most suitable profile
 * - `photo` — generic compatibility photo profile
 * - `gray_scale` — grayscale or monochrome photos with optional global tint
 * - `design` — generic compatibility design profile
 * - `photo_portrait` — portraits and people-focused photos
 * - `photo_product` — product shots and isolated commercial photography
 * - `photo_scene` — general daytime or mixed-scene photography
 * - `photo_night` — dark scenes with bright local lights and glow
 * - `line_art` — high-contrast technical or drawn line work
 * - `logo` — flat brand marks and clean vector-like symbols
 * - `illustration` — general illustration and painted/vector art
 * - `manga` — manga pages, ink lines, screentones, and bubbles
 * - `poster` — text-heavy mixed graphic layouts
 * - `screenshot_ui` — application or web UI screenshots
 * - `diagram` — flowcharts, node graphs, arrows, and labeled diagrams
 * - `blueprint_cad` — technical drawings, blueprints, and CAD-like exports
 * - `map` — maps with roads, regions, labels, and cartographic symbols
 * - `chart_graph` — charts, graphs, axes, legends, and plotted data
 * - `icon_sheet` — many small icon-like components on one canvas
 * - `sticker_sheet` — multiple isolated sticker or cutout graphics
 * - `comic_western` — western-style comics with flatter fills and bubbles
 * - `pixel_art` — pixel-grid artwork with hard stepped edges
 * - `engraving` — dense hatch and engraving-like monochrome art
 * - `watercolor` — soft wash-based illustrations
 * - `oil_painting` — painterly scenes with broad textured brush regions
 * - `flat_infographic` — flat graphic explainers with icons and blocks
 * - `packaging_label` — packaging art with borders, text, and logos
 * - `document_scan` — scanned or photographed documents
 * - `handwritten_note` — handwriting on paper or note-like surfaces
 * - `whiteboard` — whiteboard or marker-board captures
 * - `signature` — sparse signature-style stroke content
 * - `tattoo_flash` — bold isolated tattoo flash artwork
 * - `silhouette_cutout` — simple contour-first silhouettes or cutouts
 * - `emoji_moji` — emoji-like or mascot-like simple illustrations
 */
export type ImageType =
  | 'auto'
  | 'photo'
  | 'gray_scale'
  | 'design'
  | 'photo_portrait'
  | 'photo_product'
  | 'photo_scene'
  | 'photo_night'
  | 'line_art'
  | 'logo'
  | 'illustration'
  | 'manga'
  | 'poster'
  | 'screenshot_ui'
  | 'diagram'
  | 'blueprint_cad'
  | 'map'
  | 'chart_graph'
  | 'icon_sheet'
  | 'sticker_sheet'
  | 'comic_western'
  | 'pixel_art'
  | 'engraving'
  | 'watercolor'
  | 'oil_painting'
  | 'flat_infographic'
  | 'packaging_label'
  | 'document_scan'
  | 'handwritten_note'
  | 'whiteboard'
  | 'signature'
  | 'tattoo_flash'
  | 'silhouette_cutout'
  | 'emoji_moji';

/** All valid ImageType values. */
export const IMAGE_TYPES: readonly ImageType[] = [
  'auto',
  'photo',
  'gray_scale',
  'design',
  'photo_portrait',
  'photo_product',
  'photo_scene',
  'photo_night',
  'line_art',
  'logo',
  'illustration',
  'manga',
  'poster',
  'screenshot_ui',
  'diagram',
  'blueprint_cad',
  'map',
  'chart_graph',
  'icon_sheet',
  'sticker_sheet',
  'comic_western',
  'pixel_art',
  'engraving',
  'watercolor',
  'oil_painting',
  'flat_infographic',
  'packaging_label',
  'document_scan',
  'handwritten_note',
  'whiteboard',
  'signature',
  'tattoo_flash',
  'silhouette_cutout',
  'emoji_moji',
] as const;

/**
 * Request payload for POST /convert endpoint.
 *
 * Contains a raster image to be converted to SVG along with optional conversion parameters.
 *
 * @interface ConvertRequest
 * @property {string} original - Base64-encoded raster image data (PNG, JPG, WEBP, BMP, or GIF format)
 * @property {string} [filename] - Optional filename for metadata or audit purposes
 * @property {number} [quality] - Conversion quality level from 1 to 10, where 1 produces the smallest file
 *   and 10 produces the highest fidelity output. Default is 5 for balanced results.
 * @property {boolean} [transparentBg] - If true, removes the background from the resulting SVG,
 *   making it transparent. Default is false.
 *
 * @example
 * const request: ConvertRequest = {
 *   original: 'data:image/png;base64,...',
 *   filename: 'logo.png',
 *   quality: 7,
 *   transparentBg: true
 * };
 */
export interface ConvertRequest {
  /** Base64-encoded raster image (PNG, JPG, WEBP, BMP, GIF) */
  original: string;
  /** Optional filename for metadata */
  filename?: string;
  /** Quality level 1-10 (1 = smallest file, 10 = highest fidelity). Default: 5 */
  quality?: number;
  /** Remove the background from the SVG, making it transparent. Default: false */
  transparentBg?: boolean;
  /** Run OCR to detect text and emit editable SVG `<text>` elements. Default: true */
  ocr?: boolean;
  /** Aggressively merge small and thin vector paths into their neighbors. Default: true */
  mergePaths?: boolean;
  /** Smoothing level 0-3 for the output SVG paths. Default: 0 (no smoothing) */
  smooth?: number;
  /** Image type for preprocessing. Default: 'auto' */
  imageType?: ImageType;
  /** Decompose into color-clustered layers before vectorization. Default: false */
  layers?: boolean;
}

// ============================================
// Response Types
// ============================================

/**
 * Result returned from a successful SVG conversion.
 *
 * Contains a cache ID for retrieving the converted SVG and metadata about the
 * original image dimensions. The SVG content is stored server-side and can be
 * fetched separately via `GET /api/v1/svg/:cacheId` which returns the raw SVG
 * with `Content-Type: image/svg+xml`.
 *
 * @interface ConvertResult
 * @property {string} cacheId - Unique ID for retrieving the cached SVG from `GET /api/v1/svg/:cacheId`
 * @property {number} width - Width of the original raster image in pixels
 * @property {number} height - Height of the original raster image in pixels
 *
 * @example
 * const result: ConvertResult = {
 *   cacheId: 'abc123-def456',
 *   width: 500,
 *   height: 500
 * };
 */
export interface ConvertResult {
  /** Unique ID for retrieving the cached SVG via GET /api/v1/svg/:cacheId */
  cacheId: string;
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
  /** Size of the generated SVG in bytes */
  svgSizeBytes?: number;
}

// ============================================
// Response Type Aliases
// ============================================
/**
 * Full API response for conversion requests.
 *
 * A discriminated union type that wraps a {@link ConvertResult} in the standard response envelope.
 * When success is true, includes the conversion result; when false, includes an error message.
 *
 * This type alias uses the {@link BaseResponse} generic from @sudobility/types, which provides:
 * - `success: boolean` - Whether the operation succeeded
 * - `data?: ConvertResult` - Present only when success is true
 * - `error?: string` - Present only when success is false
 * - `timestamp: string` - ISO 8601 timestamp of the response
 *
 * @typedef {BaseResponse<ConvertResult>} ConvertResponse
 *
 * @example
 * // Success response
 * const success: ConvertResponse = {
 *   success: true,
 *   data: { cacheId: 'abc123-def456', width: 500, height: 500 },
 *   timestamp: '2026-02-23T12:34:56.789Z'
 * };
 *
 * @example
 * // Error response
 * const error: ConvertResponse = {
 *   success: false,
 *   error: 'Invalid image format',
 *   timestamp: '2026-02-23T12:34:56.789Z'
 * };
 */
export type ConvertResponse = BaseResponse<ConvertResult>;

// ============================================
// Image Upload Types
// ============================================

/** Result of uploading an image to the server for persistent storage. */
export interface ImageUploadResult {
  /** Server-assigned image UUID. */
  imageId: string;
  /** The user's original filename. */
  originalFilename: string;
  /** Natural pixel width. */
  width: number;
  /** Natural pixel height. */
  height: number;
  /** File size in bytes. */
  fileSizeBytes: number;
}

/** Response from POST /api/v1/images/upload. */
export type ImageUploadResponse = BaseResponse<ImageUploadResult>;

// ============================================
// Job Types
// ============================================

/** Status of a conversion job. */
export type JobStatus =
  'pending' | 'processing' | 'done' | 'error' | 'cancelled';

/** Request body for POST /api/v1/jobs. */
export interface CreateJobRequest {
  /** UUID of the previously uploaded image. */
  imageId: string;
  /** Vectorization quality 1-10. Default: 5. */
  quality?: number;
  /** Remove background path. Default: false. */
  transparentBg?: boolean;
  /** Run OCR text recognition. Default: true. */
  ocr?: boolean;
  /** Merge small vector paths. Default: true. */
  mergePaths?: boolean;
  /** Smoothing level 0-3. Default: 0. */
  smooth?: number;
  /** Image preprocessing profile. Default: 'auto'. */
  imageType?: ImageType;
  /** Decompose into color-clustered layers. Default: false. */
  layers?: boolean;
}

/** A conversion job record returned by job endpoints. */
export interface JobResult {
  jobId: string;
  imageId: string;
  status: JobStatus;
  errorMessage?: string;
  quality: number;
  transparentBg: boolean;
  ocr: boolean;
  mergePaths: boolean;
  smooth: number;
  imageType: string;
  layers: boolean;
  apiVersion: string;
  svgFilename?: string;
  previewFilename?: string;
  svgWidth?: number;
  svgHeight?: number;
  svgSizeBytes?: number;
  dedupJobId?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

/** Response from POST /api/v1/jobs. */
export type CreateJobResponse = BaseResponse<JobResult>;

/** Response from GET /api/v1/jobs/:jobId. */
export type JobStatusResponse = BaseResponse<JobResult>;

/** Response from GET /api/v1/jobs?imageId=... */
export type JobListResponse = BaseResponse<JobResult[]>;

/** Response from POST /api/v1/jobs/:jobId/cancel. */
export type CancelJobResponse = BaseResponse<JobResult>;

// ============================================
// Image History Types
// ============================================

/** An uploaded image with all its conversion jobs. */
export interface ImageWithJobs {
  imageId: string;
  originalFilename: string;
  /** UUID-based filename on disk for fetching via /api/v1/files/. */
  storageFilename: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  createdAt: string;
  jobs: JobResult[];
}

/** Response from GET /api/v1/images. */
export type ImageListResponse = BaseResponse<ImageWithJobs[]>;

// ============================================
// Consumable Response Type Aliases
// ============================================

/** API response for GET /consumables/balance */
export type BalanceResponse = BaseResponse<ConsumableBalanceResponse>;

/** API response for POST /consumables/purchase */
export type PurchaseResponse = BaseResponse<ConsumableBalanceResponse>;

/** API response for POST /consumables/use */
export type UseResponse = BaseResponse<ConsumableUseResponse>;

/** API response for GET /consumables/purchases */
export type PurchaseHistoryResponse = BaseResponse<ConsumablePurchaseRecord[]>;

/** API response for GET /consumables/usages */
export type UsageHistoryResponse = BaseResponse<ConsumableUsageRecord[]>;

/**
 * Result data from the RevenueCat webhook handler.
 *
 * @property {boolean} alreadyProcessed - Whether this transaction was already recorded (idempotent replay)
 * @property {number} balance - The user's current credit balance after processing
 */
export interface WebhookResult {
  /** Whether this transaction was already recorded (idempotent replay) */
  alreadyProcessed: boolean;
  /** The user's current credit balance after processing */
  balance: number;
}

/** API response for POST /consumables/webhook */
export type WebhookResponse = BaseResponse<WebhookResult>;

/**
 * API response for acknowledgement messages (e.g., ignored webhook events).
 *
 * @property {string} message - A human-readable message describing the acknowledgement
 */
export interface AckResult {
  /** A human-readable acknowledgement message */
  message: string;
}

/** API response with a simple acknowledgement message */
export type AckResponse = BaseResponse<AckResult>;

/** API response for the GET /health endpoint */
export interface HealthResult {
  /** Server health status */
  status: string;
}

/** API response for the health check endpoint */
export type HealthResponse = BaseResponse<HealthResult>;

// ============================================
// Community Types
// ============================================

/** Supported community platform types. */
export const COMMUNITY_PLATFORMS = [
  'forum',
  'discord',
  'reddit',
  'telegram',
  'slack',
  'facebook',
  'youtube',
  'other',
] as const;

/** A community platform type (forum, discord, reddit, etc.). */
export type CommunityPlatform = (typeof COMMUNITY_PLATFORMS)[number];

/** A designer community entry. */
export interface Community {
  /** Unique community ID (UUID). */
  id: string;
  /** Language code this community serves (e.g., 'en', 'ja'). */
  language: string;
  /** Community name in native language. */
  name: string;
  /** English name, if the community has one. */
  nameEnglish: string | null;
  /** Short description in native language. */
  description: string;
  /** URL to the community. */
  url: string;
  /** Platform type. */
  platform: CommunityPlatform;
  /** Display ordering within a language. */
  sortOrder: number;
  /** URL to community logo or favicon. */
  iconUrl: string | null;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

/** API response for GET /api/v1/communities. */
export type CommunitiesResponse = BaseResponse<Community[]>;

// ============================================
// Helper Functions
// ============================================

/**
 * Constructs a successful API response with the given data.
 *
 * Wraps arbitrary data in the standard {@link BaseResponse} success envelope with a current timestamp.
 * The generic type parameter T allows the data to be any shape.
 *
 * @template T - The type of data being returned
 * @param {T} data - The conversion result or other data to include in the success response
 * @returns {BaseResponse<T>} A success response object with success=true, data, and timestamp
 *
 * @example
 * // For ConvertResult
 * const response = successResponse({
 *   cacheId: 'abc123-def456',
 *   width: 100,
 *   height: 100
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: { cacheId: 'abc123-def456', width: 100, height: 100 },
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 *
 * @example
 * // Generic usage with any data type
 * const msgResponse = successResponse({ message: 'Processing started' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: { message: 'Processing started' },
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Constructs an error API response with the given error message.
 *
 * Creates a standard {@link BaseResponse} error envelope with success=false, no data field,
 * and a current timestamp. The return type uses `never` for the generic parameter to indicate
 * that successful data cannot exist in error responses.
 *
 * @param {string} error - A descriptive error message
 * @returns {BaseResponse<never>} An error response object with success=false, error message, and timestamp
 *
 * @example
 * // For conversion errors
 * const response = errorResponse('Invalid image format: expected PNG, JPG, WEBP, BMP, or GIF');
 * // Returns:
 * // {
 * //   success: false,
 * //   error: 'Invalid image format: expected PNG, JPG, WEBP, BMP, or GIF',
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 *
 * @example
 * // For other errors
 * const response = errorResponse('Quality must be between 1 and 10');
 * // Returns:
 * // {
 * //   success: false,
 * //   error: 'Quality must be between 1 and 10',
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}
