## MODIFIED Requirements

### Requirement: Host fetch transport selection
The publish host fetch layer MUST select the correct transport for API, XML-RPC, JSON, and multipart/form-data requests according to host capability and target URL safety. In the SiYuan Electron/plugin host, direct plugin fetch MUST remain the preferred transport when available; local or loopback targets MUST NOT be routed through SiYuan `forwardProxy`.

#### Scenario: XML-RPC uses plugin fetch in Electron host
- **WHEN** `PluginFetchUtil.canUsePluginFetch` is true and an XML-RPC request is issued from the V2 plugin host
- **THEN** the request is executed through the bundled plugin/node fetch path and returns normalized XML text to the caller

#### Scenario: Loopback XML-RPC avoids forwardProxy
- **WHEN** an XML-RPC endpoint is local or loopback, such as `127.0.0.1`, `localhost`, or private local development URLs
- **THEN** the transport selection MUST NOT choose SiYuan `forwardProxy`

#### Scenario: Multipart upload uses plugin fetch when available
- **WHEN** multipart/form-data upload is requested in the Electron/plugin host and direct plugin fetch is available
- **THEN** the upload uses the plugin/node fetch path instead of ad-hoc browser fetch or forwardProxy routing

#### Scenario: Browser fallback remains available
- **WHEN** plugin/node fetch is unavailable and the target is safe for browser middleware execution
- **THEN** the transport layer may fall back to middleware/browser fetch according to the existing transport resolver rules

#### Scenario: Vite 8 build preserves transport behavior
- **WHEN** the project is built with Vite 8 and the V2 plugin is loaded in SiYuan
- **THEN** XML-RPC, JSON fetch, and multipart/form-data transport tests and manual publish flows preserve the same selection order and loopback safety behavior as before the upgrade
