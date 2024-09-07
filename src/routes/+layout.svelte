<script>
    import '../app.css';
</script>

<main>
    <h3>Paddle Charts</h3>
    <div class="chart-grid">
        <slot />
    </div>
</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }

    .chart-grid {
        display: grid;
        gap: 16px; /* Adjust the gap between charts as needed */
        grid-template-columns: repeat(1, 1fr); /* Default to 1 column */
    }

    @media (min-width: 600px) {
        .chart-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 columns for small screens */
        }
    }

    @media (min-width: 900px) {
        .chart-grid {
            grid-template-columns: repeat(3, 1fr); /* 3 columns for medium screens */
        }
    }

    @media (min-width: 1200px) {
        .chart-grid {
            grid-template-columns: repeat(4, 1fr); /* 4 columns for large screens */
        }
    }
</style>