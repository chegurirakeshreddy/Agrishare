
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <h2>🌱 AgriShare</h2>
        <nav>
          <a href="#home">Home</a>
          <a href="#crops">Crops</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
        </nav>
        <button className="login-btn">Login</button>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="tagline">
            GROW TOGETHER, SHARE SMARTER
          </p>

          <h1>
            Empowering Farmers.
            <br />
            Connecting Markets.
          </h1>

          <p className="description">
            Find farming equipment, discover fresh crops,
            and connect directly with agricultural buyers
            and service providers.
          </p>

          <div className="actions">
            <button onClick={() =>
              document.getElementById("crops")
                .scrollIntoView({ behavior: "smooth" })
            }>
              Explore Marketplace
            </button>

            <button className="secondary"
              onClick={() =>
                document.getElementById("resources")
                  .scrollIntoView({ behavior: "smooth" })
              }>
              Find Resources
            </button>
          </div>
        </section>

        <section className="features" id="crops">
          <h2>Everything Agriculture, in One Place</h2>

          <div className="cards">
            <article className="card">
              <span>🌾</span>
              <h3>Crop Marketplace</h3>
              <p>Discover produce directly from farmers.</p>
            </article>

            <article className="card" id="resources">
              <span>🚜</span>
              <h3>Equipment Sharing</h3>
              <p>Find tractors and farming equipment.</p>
            </article>

            <article className="card" id="about">
              <span>🤝</span>
              <h3>Direct Connections</h3>
              <p>Bring farmers, buyers and providers together.</p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        © 2026 AgriShare | Growing a better agricultural future
      </footer>
    </div>
  );
}

export default App;
