## ADDED Requirements

### Requirement: The publish transport SHALL support a Chromium-stack channel in the Electron host

The publish transport SHALL provide an `electron-session-fetch` channel that issues requests through Electron's `session.fetch` (the Chromium network stack), in addition to the existing `plugin-node-fetch`, `siyuan-forward-proxy`, and `middleware-fetch` channels.

The channel SHALL be implemented inside the existing transport facade and SHALL NOT introduce a new public entry point, so that platform adaptors keep depending on `publishTransport` rules rather than on a concrete channel.

#### Scenario: A platform requires the Chromium-stack channel

- **GIVEN** a platform whose XML-RPC endpoint is unreachable through the Node fetch channel
- **WHEN** the transport is resolved for that platform
- **THEN** the resolver SHALL select `electron-session-fetch`
- **AND** the request SHALL be issued through Electron's `session.fetch`

#### Scenario: Another platform publishes

- **GIVEN** a platform that does not declare the Chromium-stack channel
- **WHEN** the transport is resolved
- **THEN** the previously selected channel SHALL be unchanged
- **AND** no platform outside the declaring one SHALL change behaviour

### Requirement: The Chromium-stack channel SHALL fall back when unavailable

When the host cannot provide `session.fetch` (for example a browser-only form factor), the resolver SHALL fall back to an existing channel and SHALL record the chosen channel in the request diagnostics instead of failing hard.

#### Scenario: The host lacks the capability

- **GIVEN** a host where Electron's `session.fetch` is not available
- **WHEN** a platform declaring the Chromium-stack channel publishes
- **THEN** the resolver SHALL fall back to an existing channel
- **AND** the diagnostics SHALL record which channel was used
- **AND** the publish attempt SHALL NOT be aborted merely because the preferred channel is missing

### Requirement: Session readiness SHALL be established without user interaction

Before the Chromium-stack channel is used for a site, the implementation SHALL ensure the session has already cleared that site's interstitial, by visiting the site once and waiting for it to settle. This step SHALL be idempotent and SHALL NOT require the user to log in or to click anything. The configuration page SHALL surface the resulting readiness state.

#### Scenario: First publish to the site

- **GIVEN** a session that has never visited the site
- **WHEN** the user publishes to that site
- **THEN** the implementation SHALL visit the site once and wait for the interstitial to settle
- **AND** the user SHALL NOT be asked to log in or to interact
- **AND** the publish SHALL proceed once readiness is established

#### Scenario: A later publish to the same site

- **GIVEN** a session that already cleared the interstitial
- **WHEN** the user publishes again
- **THEN** the readiness step SHALL be skipped
- **AND** the publish SHALL proceed directly

### Requirement: XML-RPC authentication SHALL remain parameter-based

The WordPress.com integration SHALL keep passing credentials as XML-RPC method parameters. Adding the Chromium-stack channel SHALL NOT change the authentication mechanism, the XML-RPC method set, or the platform's user-visible configuration fields beyond the readiness indication.

#### Scenario: Credentials are supplied

- **GIVEN** a configured WordPress.com account
- **WHEN** an XML-RPC call is made
- **THEN** the credentials SHALL be passed as method parameters
- **AND** the request SHALL NOT depend on session cookies for authentication
