<script lang="ts">
    export let matchId: string;
    export let theme: string = '';
    export let refresh: number = 15;
    export let showErrors: boolean = false;
    export let showLogos: boolean = true;
  
    let widgetId = `wg-api-football-game`;
  
    import { PUBLIC_RAPIDAPI_KEY } from '$env/static/public'; 
  </script>
  
  <div
    id={widgetId}
    data-host="api-football-v1.p.rapidapi.com"
    data-key={PUBLIC_RAPIDAPI_KEY}
    data-id={matchId}
    data-theme={theme}
    data-refresh={refresh}
    data-show-errors={showErrors.toString()}
    data-show-logos={showLogos.toString()}
  >
  </div>