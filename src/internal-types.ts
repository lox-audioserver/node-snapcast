import type net from 'node:net';
import type { WebSocket } from 'ws';
import type { AudioOutputSettings } from './types.js';

/** Internal types for the Snapcast core implementation (not exported publicly). */

export type SnapcastVolume = {
  muted: boolean;
  percent: number;
};

export type SnapcastClient = {
  socket: WebSocket | net.Socket;
  transport: 'ws' | 'tcp';
  buffer: Buffer;
  clientId: string | null;
  requestedStreamId: string;
  streamId: string;
  lastHelloId: number | null;
  connectedAt: number;
};

export type SnapcastClientConfig = {
  instance: number;
  latency: number;
  name: string;
  volume: SnapcastVolume;
  host: {
    arch: string;
    ip: string;
    mac: string;
    name: string;
    os: string;
  };
  snapclient: {
    name: string;
    protocolVersion: number;
    version: string;
  };
};

export type SnapcastGroupState = {
  id: string;
  name: string;
  muted: boolean;
  streamId: string;
  clientIds: Set<string>;
};

export type RpcStream = {
  id: string;
  uri: string;
};

export type ActiveStream = {
  streamId: string;
  zoneId: number;
  output: AudioOutputSettings;
  bytesPerFrame: number;
  targetBytes: number;
  nextTimestampUs: number;
  chunkBuffer: Buffer;
  source: NodeJS.ReadableStream;
  cleanup: () => void;
};
