<script>
    import { page } from '$app/stores';
    import '../app.css';
</script>

  <nav>
    <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
    <a href="/globe" class:active={$page.url.pathname === '/globe'}>Globe</a>
  </nav>

  <main>
    <slot />
  </main>

  <style>
    nav {
      padding: 1rem;
      background-color: #f0f0f0;
    }
    nav a {
      margin-right: 1rem;
      text-decoration: none;
      color: #333;
    }
    nav a.active {
      font-weight: bold;
    }
    main {
      padding: 1rem;
    }
  </style>