/** PCM output format settings used for Snapcast streams. */
export type AudioOutputSettings = {
  sampleRate: number;
  channels: number;
  pcmBitDepth: number;
  prebufferBytes?: number;
};

/** Track metadata exposed over the Snapcast JSON-RPC status API. */
export type SnapcastStreamMetadata = {
  title?: string;
  artist?: string[];
  album?: string;
  artUrl?: string;
  duration?: number;
};

/** Stream properties surfaced via Snapcast JSON-RPC status updates. */
export type SnapcastStreamProperties = {
  canControl?: boolean;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  canPause?: boolean;
  canPlay?: boolean;
  canSeek?: boolean;
  loopStatus?: 'none' | 'track' | 'playlist';
  shuffle?: boolean;
  volume?: number;
  playbackStatus?: 'playing' | 'paused' | 'stopped';
  position?: number;
  metadata?: SnapcastStreamMetadata;
};

/** Stream URI shape used by Snapcast status responses. */
export type SnapcastStreamUri = {
  raw: string;
  scheme: string;
  host: string;
  path: string;
  fragment: string;
  query: Record<string, string>;
};

/** Context passed to hooks for stream-specific decisions. */
export type SnapcastStreamContext = {
  streamId: string;
  zoneId: number;
  output: AudioOutputSettings;
};

/** JSON-RPC error payload for hook responses. */
export type SnapcastCommandError = {
  code: number;
  message: string;
};

/** Result for control/property hook handlers. */
export type SnapcastCommandResult = {
  ok: boolean;
  error?: SnapcastCommandError;
};

/** Server metadata for Snapcast JSON-RPC status responses. */
export type SnapcastServerMeta = {
  host: {
    arch: string;
    ip: string;
    mac: string;
    name: string;
    os: string;
  };
  snapserver: {
    controlProtocolVersion: number;
    name: string;
    protocolVersion: number;
    version: string;
  };
};

/** Logger interface used by the core to emit diagnostics. */
export type SnapcastLogger = {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
};

/**
 * Hook callbacks to integrate playback state/control with an external application.
 */
export type SnapcastHooks = {
  getStreamProperties?: (stream: SnapcastStreamContext) => SnapcastStreamProperties | null | undefined;
  getStreamUri?: (stream: SnapcastStreamContext) => SnapcastStreamUri | null | undefined;
  getServerMeta?: () => Partial<SnapcastServerMeta> | null | undefined;
  onStreamControl?: (
    stream: SnapcastStreamContext,
    command: string,
    params: any,
  ) => SnapcastCommandResult | boolean | void;
  onStreamProperty?: (
    stream: SnapcastStreamContext,
    property: string,
    value: any,
    params: any,
  ) => SnapcastCommandResult | boolean | void;
};

/** Core configuration for transport wiring and default server metadata. */
export type SnapcastCoreOptions = {
  hooks?: SnapcastHooks;
  logger?: SnapcastLogger;
  defaultOutput?: AudioOutputSettings;
  serverName?: string;
  serverVersion?: string;
  protocolVersion?: number;
  controlProtocolVersion?: number;
  streamUri?: {
    scheme?: string;
    host?: string;
    port?: number;
    basePath?: string;
  };
};
