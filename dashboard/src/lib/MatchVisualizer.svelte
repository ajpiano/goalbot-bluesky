<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as PIXI from 'pixi.js';

  // ... (previous interface definitions remain the same)

  export let fixtures: Fixture[] = [];

  let app: PIXI.Application;
  let canvasContainer: HTMLElement;

  onMount(async () => {
    app = new PIXI.Application();
    await app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    if (canvasContainer) {
      canvasContainer.appendChild(app.canvas);
    }

    // Initialize the visualization
    initializeVisualization();
  });

  onDestroy(() => {
    if (app) {
      app.destroy();
    }
  });

  async function loadTexture(url: string): Promise<PIXI.Texture | null> {
    if (!url) return null;
    try {
      return await PIXI.Assets.load(url);
    } catch (error) {
      console.error('Error loading texture:', error);
      return null;
    }
  }

  function createSafeSprite(texture: PIXI.Texture | null): PIXI.Sprite {
    return new PIXI.Sprite(texture || PIXI.Texture.EMPTY);
  }

  async function initializeVisualization(): Promise<void> {
    if (!app) return;

    console.log('Fixtures:', fixtures); // Log fixtures for debugging

    // Clear existing children
    app.stage.removeChildren();

    // Create visualizations for each fixture
    for (let index = 0; index < fixtures.length; index++) {
      const fixture = fixtures[index];
      const fixtureContainer = new PIXI.Container();
      fixtureContainer.position.set(50 + (index % 3) * 250, 50 + Math.floor(index / 3) * 150);

      // Create a "pitch" rectangle
      const pitch = new PIXI.Graphics();
      pitch.fill({ color: 0x00ff00 });
      pitch.rect(0, 0, 200, 100);
      fixtureContainer.addChild(pitch);

      // Load and add team logos
      const homeLogoTexture = await loadTexture(fixture.home_team?.logo || '');
      const homeLogo = createSafeSprite(homeLogoTexture);
      homeLogo.width = homeLogo.height = 30;
      homeLogo.position.set(5, 5);
      fixtureContainer.addChild(homeLogo);

      const awayLogoTexture = await loadTexture(fixture.away_team?.logo || '');
      const awayLogo = createSafeSprite(awayLogoTexture);
      awayLogo.width = awayLogo.height = 30;
      awayLogo.position.set(5, 65);
      fixtureContainer.addChild(awayLogo);

      // Add team names
      const homeTeam = new PIXI.Text({
        text: fixture.home_team?.name || 'Unknown',
        style: { 
          fontSize: 12, 
          fill: 0xffffff,
          fontFamily: 'Arial'
        }
      });
      homeTeam.position.set(40, 15);
      fixtureContainer.addChild(homeTeam);

      const awayTeam = new PIXI.Text({
        text: fixture.away_team?.name || 'Unknown',
        style: { 
          fontSize: 12, 
          fill: 0xffffff,
          fontFamily: 'Arial'
        }
      });
      awayTeam.position.set(40, 75);
      fixtureContainer.addChild(awayTeam);

      // Add score
      const score = new PIXI.Text({
        text: `${fixture.home_score?.ft ?? 0} - ${fixture.away_score?.ft ?? 0}`,
        style: { 
          fontSize: 16, 
          fill: 0xffffff,
          fontFamily: 'Arial'
        }
      });
      score.position.set(85, 40);
      fixtureContainer.addChild(score);

      // Add status
      const status = new PIXI.Text({
        text: `${fixture.status?.short || 'Unknown'} ${fixture.status?.elapsed ?? ''}`,
        style: {
          fontSize: 10,
          fill: 0xffff00,
          fontFamily: 'Arial'
        }
      });
      status.position.set(85, 60);
      fixtureContainer.addChild(status);

      app.stage.addChild(fixtureContainer);
    }
  }

  $: if (app && fixtures) {
    initializeVisualization();
  }
</script>

<div bind:this={canvasContainer}></div>

<style>
  div {
    width: 800px;
    height: 600px;
  }
</style>