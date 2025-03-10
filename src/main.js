import './style.css'


document.querySelector('#app').innerHTML = `
  <div> 
    <div class="main-header">
    <header>
        <h1>Maze Generation and Pathfinding</h1>
        <p id="my-info">Created by <a href="https://github.com/csrountree0">Colby Rountree</a></p>
    </header>
    </div>
    
    <div class="maze-path-container">
        <div class="maze-gen">
            <h1>Maze Generation</h1>
            <button>Kruskals</button>
            <button>Backtracking</button>
            <button>Brute Force</button>
        </div>    
     <div class="path-gen">
        <h1>Pathfinding</h1>
           <button>Backtracking</button>
           <button>Dijkstra's</button>
           <button>A*</button>
     </div>  
    
    
 
    </div>
    
    
  </div>
`

