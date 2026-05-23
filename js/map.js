// ============================================
//   YAKEEN INTERNATIONAL — INTERACTIVE MAP
//   Uses Leaflet.js (free, no API key needed)
// ============================================

// Deployment countries with coordinates
const DEPLOYMENT_COUNTRIES = [
  { name: 'Saudi Arabia', flag: '🇸🇦', lat: 23.8859,  lng: 45.0792,  region: 'Middle East',  count: '200+' },
  { name: 'UAE',          flag: '🇦🇪', lat: 23.4241,  lng: 53.8478,  region: 'Middle East',  count: '100+' },
  { name: 'Japan',        flag: '🇯🇵', lat: 36.2048,  lng: 138.2529, region: 'Asia Pacific', count: '50+'  },
  { name: 'Vietnam',      flag: '🇻🇳', lat: 14.0583,  lng: 108.2772, region: 'Asia Pacific', count: '30+'  },
  { name: 'Maldives',     flag: '🇲🇻', lat: 3.2028,   lng: 73.2207,  region: 'Asia Pacific', count: '20+'  },
  { name: 'Malaysia',     flag: '🇲🇾', lat: 4.2105,   lng: 101.9758, region: 'Asia Pacific', count: '40+'  },
  { name: 'Portugal',     flag: '🇵🇹', lat: 39.3999,  lng: -8.2245,  region: 'Europe',       count: '20+'  },
  { name: 'Spain',        flag: '🇪🇸', lat: 40.4637,  lng: -3.7492,  region: 'Europe',       count: '15+'  },
  { name: 'Norway',       flag: '🇳🇴', lat: 60.4720,  lng: 8.4689,   region: 'Europe',       count: '10+'  },
  { name: 'Malta',        flag: '🇲🇹', lat: 35.9375,  lng: 14.3754,  region: 'Europe',       count: '10+'  },
  { name: 'Italy',        flag: '🇮🇹', lat: 41.8719,  lng: 12.5674,  region: 'Europe',       count: '15+'  },
];

// ── Initialize map when DOM is ready ──
document.addEventListener('DOMContentLoaded', function () {
  const mapEl = document.getElementById('world-map');
  if (!mapEl) return; // Only run on pages with a map

  initMap();
});

function initMap() {
  // Create map centered on Middle East/Asia
  const map = L.map('world-map', {
    center: [25, 55],
    zoom: 2.5,
    minZoom: 2,
    maxZoom: 6,
    zoomControl: true,
    scrollWheelZoom: false, // Better UX — disable scroll zoom
    attributionControl: false,
  });

  // Dark tile layer (matches our navy theme)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Custom gold marker icon
  function createMarkerIcon(flag) {
    return L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #C9A030, #E8C45A);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 15px rgba(201,160,48,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 1.1rem;
            line-height: 1;
            display: block;
            text-align: center;
            padding-top: 2px;
          ">${flag}</span>
        </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -44],
    });
  }

  // Add markers for each country
  DEPLOYMENT_COUNTRIES.forEach(country => {
    const marker = L.marker([country.lat, country.lng], {
      icon: createMarkerIcon(country.flag),
    }).addTo(map);

    // Popup on click
    marker.bindPopup(`
      <div style="
        font-family: 'Poppins', sans-serif;
        text-align: center;
        padding: 8px 4px;
        min-width: 160px;
      ">
        <div style="font-size: 2rem; margin-bottom: 6px;">${country.flag}</div>
        <div style="
          font-size: 1rem;
          font-weight: 700;
          color: #1A1A2E;
          margin-bottom: 4px;
        ">${country.name}</div>
        <div style="
          font-size: 0.78rem;
          color: #9A9A9A;
          margin-bottom: 8px;
        ">${country.region}</div>
        <div style="
          background: linear-gradient(135deg, #C9A030, #E8C45A);
          color: #1A1A2E;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
          display: inline-block;
        ">${country.count} Workers Deployed</div>
      </div>
    `, {
      maxWidth: 200,
      className: 'yakeen-popup',
    });

    // Hover tooltip
    marker.bindTooltip(country.name, {
      permanent: false,
      direction: 'top',
      className: 'yakeen-tooltip',
      offset: [0, -44],
    });
  });

  // Add custom popup & tooltip styles
  const mapStyles = document.createElement('style');
  mapStyles.textContent = `
    .yakeen-popup .leaflet-popup-content-wrapper {
      border-radius: 12px !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2) !important;
      border: 1px solid rgba(201,160,48,0.3) !important;
    }
    .yakeen-popup .leaflet-popup-tip {
      background: white !important;
    }
    .yakeen-tooltip {
      background: #1A1A2E !important;
      color: #E8C45A !important;
      border: 1px solid rgba(201,160,48,0.3) !important;
      border-radius: 6px !important;
      font-family: 'Poppins', sans-serif !important;
      font-size: 0.82rem !important;
      font-weight: 600 !important;
      padding: 4px 10px !important;
      box-shadow: none !important;
    }
    .yakeen-tooltip::before {
      border-top-color: #1A1A2E !important;
    }
    .leaflet-control-zoom a {
      background: #1A1A2E !important;
      color: #C9A030 !important;
      border-color: rgba(201,160,48,0.3) !important;
    }
    .leaflet-control-zoom a:hover {
      background: #C9A030 !important;
      color: #1A1A2E !important;
    }
  `;
  document.head.appendChild(mapStyles);

  // Animate markers on load
  setTimeout(() => {
    map.flyTo([25, 55], 2.5, { duration: 1.5 });
  }, 500);
}
