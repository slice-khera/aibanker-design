"use client";

import { StatusBar, AppBar, NavButton, FooterInset, GestureNav } from "../components/AppChrome";
import { typography } from "../lib/typography";
import { VALENTINO_500 } from "../lib/colors";

export default function AppChromeSim() {
  return (
    <div style={{ width: 360, height: 780, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, padding: "12px 0" }}>
        {/* Section: Status Bar */}
        <div style={{ padding: "0 16px" }}>
          <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>App Chrome</p>
          <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4 }}>
            Status bar, app bars, nav buttons, footer, gesture nav
          </p>
        </div>

        {/* Status Bar standalone */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            Status Bar (white)
          </p>
          <StatusBar />
        </div>

        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            Status Bar (tinted)
          </p>
          <StatusBar backgroundColor="#f5f0ff" />
        </div>

        {/* App Bar: Back + Title */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            App Bar \u2014 Back + Title
          </p>
          <AppBar
            leading={<NavButton kind="back" />}
            title="My Goals"
            hideStatusBar
          />
        </div>

        {/* App Bar: Close + Title */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            App Bar \u2014 Close + Title
          </p>
          <AppBar
            leading={<NavButton kind="close" />}
            title="New Goal"
            hideStatusBar
          />
        </div>

        {/* App Bar: With shadow */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            App Bar \u2014 Shadow
          </p>
          <AppBar
            leading={<NavButton kind="back" />}
            title="Settings"
            shadow
            hideStatusBar
          />
        </div>

        {/* App Bar: Brand bg */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            App Bar \u2014 Brand Background
          </p>
          <AppBar
            leading={<NavButton kind="back" />}
            title="Byron"
            backgroundColor="#f5f0ff"
            hideStatusBar
          />
        </div>

        {/* Nav Buttons */}
        <div style={{ padding: "0 16px" }}>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, marginBottom: 8 }}>
            Nav Buttons
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <NavButton kind="back" />
              <span style={{ ...typography.caption, color: "rgba(0,0,0,0.4)" }}>Back</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <NavButton kind="close" />
              <span style={{ ...typography.caption, color: "rgba(0,0,0,0.4)" }}>Close</span>
            </div>
          </div>
        </div>

        {/* Footer Inset */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            Footer Inset
          </p>
          <FooterInset>
            <div style={{ height: 48, borderRadius: 12, backgroundColor: VALENTINO_500, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...typography.buttonSmall, color: "#fff" }}>Continue</span>
            </div>
          </FooterInset>
        </div>

        {/* Gesture Nav */}
        <div>
          <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, padding: "0 16px", marginBottom: 8 }}>
            Gesture Nav
          </p>
          <GestureNav />
        </div>

        <div style={{ height: 24 }} />
      </div>
      <GestureNav />
    </div>
  );
}
