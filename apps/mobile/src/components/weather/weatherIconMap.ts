/**
 * Maps meteorological condition text to the 3D weather icons
 * imported from the design assets.
 */
export function get3DWeatherIcon(condition?: string, isDay: boolean = true): string {
  const norm = (condition || '').toLowerCase();

  if (norm.includes('thunder') || norm.includes('lightning') || norm.includes('storm') || norm.includes('squall')) {
    return '/weather/icons/thunderstorm.png';
  }
  if (norm.includes('rain') || norm.includes('drizzle') || norm.includes('shower') || norm.includes('precipitation')) {
    return '/weather/icons/rain.png';
  }
  if (norm.includes('cloud') || norm.includes('overcast')) {
    if (norm.includes('partly') || norm.includes('mainly') || norm.includes('broken')) {
      return isDay ? '/weather/icons/sunny-cloud.png' : '/weather/icons/sun-cloud.png';
    }
    return '/weather/icons/cloudy.png';
  }
  if (norm.includes('fog') || norm.includes('haze') || norm.includes('mist') || norm.includes('smog') || norm.includes('dust')) {
    return '/weather/icons/cloud.png';
  }
  if (norm.includes('snow') || norm.includes('sleet') || norm.includes('hail')) {
    return '/weather/icons/rain.png';
  }
  if (!isDay) {
    return '/weather/icons/sun-cloud.png';
  }
  return '/weather/icons/sun.png';
}
