import { Router, Request, Response } from 'express';
import {
  fetchIMDStations,
  fetchIMDNowcasts,
  fetchIMDDistrictWarnings,
} from '../services/imdGeoServer';
import {
  getRemoteSensingOverview,
  RADAR_STATIONS_CATALOG,
  SATELLITE_CHANNELS_CATALOG,
} from '../services/imdRemoteSensing';
import {
  ACTIVE_CYCLONES_DATA,
  FISHERMEN_WARNINGS_DATA,
  PORT_WARNING_SIGNALS,
  FLASH_FLOOD_BASINS_DATA,
  RAINFALL_DEPARTURE_DATA,
  HIGHWAY_CORRIDORS_DATA,
  PILGRIMAGE_YATRAS_DATA,
  AGROMET_BULLETINS_DATA,
} from '../services/imdSpecialized';

const router = Router();

// 1. Overview Multi-Hub Status
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const stations = await fetchIMDStations();
    const nowcasts = await fetchIMDNowcasts();
    const warnings = await fetchIMDDistrictWarnings();
    const remoteSensing = getRemoteSensingOverview();

    res.json({
      success: true,
      data: {
        activeNowcastsCount: nowcasts.filter(n => n.severityLevel !== 'no_warning').length,
        criticalWarningsCount: warnings.filter(w => w.days.some(d => d.colorLevel === 'orange' || d.colorLevel === 'red')).length,
        activeCyclonesCount: ACTIVE_CYCLONES_DATA.length,
        monitoredStationsCount: stations.length,
        radarStationsCount: RADAR_STATIONS_CATALOG.length,
        flashFloodThreatBasinsCount: FLASH_FLOOD_BASINS_DATA.filter(b => b.flashFloodRisk === 'high' || b.flashFloodRisk === 'very_high').length,
        timestampIST: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        remoteSensing,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch IMD overview', error: error?.message });
  }
});

// 2. Stations & Station Observation
router.get('/stations', async (req: Request, res: Response) => {
  try {
    const { state, search } = req.query;
    let stations = await fetchIMDStations();

    if (state && typeof state === 'string') {
      stations = stations.filter(s => s.stateCode.toLowerCase() === state.toLowerCase() || s.stateName.toLowerCase().includes(state.toLowerCase()));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      stations = stations.filter(s => s.stationName.toLowerCase().includes(q) || s.stateName.toLowerCase().includes(q));
    }

    res.json({ success: true, count: stations.length, data: stations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch IMD stations', error: error?.message });
  }
});

router.get('/station/:id', async (req: Request, res: Response) => {
  try {
    const stations = await fetchIMDStations();
    const station = stations.find(s => s.stationId === req.params.id) || stations[0];
    res.json({ success: true, data: station });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch station details', error: error?.message });
  }
});

// 3. Nowcasts
router.get('/nowcasts', async (_req: Request, res: Response) => {
  try {
    const nowcasts = await fetchIMDNowcasts();
    res.json({ success: true, count: nowcasts.length, data: nowcasts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch IMD nowcasts', error: error?.message });
  }
});

// 4. 5-Day District Warnings
router.get('/warnings', async (req: Request, res: Response) => {
  try {
    const { district } = req.query;
    const warnings = await fetchIMDDistrictWarnings(district as string | undefined);
    res.json({ success: true, count: warnings.length, data: warnings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch IMD district warnings', error: error?.message });
  }
});

// 5. Remote Sensing (Radar & Satellite)
router.get('/remote-sensing', (_req: Request, res: Response) => {
  const overview = getRemoteSensingOverview();
  res.json({ success: true, data: overview });
});

router.get('/radar/stations', (_req: Request, res: Response) => {
  res.json({ success: true, count: RADAR_STATIONS_CATALOG.length, data: RADAR_STATIONS_CATALOG });
});

router.get('/satellite/channels', (_req: Request, res: Response) => {
  res.json({ success: true, count: SATELLITE_CHANNELS_CATALOG.length, data: SATELLITE_CHANNELS_CATALOG });
});

// 6. RSMC Tropical Cyclones
router.get('/cyclone', (_req: Request, res: Response) => {
  res.json({ success: true, count: ACTIVE_CYCLONES_DATA.length, data: ACTIVE_CYCLONES_DATA });
});

// 7. Maritime & Fishermen
router.get('/marine', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      fishermenWarnings: FISHERMEN_WARNINGS_DATA,
      portSignals: PORT_WARNING_SIGNALS,
    },
  });
});

// 8. Hydrology & Flash Floods
router.get('/flash-flood', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      flashFloodBasins: FLASH_FLOOD_BASINS_DATA,
      rainfallDepartures: RAINFALL_DEPARTURE_DATA,
    },
  });
});

// 9. Highway Corridors
router.get('/highways', (_req: Request, res: Response) => {
  res.json({ success: true, count: HIGHWAY_CORRIDORS_DATA.length, data: HIGHWAY_CORRIDORS_DATA });
});

// 10. Sacred Pilgrimage Yatras
router.get('/pilgrimage', (_req: Request, res: Response) => {
  res.json({ success: true, count: PILGRIMAGE_YATRAS_DATA.length, data: PILGRIMAGE_YATRAS_DATA });
});

// 11. Kisan Agromet Advisory
router.get('/agromet', (req: Request, res: Response) => {
  const district = (req.query.district as string) || 'default';
  const bulletin = AGROMET_BULLETINS_DATA[district] || AGROMET_BULLETINS_DATA['default'];
  res.json({ success: true, data: bulletin });
});

export default router;
