# radio-proxy-2

node.js proxy server for streaming shoutcast / icecast style audio and passing now-playing info to clients via socket.io

## Why radio-proxy-2?

Radio-proxy-2 is the same _concept_ as [the original radio-proxy](https://github.com/pfbrowning/radio-proxy), but I realized that it would actually be less work to re-start from scratch than to upgrade and refactor [the original](https://github.com/pfbrowning/radio-proxy) to meet my standards.

The biggest conceptual difference is that I intend to keep radio-proxy-2 stateless because I now realize that a client-side NGRX store is a much more appropriate tool for "keeping tracking of the now-playing info for multiple stations simultaneously over time" than a server-side polling mechanism as crudely attempted in [the original radio-proxy](https://github.com/pfbrowning/radio-proxy).

My original desire was to get now-playing updates _in real time_ for multiple stations simultaneously, but in practice I still ended up implementing a polling mechanism server-side anyway. If I'm going to be polling anyway, our NGRX effects is a much better place to do it.

## How to get set up and running

TODO write me please!

## Usage

TODO write me please!

## Backlog

### Loose End Improvements - 0.2.0

- Return RFC-Problemdetails-formatted failure respones
- Local config (.gitignored json?)
- Configure CORS

### Second Core Feature - 0.3.0

- Socket.IO authentication

### Third Core Feature - 0.4.0

- Proxy key stream authentication

### Documentation - 1.0.0

- Finish readme
- Swagger
- Set keywords in package.json
