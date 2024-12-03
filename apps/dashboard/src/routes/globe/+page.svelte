<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';

  let container: HTMLElement;

  interface Match {
    id: number;
    league: {
      country: string;
    };
  }

  async function fetchMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('fixtures')
      .select(`
        id,
        league:leagues(country)
      `)
      .limit(100);  // Adjust this limit as needed

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
    return data;
  }

  onMount(async () => {
    const Globe = (await import('globe.gl')).default;
    const matches = await fetchMatches();

    console.log('Raw matches data:', matches);

    // Fetch GeoJSON data
    const response = await fetch('/countries.geojson');
    const countries = await response.json();

    // Count matches per country
    const matchCounts = matches.reduce((acc, match) => {
      if (match && match.league && match.league.country) {
        const countryName = match.league.country;
        acc[countryName] = (acc[countryName] || 0) + 1;
      }
      return acc;
    }, {});

    console.log('Match counts:', matchCounts);

    // Prepare point data based on the GeoJSON
    const pointsData = countries.features
      .map(feature => {
        if (!feature || !feature.properties || !feature.geometry || !feature.geometry.coordinates) {
          console.warn('Invalid feature:', feature);
          return null;
        }
        const countryName = feature.properties.COUNTRY;
        const [lng, lat] = feature.geometry.coordinates;
        console.log('Country:', countryName, 'Coordinates:', lng, lat);
        return {
          lat,
          lng,
          name: countryName,
          matches: matchCounts[countryName] || 0
        };
      })
      .filter(point => point !== null && point.matches > 0);

    console.log('Points data:', pointsData);

    const globe = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .width(container.clientWidth)
      .height(600)
      .pointsData(pointsData)
      .pointColor(() => '#00ff00')  // Bright green color
      .pointAltitude(d => d.matches * 0.1)  // Height based on number of matches
      .pointRadius(d => Math.sqrt(d.matches) * 0.5)  // Width based on number of matches
      .pointsMerge(false)  // Don't merge points
      .pointLabel(d => `
        <b>${d.name}</b> <br />
        Matches: ${d.matches}
      `);

    globe(container);

    // Rotate globe to first point with matches
    if (pointsData.length > 0) {
      const firstPoint = pointsData[pointsData.length - 1];
      globe.pointOfView({ lat: firstPoint.lat, lng: firstPoint.lng, altitude: 2.5 }, 1000);
    }

    const handleResize = () => {
      globe.width(container.clientWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<h1>Match Locations Globe</h1>
<div bind:this={container}></div>

<style>
  div {
    width: 100%;
    height: 400px;
    background-color: #000011;
  }
</style>