import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Bike, Store, MapPin, Navigation, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';

export const RealtimeLiveMap = ({
  pickupLocation,
  dropLocation,
  riderLocation,
  deliveryPartner,
  isLiveGps = false,
  activeLeg = 'ALL', // 'TO_STORE' | 'TO_CUSTOMER' | 'ALL'
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const shopMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  // Default coordinate fallbacks (Bengaluru center)
  const shopLat = pickupLocation?.lat || 12.9784;
  const shopLng = pickupLocation?.lng || 77.6408;

  const dropLat = dropLocation?.lat || 12.9352;
  const dropLng = dropLocation?.lng || 77.6245;

  const riderLat = riderLocation?.lat || (shopLat + dropLat) / 2;
  const riderLng = riderLocation?.lng || (shopLng + dropLng) / 2;
  const riderHeading = riderLocation?.heading || 0;
  const riderSpeed = riderLocation?.speed || 0;

  // Custom Leaflet DivIcons
  const createShopIcon = () => {
    return L.divIcon({
      className: 'custom-shop-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="
            background: #6339f4;
            color: white;
            padding: 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(99, 57, 244, 0.45);
            border: 2.5px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
              <path d="M2 7h20"/>
            </svg>
          </div>
          <div style="
            background: #181829;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 6px;
            margin-top: 3px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            letter-spacing: 0.2px;
          ">
            🏪 ${pickupLocation?.title || 'Pickup Store'}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const createDropIcon = () => {
    return L.divIcon({
      className: 'custom-drop-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="
            background: #10b981;
            color: white;
            padding: 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
            border: 2.5px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="
            background: #10b981;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 6px;
            margin-top: 3px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            letter-spacing: 0.2px;
          ">
            📍 ${dropLocation?.title || 'Delivery Destination'}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const createRiderIcon = (heading = 0, isLive = false) => {
    return L.divIcon({
      className: 'custom-rider-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <!-- Pulsing Radar Halo -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 52px;
            height: 52px;
            border-radius: 9999px;
            background: rgba(252, 128, 25, 0.22);
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>

          <!-- Rider Disc -->
          <div style="
            position: relative;
            background: linear-gradient(135deg, #fc8019 0%, #e66c0d 100%);
            color: white;
            padding: 9px;
            border-radius: 9999px;
            box-shadow: 0 6px 18px rgba(252, 128, 25, 0.55);
            border: 2.5px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            transition: transform 0.5s ease-out;
            transform: rotate(${heading}deg);
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="15" cy="5" r="1"/>
              <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
            </svg>
          </div>

          <!-- Rider Badge Overlay -->
          <div style="
            position: absolute;
            top: -26px;
            background: #181829;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 9999px;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
            border: 1px solid rgba(252, 128, 25, 0.4);
          ">
            <span style="
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 9999px;
              background: ${isLive ? '#10b981' : '#fc8019'};
            "></span>
            🛵 ${deliveryPartner?.name?.split(' ')[0] || 'Rider'}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
    }).setView([riderLat, riderLng], 14);

    mapInstanceRef.current = map;

    // Standard OpenStreetMap tiles (100% Free, Open Source, No API Key Required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add Shop Marker
    const shopMarker = L.marker([shopLat, shopLng], {
      icon: createShopIcon(),
      zIndexOffset: 100,
    }).addTo(map);
    shopMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <strong style="color: #6339f4; font-size: 13px;">🏪 ${pickupLocation?.title || 'Store'}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">${pickupLocation?.address || ''}</p>
      </div>
    `);
    shopMarkerRef.current = shopMarker;

    // Add Dropoff Marker
    const dropMarker = L.marker([dropLat, dropLng], {
      icon: createDropIcon(),
      zIndexOffset: 100,
    }).addTo(map);
    dropMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <strong style="color: #10b981; font-size: 13px;">📍 ${dropLocation?.title || 'Delivery Address'}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">${dropLocation?.address || ''}</p>
      </div>
    `);
    dropMarkerRef.current = dropMarker;

    // Add Moving Rider Marker
    const riderMarker = L.marker([riderLat, riderLng], {
      icon: createRiderIcon(riderHeading, isLiveGps),
      zIndexOffset: 500,
    }).addTo(map);
    riderMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <strong style="color: #fc8019; font-size: 13px;">🛵 ${deliveryPartner?.name || 'Delivery Partner'}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">
          Vehicle: ${deliveryPartner?.vehicleNumber || 'Bike'}<br/>
          Status: ${isLiveGps ? '🟢 Real-time GPS Streaming' : '⚡ En Route'}
        </p>
      </div>
    `);
    riderMarkerRef.current = riderMarker;

    // Route Polyline depending on active navigation leg
    let primaryLegCoords = [];
    let secondaryLegCoords = [];

    if (activeLeg === 'TO_STORE') {
      primaryLegCoords = [[riderLat, riderLng], [shopLat, shopLng]];
      secondaryLegCoords = [[shopLat, shopLng], [dropLat, dropLng]];
    } else if (activeLeg === 'TO_CUSTOMER') {
      primaryLegCoords = [[riderLat, riderLng], [dropLat, dropLng]];
      secondaryLegCoords = [[shopLat, shopLng], [riderLat, riderLng]];
    } else {
      primaryLegCoords = [[shopLat, shopLng], [riderLat, riderLng]];
      secondaryLegCoords = [[riderLat, riderLng], [dropLat, dropLng]];
    }

    const completedLeg = L.polyline(primaryLegCoords, {
      color: activeLeg === 'TO_STORE' ? '#FF7622' : activeLeg === 'TO_CUSTOMER' ? '#10b981' : '#6339f4',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    routePolylineRef.current = completedLeg;

    const remainingLeg = L.polyline(secondaryLegCoords, {
      color: '#94a3b8',
      weight: 4,
      dashArray: '6, 6',
      opacity: 0.7,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    remainingPolylineRef.current = remainingLeg;

    // Fit bounds according to active leg
    try {
      let targetBounds;
      if (activeLeg === 'TO_STORE') {
        targetBounds = L.latLngBounds([[riderLat, riderLng], [shopLat, shopLng]]);
      } else if (activeLeg === 'TO_CUSTOMER') {
        targetBounds = L.latLngBounds([[riderLat, riderLng], [dropLat, dropLng]]);
      } else {
        targetBounds = L.latLngBounds([
          [shopLat, shopLng],
          [riderLat, riderLng],
          [dropLat, dropLng],
        ]);
      }
      map.fitBounds(targetBounds, { padding: [50, 50], maxZoom: 16 });
    } catch (e) {
      // Ignore initial bounds calculation error
    }

    // Ensure Leaflet tiles render cleanly inside container
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Rider Marker, Shop, Drop, Routes & Rotation whenever coordinates change in real time
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (shopMarkerRef.current) {
      shopMarkerRef.current.setLatLng([shopLat, shopLng]);
    }
    if (dropMarkerRef.current) {
      dropMarkerRef.current.setLatLng([dropLat, dropLng]);
    }

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng([riderLat, riderLng]);
      riderMarkerRef.current.setIcon(createRiderIcon(riderHeading, isLiveGps));
    }

    // Update Polylines according to active navigation leg
    let primaryLegCoords = [];
    let secondaryLegCoords = [];

    if (activeLeg === 'TO_STORE') {
      primaryLegCoords = [[riderLat, riderLng], [shopLat, shopLng]];
      secondaryLegCoords = [[shopLat, shopLng], [dropLat, dropLng]];
    } else if (activeLeg === 'TO_CUSTOMER') {
      primaryLegCoords = [[riderLat, riderLng], [dropLat, dropLng]];
      secondaryLegCoords = [[shopLat, shopLng], [riderLat, riderLng]];
    } else {
      primaryLegCoords = [[shopLat, shopLng], [riderLat, riderLng]];
      secondaryLegCoords = [[riderLat, riderLng], [dropLat, dropLng]];
    }

    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(primaryLegCoords);
      routePolylineRef.current.setStyle({
        color: activeLeg === 'TO_STORE' ? '#FF7622' : activeLeg === 'TO_CUSTOMER' ? '#10b981' : '#6339f4',
      });
    }
    if (remainingPolylineRef.current) {
      remainingPolylineRef.current.setLatLngs(secondaryLegCoords);
    }
  }, [shopLat, shopLng, dropLat, dropLng, riderLat, riderLng, riderHeading, isLiveGps, activeLeg]);

  // Adjust camera framing when switching stages (e.g. from To Store to To Customer)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    try {
      let targetBounds;
      if (activeLeg === 'TO_STORE') {
        targetBounds = L.latLngBounds([[riderLat, riderLng], [shopLat, shopLng]]);
      } else if (activeLeg === 'TO_CUSTOMER') {
        targetBounds = L.latLngBounds([[riderLat, riderLng], [dropLat, dropLng]]);
      } else {
        targetBounds = L.latLngBounds([
          [shopLat, shopLng],
          [riderLat, riderLng],
          [dropLat, dropLng],
        ]);
      }
      mapInstanceRef.current.fitBounds(targetBounds, { padding: [50, 50], maxZoom: 16 });
    } catch (e) {
      // Ignore initial bounds calculation error
    }
  }, [activeLeg]);

  // Center on Rider Action
  const handleCenterOnRider = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([riderLat, riderLng], 16, {
        animate: true,
        duration: 0.8,
      });
    }
  };

  // Fit all locations action
  const handleFitAll = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([
        [shopLat, shopLng],
        [riderLat, riderLng],
        [dropLat, dropLng],
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner ${className}`}>
      {/* Map Target DOM */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Floating GPS Telemetry HUD */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/90 flex items-center space-x-2 text-xs font-bold">
          <span className={`w-2.5 h-2.5 rounded-full ${isLiveGps ? 'bg-emerald-500 animate-ping' : 'bg-orange-500 animate-pulse'}`} />
          <span className={activeLeg === 'TO_STORE' ? 'text-orange-700' : activeLeg === 'TO_CUSTOMER' ? 'text-emerald-700' : (isLiveGps ? 'text-emerald-700' : 'text-orange-700')}>
            {activeLeg === 'TO_STORE'
              ? 'STAGE 1: EN ROUTE TO RESTAURANT'
              : activeLeg === 'TO_CUSTOMER'
              ? 'STAGE 2: EN ROUTE TO CUSTOMER'
              : (isLiveGps ? 'LIVE GPS BROADCAST' : 'DISPATCH TELEMETRY')}
          </span>
        </div>

        {riderSpeed > 0 && (
          <div className="pointer-events-auto bg-[#181829]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-md text-xs font-mono font-bold flex items-center space-x-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#fc8019]" />
            <span>{riderSpeed} km/h</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col space-y-2">
        <button
          onClick={handleCenterOnRider}
          title="Snap to Rider GPS"
          className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/80 hover:text-[#fc8019] transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitAll}
          title="View Full Trip Corridor"
          className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/80 hover:text-[#6339f4] transition-all"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center space-x-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-[10px] font-semibold text-slate-600 shadow-sm pointer-events-none">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#6339f4]" />
          <span>Shop</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#fc8019]" />
          <span>Rider</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Delivery</span>
        </span>
      </div>
    </div>
  );
};
