import * as gridfunc from "./grid.js";
import * as pathfunc from "./path-algorithms.js";
import {updateGridFromArray} from "./grid.js";

document.addEventListener('DOMContentLoaded', () => {
    const algorithmButtons = document.querySelectorAll('.algorithm-button');
    const gridContainer = document.querySelector('.grid-container');
    
    algorithmButtons.forEach(button => {
        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('algorithm', e.target.dataset.algorithm);
        });
    });
    
    gridContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        gridContainer.classList.add('drag-over');
    });

    gridContainer.addEventListener('dragleave', (e) => {
        if (!gridContainer.contains(e.relatedTarget)) {
            gridContainer.classList.remove('drag-over');
        }
    });

    gridContainer.addEventListener('drop', async (e) => {
        e.preventDefault();
        gridContainer.classList.remove('drag-over');
        
        const algorithm = e.dataTransfer.getData('algorithm');
        if(!gridfunc.get_generating()){
            gridfunc.reset_paths();
            gridfunc.set_stop(false);
         
        //    console.log(algorithm);
            switch (algorithm) {
                case 'backtracking-m':
                    await backtrack();
                    break;
                case 'backtracking-p':
                    if(gridfunc.get_start()!== null  && gridfunc.get_end()!== null){
                        gridfunc.set_stop(false);
                        await pathfunc.backtrack();
                    }
                    break;
                case 'kruskals':
                    await kruskals()
                    break;
                case 'dijkstra':
                    if(gridfunc.get_start()!== null  && gridfunc.get_end()!== null){
                        gridfunc.set_stop(false);
                        await pathfunc.dijkstra();
                    }
                    break;
                case 'astar':
                    if(gridfunc.get_start()!== null  && gridfunc.get_end()!== null){
                        gridfunc.set_stop(false);
                        await pathfunc.astar();
                    }
                    break;
                case 'prims':
                    await prims();
                    break;
            }
        }
    });
});

var start;
var end;
var grid;
var time;
var steps = 0;

export function set_start(x,y){
    start = [x,y];
}
export function set_end(x,y){
    end = [x,y];
}
export function get_start(){
    return start;
}
export function get_end(){
    return end;
}

export async function backtrack(){
 grid = gridfunc.get_grid()
   let visited = []
     // outline grid
    for(let i=0; i<grid.length;i++){
        visited.push([]);
        for(let j=0; j<grid[i].length; j++){

            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid[i].length - 1) {
                grid[i][j] = 1;
                visited[i].push(1);
            }
            else if ((!(j % 2) || !(i % 2))) {
                grid[i][j] = 1;
                visited[i].push(0);
            }
            else {
                grid[i][j] = 5;
                visited[i].push(0);
            }

        }
    }

   // set_grid(grid)
    gridfunc.updateGridFromArray(grid)
    await new Promise(requestAnimationFrame)

    let sx =Math.floor( Math.random() % (grid.length - 2));
    sx = !(sx % 2) ? sx + 1 : sx;
    let sy = Math.floor(Math.random() % (grid.length - 2));
    sy = !(sy % 2) ? sy + 1 : sy;

    gridfunc.set_generating(true);
    time = Date.now();
    await backtrackHelper(sx,sy,visited,sx,sy);
    gridfunc.set_start(1,1);
    gridfunc.set_end(grid.length-2,grid.length-2);
    grid[1][1]=2;
    grid[grid.length-2][grid.length-2]=3;
    time = Date.now() - time;
    document.getElementById('time-value').textContent = `${time}ms`;
    document.getElementById('steps-value').textContent = `${steps}`;
    gridfunc.updateGridFromArray();
    gridfunc.set_generating(false);
   

}
export async function backtrackHelper(sx,sy,v,x,y ){
   
    if(gridfunc.get_stop() === true){
        return;
    }
v[x][y] = 1;
let d = [1,2,3,4]
// 1: up, 2: right, 3: left, 4: down
    while(d.length > 0 && gridfunc.get_stop() === false){
        steps++;
        grid[x][y]=0;
        let ran =Math.floor(Math.random() * d.length);
        if(d[ran] === 1){   // up
            if(x-2 > -1 && !v[x-2][y]){
                v[x-2][y] = 1;
                grid[x - 1][y] = 0;
                gridfunc.updateGridFromArray();
                await new Promise(requestAnimationFrame)
               await backtrackHelper(sx, sy, v, x-2, y);
            }
        }
        else if(d[ran] === 2){   // right
            if(y+2 < grid.length && !v[x][y+2]){
                v[x][y+2] = 1;
                grid[x][y+1] = 0;
                gridfunc.updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x, y+2);
            }
        }
        else if(d[ran] === 3){   // left
            if(y-2 > -1 && !v[x][y-2]){
                v[x][y-2] = 1;
                grid[x][y-1] = 0;
                gridfunc.updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x, y-2);
            }
        }
        else if(d[ran] === 4){   // down
            if(x+2 < grid.length && !v[x+2][y]){
                v[x+2][y] = 1;
                grid[x+1][y] = 0;
                gridfunc.updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x+2, y);
            }
        }
        d.splice(ran,1)
    }




}

export async function kruskals(){
    gridfunc.set_generating(true);
    grid = gridfunc.get_grid()

    let parents = []
    let walls = []
    let colors = []
    let groupSizes = []
    let totalCells = 0;

    for (let i = 0; i < grid.length; i++) {
        parents.push([]);
        colors.push([]);
        groupSizes.push([]);
        for (let j = 0; j < grid.length; j++) {
            parents[i].push([i, j]);
            colors[i].push(Math.floor(Math.random() * 5) + 6);
            groupSizes[i].push(1);
            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid.length - 1) {
                grid[i][j] = 1;
            }
            else if ((!(j % 2) || !(i % 2))) {
                grid[i][j] = 1;
                if (!(i % 2 === 0 && j % 2 === 0)) {
                    walls.push([i, j]);
                }
            }
            else {
                grid[i][j] = colors[i][j];
                totalCells++;
            }
        }
    }

    updateGridFromArray();
    time = Date.now();
    while(walls.length > 0 && !gridfunc.get_stop()) {
        steps++;
       let ran = Math.floor(Math.random() * walls.length);
        let wx = walls[ran][0];
        let wy = walls[ran][1];
        
        if(wx % 2 === 0) {
            let cell1 = [wx-1, wy];
            let cell2 = [wx+1, wy];
            
            if(!sameparent(parents, cell1, cell2)) {
                grid[wx][wy] = 0;
                let root1 = find(parents, cell1);
                let root2 = find(parents, cell2);
                
                let size1 = groupSizes[root1[0]][root1[1]];
                let size2 = groupSizes[root2[0]][root2[1]];
                
                let newColor, newRoot;
                if (size1 >= size2) {
                    newColor = colors[root1[0]][root1[1]];
                    newRoot = root1;
                    groupSizes[root1[0]][root1[1]] += size2;
                    if(groupSizes[root1[0]][root1[1]] === totalCells) {
                        break;
                    }
                } else {
                    newColor = colors[root2[0]][root2[1]];
                    newRoot = root2;
                    groupSizes[root2[0]][root2[1]] += size1;
                    if(groupSizes[root2[0]][root2[1]] === totalCells) {
                        break;
                    }
                }
                
                updateGroupColor(parents, colors, size1 >= size2 ? root2 : root1, newColor);
                
                parents[wx][wy] = newRoot;
                colors[wx][wy] = newColor;
                grid[wx][wy] = newColor;
                
                union(parents, size1 >= size2 ? cell2 : cell1, size1 >= size2 ? cell1 : cell2);
            }
        }
        else {
            let cell1 = [wx, wy-1];
            let cell2 = [wx, wy+1];
            
            if(!sameparent(parents, cell1, cell2)) {
                grid[wx][wy] = 0;
                let root1 = find(parents, cell1);
                let root2 = find(parents, cell2);
                
                let size1 = groupSizes[root1[0]][root1[1]];
                let size2 = groupSizes[root2[0]][root2[1]];
                
                let newColor, newRoot;
                if (size1 >= size2) {
                    newColor = colors[root1[0]][root1[1]];
                    newRoot = root1;
                    groupSizes[root1[0]][root1[1]] += size2;
                    if(groupSizes[root1[0]][root1[1]] === totalCells) {
                        break;
                    }
                } else {
                    newColor = colors[root2[0]][root2[1]];
                    newRoot = root2;
                    groupSizes[root2[0]][root2[1]] += size1;
                    if(groupSizes[root2[0]][root2[1]] === totalCells) {
                        break;
                    }
                }
                
                updateGroupColor(parents, colors, size1 >= size2 ? root2 : root1, newColor);
                
                parents[wx][wy] = newRoot;
                colors[wx][wy] = newColor;
                grid[wx][wy] = newColor;
                
                union(parents, size1 >= size2 ? cell2 : cell1, size1 >= size2 ? cell1 : cell2);
            }
        }
        
        walls.splice(ran, 1);
        updateGridFromArray();
        await new Promise(requestAnimationFrame);

    }
    

    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid.length; j++) {
            if(grid[i][j] !== 1) { 
                grid[i][j] = 0;
            }
        }
        updateGridFromArray();
        await new Promise(requestAnimationFrame);
    }

    // update time
    time = Date.now() - time;
    document.getElementById('time-value').textContent = `${time}ms`;
    document.getElementById('steps-value').textContent = `${steps}`;
        
    gridfunc.set_start(1,1);
    gridfunc.set_end(grid.length-2,grid.length-2);  
    grid[1][1] = 2;
    grid[grid.length-2][grid.length-2] = 3;
    updateGridFromArray();

    gridfunc.set_generating(false);
}
function updateGroupColor(parents, colors, root, newColor) {
    let queue = [root];
    let visited = new Set();
    visited.add(`${root[0]},${root[1]}`);
    
    while(queue.length > 0) {
        let [x, y] = queue.shift();
        colors[x][y] = newColor;
        grid[x][y] = newColor;
        

        let directions = [[-1,0], [1,0], [0,-1], [0,1]];
        for(let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;
            let key = `${nx},${ny}`;
            
            if(nx >= 0 && nx < parents.length && 
               ny >= 0 && ny < parents[0].length && 
               !visited.has(key)) {
                let currentRoot = find(parents, [nx, ny]);
                if(currentRoot[0] === root[0] && currentRoot[1] === root[1]) {
                    queue.push([nx, ny]);
                    visited.add(key);
                }
            }
        }
    }
}
function find(parents, cell) {
    let [x, y] = cell;
    let path = [];
    

    while(parents[x][y][0] !== x || parents[x][y][1] !== y) {
        path.push([x, y]);
        [x, y] = parents[x][y];
    }
    let root = [x, y];
    

    for(let [px, py] of path) {
        parents[px][py] = root;
    }
    
    return root;
}
function union(parents, cell1, cell2) {
    let root1 = find(parents, cell1);
    let root2 = find(parents, cell2);
    parents[root1[0]][root1[1]] = root2;
}
function sameparent(parents, cell1, cell2) {
    let root1 = find(parents, cell1);
    let root2 = find(parents, cell2);
    return root1[0] === root2[0] && root1[1] === root2[1];
}

export async function prims() {
    steps = 0;
    grid = gridfunc.get_grid();
    gridfunc.set_generating(true);

    let visited = [];
    for (let i = 0; i < grid.length; i++) {
        visited.push([]);
        for (let j = 0; j < grid.length; j++) {
            visited[i].push(0);
        }
    }
    

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid.length - 1) {
                grid[i][j] = 1;
            }
            else if ((!(j % 2) || !(i % 2))) {
                grid[i][j] = 1;
            }
            else {
                grid[i][j] = 5;
            }
        }
    }
    
    updateGridFromArray();
    

    let cx = Math.floor(Math.random() * (grid.length - 2) / 2) * 2 + 1;
    let cy = Math.floor(Math.random() * (grid.length - 2) / 2) * 2 + 1;
    visited[cx][cy] = 1;
    grid[cx][cy] = 0;
    
    let walls = [];
    
    if (cx > 1) walls.push([cx - 1, cy]);
    if (cx < grid.length - 2) walls.push([cx + 1, cy]);
    if (cy > 1) walls.push([cx, cy - 1]);
    if (cy < grid.length - 2) walls.push([cx, cy + 1]);

    time = Date.now();
    while (walls.length > 0 && !gridfunc.get_stop()) {
        steps++
        let wallIndex = Math.floor(Math.random() * walls.length);
        let [wx, wy] = walls[wallIndex];
        
        let cell1, cell2;
        if (wx % 2 === 0) {
            cell1 = [wx - 1, wy];
            cell2 = [wx + 1, wy];
        } else {
            cell1 = [wx, wy - 1];
            cell2 = [wx, wy + 1];
        }
        
        let visited1 = visited[cell1[0]][cell1[1]];
        let visited2 = visited[cell2[0]][cell2[1]];
        
        if (visited1 !== visited2) {
            grid[wx][wy] = 0;
            

            let unvisitedCell = visited1 ? cell2 : cell1;
            visited[unvisitedCell[0]][unvisitedCell[1]] = 1;
            grid[unvisitedCell[0]][unvisitedCell[1]] = 0;
            

            let [ux, uy] = unvisitedCell;
            if (ux > 1 && !visited[ux - 2][uy]) walls.push([ux - 1, uy]);
            if (ux < grid.length - 2 && !visited[ux + 2][uy]) walls.push([ux + 1, uy]);
            if (uy > 1 && !visited[ux][uy - 2]) walls.push([ux, uy - 1]);
            if (uy < grid.length - 2 && !visited[ux][uy + 2]) walls.push([ux, uy + 1]);
            
            updateGridFromArray();
            await new Promise(requestAnimationFrame);
        }

        walls.splice(wallIndex, 1);
    }


    // update time
    time = Date.now() - time;
    document.getElementById('time-value').textContent = `${time}ms`;
    document.getElementById('steps-value').textContent = `${steps}`;

    gridfunc.set_start(1,1);
    gridfunc.set_end(grid.length-2,grid.length-2);
    grid[1][1] = 2;
    grid[grid.length - 2][grid.length - 2] = 3;
    updateGridFromArray();
    gridfunc.set_generating(false);
}






