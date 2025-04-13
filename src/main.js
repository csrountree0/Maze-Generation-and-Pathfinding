import './style.css'
import './grid.js'
import './maze-algorithms.js'

document.querySelector('#app').innerHTML = `
  <div class="app-container"> 
    <div class="main-header">
      <header>
        <h1>Maze Generation & Pathfinding Visualizer</h1>
        <p id="my-info">by <a href="https://github.com/csrountree0">Colby Rountree</a></p>
      </header>
    </div>
    
    <div class="visualization-container">
      <div class="controls-panel">
        <div class="control-group">
          <div class="size-control">
            <label for="grid-size">Grid Size:</label>
            <select id="grid-size">
              <option value="9">9x9</option>
              <option value="19" selected>19x19</option>
              <option value="29">29x29</option>
              <option value="39">39x39</option>
              <option value="49">49x49</option>
              <option value="59">59x59</option>
              <option value="69">69x69</option>
            </select>
          </div>
          <button class="reset-button" id="reset-grid">Reset Grid</button>
        </div>

        <div class="section-controls">
          <h2>Maze Generation</h2>
          <div class="algorithm-buttons">
            <button draggable="true" class="algorithm-button" data-algorithm="backtracking-m">
              <span class="button-label">Backtracking</span>
              <span class="button-desc">Depth-first search maze generation</span>
            </button>
            <button draggable="true" class="algorithm-button" data-algorithm="kruskals">
              <span class="button-label">Kruskal's</span>
              <span class="button-desc">Randomized maze with minimum spanning tree</span>
            </button>
            <button draggable="true" class="algorithm-button" data-algorithm="prims">
              <span class="button-label">Prim's</span>
              <span class="button-desc">Minimum spanning tree maze generation</span>
            </button>
          </div>
        </div>

        <div class="section-controls">
          <h2>Pathfinding</h2>
          <div class="algorithm-buttons">
            <button draggable="true" class="algorithm-button" data-algorithm="backtracking-p">
              <span class="button-label">Backtracking</span>
              <span class="button-desc">Depth-first path search</span>
            </button>
            <button draggable="true" class="algorithm-button" data-algorithm="dijkstra">
              <span class="button-label">Dijkstra's</span>
              <span class="button-desc">Shortest path algorithm</span>
            </button>
            <button draggable="true" class="algorithm-button" data-algorithm="astar">
              <span class="button-label">A*</span>
              <span class="button-desc">Heuristic-based pathfinding</span>
            </button>
          </div>
        </div>
      </div>

      <div class="grids-container">
        <div class="grid-section">
          <div class="grid-header">
            <h3>Algorithm Stats</h3>
            <div class="algorithm-stats">
              <span class="stat-label">Time:</span>
              <span class="stat-value" id="time-value">0ms</span>
              <span class="stat-label">Steps:</span>
              <span class="stat-value" id="steps-value">0</span>
            </div>
          </div>
          <div class="grid-container" id="grid"></div>
        </div>
      </div>
    </div>
  </div>
`

// Initialize the grid
document.addEventListener('DOMContentLoaded', () => {


  // Add event listener for size changes
  document.getElementById('grid-size').addEventListener('change', (e) => {
    console.log(e.target.value);
    createGrid('grid', parseInt(e.target.value));
  });


});

