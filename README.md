# node-snapcast

TypeScript/Node.js Snapcast-compatible core. It provides WebSocket + TCP transport handling and a JSON-RPC status/control surface, while delegating playback state and commands via hooks. It is used by lox-audioserver but is generic enough to embed elsewhere.

## Install

```sh
npm install @lox-audioserver/node-snapcast
```

## Quickstart (shared HTTP server)

```ts
import http from 'node:http';
import { SnapcastCore } from '@lox-audioserver/node-snapcast';

const core = new SnapcastCore({
  hooks: {
    getStreamProperties: (stream) => ({
      playbackStatus: 'playing',
      volume: 70,
    }),
    onStreamControl: (_stream, command) => {
      console.log('control', command);
      return { ok: true };
    },
  },
  serverName: 'My Snapcast Server',
  streamUri: { scheme: 'ws', port: 7090, basePath: '/snapcast' },
});

const server = http.createServer((_req, res) => {
  res.writeHead(200);
  res.end('ok');
});

server.on('upgrade', (req, socket, head) => {
  if (!core.handleUpgrade(req, socket, head)) {
    socket.destroy();
  }
});

server.listen(7090);
```

## Pushing audio

```ts
import { SnapcastCore } from '@lox-audioserver/node-snapcast';

const core = new SnapcastCore();
const pcmStream = getPcmReadableStreamSomehow();

core.setStream(
  'stream-1',
  1,
  { sampleRate: 48000, channels: 2, pcmBitDepth: 16 },
  pcmStream,
  ['snapclient-id'],
);
```

## TCP transport

If you want to support native Snapclient TCP connections, accept sockets and pass them to the core:

```ts
import net from 'node:net';
import { SnapcastCore } from '@lox-audioserver/node-snapcast';

const core = new SnapcastCore();
const server = net.createServer((socket) => core.handleTcpConnection(socket));
server.listen(1704);
```

## Hook highlights

- `getStreamProperties`: supplies JSON-RPC status metadata (playback status, volume, metadata, etc.).
- `onStreamControl`: handles RPC commands (play/pause/seek/next/previous).
- `onStreamProperty`: handles RPC property changes (volume/mute/shuffle/repeat).
- `getStreamUri` / `getServerMeta`: override server and stream metadata.