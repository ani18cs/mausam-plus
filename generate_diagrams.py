import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("assets", exist_ok=True)

def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title Banner
    ax.text(50, 96.5, "Mausam+ System Architecture & Data Flow Topology", fontsize=15, fontweight='bold', color='#38BDF8', ha='center')
    ax.text(50, 93, "Ministry of Earth Sciences (MoES) / IMD — SIH Problem Statement 26076", fontsize=9, color='#94A3B8', ha='center')

    # Box Helper Function
    def draw_box(x, y, w, h, bg_color, border_color, title, subtitle="", items=[], title_color="#FFFFFF"):
        rect_shadow = patches.FancyBboxPatch((x+0.5, y-0.5), w, h, boxstyle="round,pad=0.5,rounding_size=1.5",
                                             facecolor='#000000', edgecolor='none', alpha=0.4, zorder=2)
        ax.add_patch(rect_shadow)
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5,rounding_size=1.5",
                                      facecolor=bg_color, edgecolor=border_color, linewidth=1.5, zorder=3)
        ax.add_patch(rect)
        
        ty = y + h - 2.5
        ax.text(x + w/2, ty, title, fontsize=9.5, fontweight='bold', color=title_color, ha='center', zorder=4)
        if subtitle:
            ty -= 2.2
            ax.text(x + w/2, ty, subtitle, fontsize=7.5, fontweight='bold', color='#38BDF8', ha='center', zorder=4)
        
        ty -= 2.2
        for item in items:
            ax.text(x + 2, ty, f"- {item}", fontsize=7.2, color='#E2E8F0', ha='left', zorder=4)
            ty -= 2.0

    # 1. CLIENT TIER (Top)
    draw_box(
        5, 68, 90, 22,
        bg_color='#1E293B', border_color='#0284C7',
        title="1. CITIZEN CLIENT APPLICATION TIER (Cross-Platform Mobile & Web)",
        subtitle="React 18 • Vite • TypeScript • TailwindCSS • Capacitor 8 Native Mobile Runtime",
        items=[
            "Full-Screen Hero: Google Weather-scale live condition scenes & dynamic animated Lottie graphics.",
            "Universal Card System: Real-time mathematical persona ranking for 8 citizen user classes.",
            "Explainable WhyModal: Transparent biometeorological formula traces (WBGT & CPCB NAQI).",
            "Hardware Native Bridges: GPS Geolocation, Camera Hazard Capture, Voice STT/TTS, Push Alerts.",
            "3-Language System: English, Hindi, and Kannada with native Noto typography scales."
        ],
        title_color="#38BDF8"
    )

    # Arrow Down 1
    ax.annotate('', xy=(50, 56.5), xytext=(50, 67),
                arrowprops=dict(facecolor='#38BDF8', edgecolor='#0284C7', width=2, headwidth=7, headlength=7), zorder=5)
    ax.text(52, 62, "JSON REST / WebSocket (CORS-Locked Single Origin)", fontsize=7, color='#94A3B8', zorder=6)

    # 2. BFF TIER (Middle)
    draw_box(
        5, 34, 90, 22,
        bg_color='#1E293B', border_color='#059669',
        title="2. BACKEND-FOR-FRONTEND (BFF) SERVICE TIER (Node.js 20 LTS / Express / Multi-Stage Docker)",
        subtitle="High-Throughput Stateless Microservice Architecture with Sub-10ms Response Latency",
        items=[
            "Weather Aggregator: Live multi-variable Open-Meteo Numerical Weather & Marine Swell fetcher.",
            "Redis & In-Memory LRU Cache: 12-minute forecast TTL, 30-minute AI vector query TTL.",
            "Dual-Retrieval RAG Engine: Dense TF-IDF semantic vector search over MoES/NDMA disaster SOPs.",
            "Explainability Trace Engine: Biometeorological Apparent Load & evaporative sweat loss computation.",
            "Notification Dispatcher: Localized hazard alert generator with WebPush & Native Push delivery."
        ],
        title_color="#34D399"
    )

    # Arrow Down 2
    ax.annotate('', xy=(27, 24), xytext=(27, 33.5),
                arrowprops=dict(facecolor='#38BDF8', edgecolor='#0284C7', width=2, headwidth=6, headlength=6), zorder=5)
    ax.annotate('', xy=(73, 24), xytext=(73, 33.5),
                arrowprops=dict(facecolor='#F59E0B', edgecolor='#D97706', width=2, headwidth=6, headlength=6), zorder=5)

    # 3. GATEWAYS & GROUNDING (Bottom 2 Boxes)
    draw_box(
        5, 2, 43, 21,
        bg_color='#1E293B', border_color='#0284C7',
        title="3. LIVE METEOROLOGICAL TELEMETRY",
        subtitle="Real-Time Sensor & Numerical Gateways",
        items=[
            "Open-Meteo Numerical Weather API (High-Res)",
            "Open-Meteo Marine Coastal Swell Model",
            "CPCB National Air Quality Sensor Network",
            "Reverse Geocoding & Bounding Box Resolution"
        ],
        title_color="#38BDF8"
    )

    draw_box(
        52, 2, 43, 21,
        bg_color='#1E293B', border_color='#F59E0B',
        title="4. DISASTER & REGULATORY GROUNDING",
        subtitle="Authoritative Government Standards",
        items=[
            "IMD NWFC Daily Bulletins & Cyclone Outlooks",
            "NDMA National Heatwave & Flood SOPs",
            "INCOIS Coastal Ocean State Warning Protocols",
            "CPCB National Air Quality Index (NAQI) Bands"
        ],
        title_color="#FBBF24"
    )

    plt.tight_layout()
    out_path = "assets/architecture_diagram.png"
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {out_path}")


def create_methodology_flowchart():
    fig, ax = plt.subplots(figsize=(10, 6.0), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 96.5, "Mausam+ End-to-End Implementation & Telemetry Flowchart", fontsize=15, fontweight='bold', color='#38BDF8', ha='center')
    ax.text(50, 93, "Live Ingestion, Biometeorological Computing, Persona Ranking & Native Delivery", fontsize=9, color='#94A3B8', ha='center')

    # 5 Sequential Process Nodes
    nodes = [
        ("Step 1: Input & Context", "GPS Coordinates /\nCity Autocomplete\n+ Citizen Personas", "#0284C7", 4),
        ("Step 2: BFF Telemetry", "Redis Cache Lookup\n(Hit: 2ms / Miss:\nLive Open-Meteo Ingest)", "#059669", 23.5),
        ("Step 3: Biometeorology", "Compute WBGT,\nEvapotranspiration,\nSwell & Heat Load", "#D97706", 43),
        ("Step 4: Card Ranking", "Universal Card Engine\nFilters & Ranks 4-6\nOpted-in High-Signal Tiles", "#7C3AED", 62.5),
        ("Step 5: Explainable UI", "Full-Screen Hero +\nLottie Condition Scenes\n+ WhyModal Reason Trace", "#0D9488", 82),
    ]

    for title, desc, col, x_pos in nodes:
        rect_shadow = patches.FancyBboxPatch((x_pos+0.5, 45-0.5), 14, 38, boxstyle="round,pad=0.5,rounding_size=1.2",
                                             facecolor='#000000', edgecolor='none', alpha=0.4, zorder=2)
        ax.add_patch(rect_shadow)
        rect = patches.FancyBboxPatch((x_pos, 45), 14, 38, boxstyle="round,pad=0.5,rounding_size=1.2",
                                      facecolor='#1E293B', edgecolor=col, linewidth=1.8, zorder=3)
        ax.add_patch(rect)
        
        h_rect = patches.FancyBboxPatch((x_pos, 75), 14, 8, boxstyle="round,pad=0.2,rounding_size=0.8",
                                        facecolor=col, edgecolor='none', zorder=4)
        ax.add_patch(h_rect)
        ax.text(x_pos + 7, 79, title.split(':')[0], fontsize=8, fontweight='bold', color='#FFFFFF', ha='center', zorder=5)
        ax.text(x_pos + 7, 76.5, title.split(':')[1].strip() if ':' in title else '', fontsize=6.8, fontweight='bold', color='#FFFFFF', ha='center', zorder=5)

        lines = desc.split('\n')
        curr_y = 68
        for line in lines:
            ax.text(x_pos + 7, curr_y, line, fontsize=7.2, color='#E2E8F0', ha='center', zorder=5)
            curr_y -= 4.2

    # Flow Arrows between nodes
    for i in range(4):
        x1 = nodes[i][3] + 14.5
        x2 = nodes[i+1][3] - 0.5
        ax.annotate('', xy=(x2, 64), xytext=(x1, 64),
                    arrowprops=dict(facecolor='#38BDF8', edgecolor='#0284C7', width=2.5, headwidth=6, headlength=6), zorder=6)

    # Bottom Parallel Branch: Conversational RAG Engine
    rag_shadow = patches.FancyBboxPatch((15.5, 6.5), 69, 28, boxstyle="round,pad=0.5,rounding_size=1.2",
                                       facecolor='#000000', edgecolor='none', alpha=0.4, zorder=2)
    ax.add_patch(rag_shadow)
    rag_box = patches.FancyBboxPatch((15, 7), 69, 28, boxstyle="round,pad=0.5,rounding_size=1.2",
                                     facecolor='#1E293B', edgecolor='#F59E0B', linewidth=1.5, zorder=3)
    ax.add_patch(rag_box)

    ax.text(50, 30, "PARALLEL DUAL-RETRIEVAL CONVERSATIONAL AI & VOICE ENGINE", fontsize=9.5, fontweight='bold', color='#FBBF24', ha='center', zorder=4)
    ax.text(50, 26, "Native Voice Input (STT) -> Intent Classifier -> Meteorological Tool Calling + Dense Vector SOP Retrieval", fontsize=7.8, color='#E2E8F0', ha='center', zorder=4)
    ax.text(50, 21.5, "- Grounded in 9 MoES / NDMA / CPCB authoritative standard operating procedures.", fontsize=7.5, color='#94A3B8', ha='center', zorder=4)
    ax.text(50, 17.5, "- Synthesizes natural multilingual audio playback (TTS) in English, Hindi, and Kannada.", fontsize=7.5, color='#94A3B8', ha='center', zorder=4)
    ax.text(50, 13.5, "- Exposes inspectable auditTrail verifying tools executed and exact knowledge chunk citations.", fontsize=7.5, color='#34D399', ha='center', zorder=4)

    # Connecting vertical arrows
    ax.annotate('', xy=(30, 36), xytext=(30, 44),
                arrowprops=dict(facecolor='#F59E0B', edgecolor='#D97706', width=2, headwidth=5, headlength=5), zorder=6)
    ax.annotate('', xy=(70, 44), xytext=(70, 36),
                arrowprops=dict(facecolor='#38BDF8', edgecolor='#0284C7', width=2, headwidth=5, headlength=5), zorder=6)

    plt.tight_layout()
    out_path = "assets/methodology_flowchart.png"
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {out_path}")


def create_persona_diagram():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96, "Universal Card System & Two-Way Personalization Engine", fontsize=15, fontweight='bold', color='#38BDF8', ha='center')
    ax.text(50, 92.5, "Dynamic Mathematical Ranking vs. Collapsible 'More Categories' Drawer", fontsize=9, color='#94A3B8', ha='center')

    # Left Box: 8 Citizen Personas
    p_rect = patches.FancyBboxPatch((5, 10), 26, 75, boxstyle="round,pad=0.5,rounding_size=1.2",
                                    facecolor='#1E293B', edgecolor='#0284C7', linewidth=1.5)
    ax.add_patch(p_rect)
    ax.text(18, 80, "8 Citizen Personas", fontsize=10, fontweight='bold', color='#38BDF8', ha='center')
    personas = [
        "[1] Outdoor Fitness & Cardio",
        "[2] Health & Respiratory",
        "[3] Agriculture & Farming",
        "[4] Coastal & Beachgoer",
        "[5] Commuter & Transit",
        "[6] Traveler & Aviation",
        "[7] Outdoor Event Planner",
        "[8] Family & Vulnerable Care"
    ]
    py = 72
    for p in personas:
        ax.text(7, py, p, fontsize=7.5, color='#F8FAFC')
        py -= 8

    # Center Box: Ranking Matrix
    m_rect = patches.FancyBboxPatch((35, 10), 30, 75, boxstyle="round,pad=0.5,rounding_size=1.2",
                                    facecolor='#1E293B', edgecolor='#059669', linewidth=1.5)
    ax.add_patch(m_rect)
    ax.text(50, 80, "Universal Card Engine", fontsize=10, fontweight='bold', color='#34D399', ha='center')
    ax.text(50, 75, "Math Relevance Scoring", fontsize=8, color='#94A3B8', ha='center')
    
    ax.text(50, 66, "Score = Sum(Persona Weights)", fontsize=8, fontweight='bold', color='#FBBF24', ha='center')
    ax.text(50, 60, "+ Pinned Cards Boost (+5)", fontsize=8, fontweight='bold', color='#FBBF24', ha='center')
    ax.text(50, 54, "+ Active Alert Severity (+10)", fontsize=8, fontweight='bold', color='#FBBF24', ha='center')

    ax.text(50, 42, "Filters 8 Cards down to", fontsize=8, color='#E2E8F0', ha='center')
    ax.text(50, 36, "4-6 Primary High-Signal Cards", fontsize=8.5, fontweight='bold', color='#38BDF8', ha='center')
    ax.text(50, 28, "Unselected cards routed to", fontsize=8, color='#E2E8F0', ha='center')
    ax.text(50, 22, "'More Categories' Drawer", fontsize=8.5, fontweight='bold', color='#F59E0B', ha='center')
    ax.text(50, 15, "with '+ Pin to Home' Action", fontsize=7.5, color='#94A3B8', ha='center')

    # Right Box: 8 Reusable Weather Tiles
    c_rect = patches.FancyBboxPatch((69, 10), 26, 75, boxstyle="round,pad=0.5,rounding_size=1.2",
                                    facecolor='#1E293B', edgecolor='#F59E0B', linewidth=1.5)
    ax.add_patch(c_rect)
    ax.text(82, 80, "8 Reusable Tiles", fontsize=10, fontweight='bold', color='#FBBF24', ha='center')
    cards = [
        "[A] Heat-Stress Index (WBGT)",
        "[B] CPCB NAQI Air Quality",
        "[C] Prime Running Window",
        "[D] Marine Swell & Tides",
        "[E] Commute Transit Delay",
        "[F] Topsoil & Sowing Window",
        "[G] Travel Packing & Flights",
        "[H] 7-Day Event Comfort"
    ]
    cy = 72
    for c in cards:
        ax.text(71, cy, c, fontsize=7.5, color='#F8FAFC')
        cy -= 8

    # Connecting Arrows
    ax.annotate('', xy=(34, 47.5), xytext=(31.5, 47.5),
                arrowprops=dict(facecolor='#38BDF8', edgecolor='#0284C7', width=2, headwidth=6, headlength=6))
    ax.annotate('', xy=(68, 47.5), xytext=(65.5, 47.5),
                arrowprops=dict(facecolor='#F59E0B', edgecolor='#D97706', width=2, headwidth=6, headlength=6))

    plt.tight_layout()
    out_path = "assets/persona_card_matrix.png"
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {out_path}")

if __name__ == "__main__":
    create_architecture_diagram()
    create_methodology_flowchart()
    create_persona_diagram()
