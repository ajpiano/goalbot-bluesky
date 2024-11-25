<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import * as PIXI from 'pixi.js';

  interface Team {
    name: string;
    logo: string;
  }

  interface Scores {
    ht: number | null;
    ft: number | null;
    et: number | null;
  }

  interface Status {
    long: string;
    short: string;
    elapsed: number | null;
  }

  interface Fixture {
    id: number;
    status: Status;
    home_team: Team;
    away_team: Team;
    home_score: Scores;
    away_score: Scores;
    league: {
      name: string;
      country: string;
    };
  }

  export let fixtures: Fixture[] = [];

  let app: PIXI.Application;
  let canvasContainer: HTMLElement;
  let width: number = 1024; // Default width
  let height: number = 768; // Default height

  function handleResize() {
    if (browser) {
      width = window.innerWidth;
      height = window.innerHeight;
      if (app) {
        app.renderer.resize(width, height);
        initializeVisualization();
      }
    }
  }

  onMount(() => {
    if (browser) {
      width = window.innerWidth;
      height = window.innerHeight;
      initializeApp();
      window.addEventListener('resize', handleResize);
    }
  });

  onDestroy(() => {
    if (browser) {
      if (app) {
        app.destroy();
      }
      window.removeEventListener('resize', handleResize);
    }
  });

  async function initializeApp() {
    app = new PIXI.Application();
    await app.init({
      width,
      height,
      backgroundColor: 0x1099bb,
    });

    if (canvasContainer) {
      canvasContainer.appendChild(app.canvas);
    }

    initializeVisualization();
  }

  async function loadTexture(url: string): Promise<PIXI.Texture> {
    return new Promise((resolve, reject) => {
      PIXI.Assets.load(url).then(resolve).catch(reject);
    });
  }

  function createSafeSprite(texture: PIXI.Texture | null): PIXI.Sprite {
    return texture ? new PIXI.Sprite(texture) : new PIXI.Sprite(PIXI.Texture.EMPTY);
  }

  function logFixtureDetails(fixture: Fixture) {
    console.log('Fixture details:', {
      id: fixture.id,
      homeTeam: fixture.home_team?.name,
      awayTeam: fixture.away_team?.name,
      status: fixture.status,
      home_score: fixture.home_score,
      away_score: fixture.away_score
    });
  }

  async function initializeVisualization(): Promise<void> {
    if (!app) return;

    console.log('All Fixtures:', fixtures);

    app.stage.removeChildren();

    const padding = 10;
    const cardWidth = 200;
    const cardHeight = 100;
    const columns = Math.floor(width / (cardWidth + padding));
    const rows = Math.ceil(fixtures.length / columns);

    for (let index = 0; index < fixtures.length; index++) {
      const fixture = fixtures[index];
      logFixtureDetails(fixture);

      const column = index % columns;
      const row = Math.floor(index / columns);

      const x = padding + column * (cardWidth + padding);
      const y = padding + row * (cardHeight + padding);

      const card = new PIXI.Graphics();
      card.fill({ color: 0xffffff });
      card.rect(0, 0, cardWidth, cardHeight);
      card.position.set(x, y);

      const homeLogoTexture = await loadTexture(fixture.home_team.logo);
      const awayLogoTexture = await loadTexture(fixture.away_team.logo);

      const homeLogo = createSafeSprite(homeLogoTexture);
      const awayLogo = createSafeSprite(awayLogoTexture);

      homeLogo.width = homeLogo.height = 30;
      awayLogo.width = awayLogo.height = 30;

      homeLogo.position.set(10, 10);
      awayLogo.position.set(cardWidth - 40, 10);

      const homeTeam = new PIXI.Text({
        text: fixture.home_team.name,
        style: {
          fontSize: 12,
          fill: 0x000000,
          fontFamily: 'Arial'
        }
      });
      homeTeam.position.set(10, 45);

      const awayTeam = new PIXI.Text({
        text: fixture.away_team.name,
        style: {
          fontSize: 12,
          fill: 0x000000,
          fontFamily: 'Arial'
        }
      });
      awayTeam.position.set(cardWidth - awayTeam.width - 10, 45);

      const homeScore = fixture.home_score.et ?? fixture.home_score.ft ?? fixture.home_score.ht ?? 0;
      const awayScore = fixture.away_score.et ?? fixture.away_score.ft ?? fixture.away_score.ht ?? 0;

      const score = new PIXI.Text({
        text: `${homeScore} - ${awayScore}`,
        style: {
          fontSize: 16,
          fill: 0x000000,
          fontWeight: 'bold',
          fontFamily: 'Arial'
        }
      });
      score.position.set((cardWidth - score.width) / 2, 40);

      const status = new PIXI.Text({
        text: `${fixture.status.short} ${fixture.status.elapsed ?? ''}`,
        style: {
          fontSize: 10,
          fill: 0x000000,
          fontFamily: 'Arial'
        }
      });
      status.position.set((cardWidth - status.width) / 2, 70);

      const league = new PIXI.Text({
        text: `${fixture.league.name}, ${fixture.league.country}`,
        style: {
          fontSize: 8,
          fill: 0x666666,
          fontFamily: 'Arial'
        }
      });
      league.position.set((cardWidth - league.width) / 2, 85);

      card.addChild(homeLogo, awayLogo, homeTeam, awayTeam, score, status, league);
      app.stage.addChild(card);
    }
  }

  $: if (browser && app && fixtures) {
    initializeVisualization();
  }
</script>

<div bind:this={canvasContainer}></div>

<style>
  div {
    width: 100%;
    height: 100vh;
  }
</style>