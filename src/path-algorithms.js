import * as gridfunc from './grid.js';
import {update_stats} from "./grid.js";

let grid;
let start;
let end;
let done = false

let time
let steps = 0

let bt_end = []

export async function backtrack(){
    done = false;
    grid = gridfunc.get_grid();

    const visited = [];

    for(let i=0; i<grid.length;i++){
        visited.push([]);
        for(let j=0; j<grid[i].length; j++){

            if(grid[i][j] === 2){
                start = [i,j];
            }
            else if(grid[i][j] === 3){
                end = [i,j];
            }

            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid[i].length - 1) {
                visited[i].push(1);
            }
            else{
                visited[i].push(0);
            }
        }
    }
    steps =0
    time = Date.now()
    await backtrackHelper(visited, start[0], start[1]);
    gridfunc.updateGridFromArray();
    await new Promise(requestAnimationFrame);

    while(bt_end.length > 0 && !gridfunc.get_stop()){
        let c = bt_end.pop();
        grid[c[0]][c[1]]=4
        gridfunc.updateGridFromArray()
        await new Promise(requestAnimationFrame);
    }
    gridfunc.update_stats(time,steps)


}

async function backtrackHelper(v,x,y){


    if(x === end[0] && y === end[1] || gridfunc.get_stop() === true){
        done = true;
        return;
    }
    
    if(grid[x][y] !== 2 && grid[x][y] !== 3){
        grid[x][y] = 5;
    }
    v[x][y] = 1;

    gridfunc.updateGridFromArray();
    await new Promise(requestAnimationFrame);
    let dir = [1,2,3,4];
    while(dir.length > 0 && !done){
        steps++
        let ran = Math.floor(Math.random() * dir.length);								// get a random direction
       // console.log(ran);
		if (dir[ran] === 1) {											// checking up
			if (x - 1 > 0 && grid[x - 1][y] !== 1 && !v[x-1][y]) {			// make sure we can move up
				await backtrackHelper(v, x - 1, y);		// move up
			}
		}
		else if (dir[ran] === 2) {
			if (y + 1 < grid.length - 1 && grid[x][y + 1] !== 1 && !v[x][y+1]) {
				await backtrackHelper(v, x, y + 1);
			}
		}
		else if (dir[ran] === 3) {
			if (x + 1 < grid.length - 1 && grid[x + 1][y] !== 1 && !v[x+1][y]) {
				await backtrackHelper(v, x + 1, y);
			}
		}
		else {
			if (y - 1 > 0 && grid[x][y - 1]!== 1 && !v[x][y-1]) {
				await backtrackHelper(v, x, y - 1);
			}
		}
        dir.splice(ran,1);
    if(done && gridfunc.get_stop() === false){
        //console.log("done");
        if(x!==start[0] || y!==start[1]){
            bt_end.push([x,y])
        }
    }
    }
    
    
}

export async function dijkstra() {
    grid = gridfunc.get_grid();

    let start = gridfunc.get_start();
    let end = gridfunc.get_end();



    let distances = [];
    let visited = [];
    let previous = [];
    let unvisited = new Set();

    for (let i = 0; i < grid.length; i++) {
        distances.push([]);
        visited.push([]);
        previous.push([]);
        for (let j = 0; j < grid.length; j++) {
            distances[i].push(Infinity);
            visited[i].push(0);
            previous[i].push(null);
            if (grid[i][j] !== 1) {
                unvisited.add(`${i},${j}`);
            }
        }
    }

    distances[start[0]][start[1]] = 0;
    steps = 0
    time = Date.now()
    while (unvisited.size > 0 && !gridfunc.get_stop()) {
        steps++
        let current = null;
        let minDistance = Infinity;
        
        for (let cell of unvisited) {
            let [x, y] = cell.split(',').map(Number);
            if (distances[x][y] < minDistance) {
                minDistance = distances[x][y];
                current = [x, y];
            }
        }

        if (current === null) break; 
        if (current[0] === end[0] && current[1] === end[1]) break; 

        let [x, y] = current;
        unvisited.delete(`${x},${y}`);
        visited[x][y] = 1;

        if (!(x === start[0] && y === start[1]) && !(x === end[0] && y === end[1])) {
            grid[x][y] = 5; 
            gridfunc.updateGridFromArray();
            await new Promise(requestAnimationFrame);
        }

        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;

            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid.length && 
                grid[nx][ny] !== 1 && !visited[nx][ny]) {
                
                let alt = distances[x][y] + 1; 
                if (alt < distances[nx][ny]) {
                    distances[nx][ny] = alt;
                    previous[nx][ny] = [x, y];
                }
            }
        }
    }

    let path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = previous[current[0]][current[1]];
    }

    gridfunc.update_stats(time,steps)

    for (let [x, y] of path) {
        if(gridfunc.get_stop() === true){
            break;
        }
        if (!(x === start[0] && y === start[1]) && !(x === end[0] && y === end[1])) {
            grid[x][y] = 4; 
            gridfunc.updateGridFromArray();
            await new Promise(requestAnimationFrame);
        }
    }

}

export async function astar() {
    grid = gridfunc.get_grid();
    steps =0
    
    let gScore = []; 
    let fScore = []; 
    let cameFrom = [];
    let openSet = new Map(); 
    let closedSet = new Set();

    
    function heuristic(a, b) {

        const dx = Math.abs(a[0] - b[0]);
        const dy = Math.abs(a[1] - b[1]);
        return Math.min(dx, dy) * 14 + (Math.max(dx, dy) - Math.min(dx, dy)) * 10;
    }


    let start = gridfunc.get_start();
    let end = gridfunc.get_end();


    for (let i = 0; i < grid.length; i++) {
        gScore.push([]);
        fScore.push([]);
        cameFrom.push([]);
        for (let j = 0; j < grid.length; j++) {
            gScore[i].push(Infinity);
            fScore[i].push(Infinity);
            cameFrom[i].push(null);
        }
    }

    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = heuristic(start, end);
    openSet.set(`${start[0]},${start[1]}`, fScore[start[0]][start[1]]);

    time = Date.now()
  //  console.log(gridfunc.get_stop());
    while (openSet.size > 0 && !gridfunc.get_stop()) {
        steps++
        let current = null;
        let lowestFScore = Infinity;
        
        for (let [cell, score] of openSet) {
            if (score < lowestFScore) {
                lowestFScore = score;
                current = cell.split(',').map(Number);
            }
        }

        if (current === null) break;
        if (current[0] === end[0] && current[1] === end[1]) break;

        openSet.delete(`${current[0]},${current[1]}`);
        closedSet.add(`${current[0]},${current[1]}`);


        if (!(current[0] === start[0] && current[1] === start[1]) && 
            !(current[0] === end[0] && current[1] === end[1])) {
            grid[current[0]][current[1]] = 5; 
            gridfunc.updateGridFromArray();
            await new Promise(requestAnimationFrame);
        }

      
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            let neighbor = [current[0] + dx, current[1] + dy];
            
            if (neighbor[0] < 0 || neighbor[0] >= grid.length || 
                neighbor[1] < 0 || neighbor[1] >= grid.length || 
                grid[neighbor[0]][neighbor[1]] === 1 || 
                closedSet.has(`${neighbor[0]},${neighbor[1]}`)) {
                continue;
            }

            let tentativeGScore = gScore[current[0]][current[1]] + 1;
            
            if (tentativeGScore < gScore[neighbor[0]][neighbor[1]]) {
                cameFrom[neighbor[0]][neighbor[1]] = current;
                gScore[neighbor[0]][neighbor[1]] = tentativeGScore;
                fScore[neighbor[0]][neighbor[1]] = gScore[neighbor[0]][neighbor[1]] + heuristic(neighbor, end);
                
                if (!openSet.has(`${neighbor[0]},${neighbor[1]}`)) {
                    openSet.set(`${neighbor[0]},${neighbor[1]}`, fScore[neighbor[0]][neighbor[1]]);
                }
            }
        }
    }


    let path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = cameFrom[current[0]][current[1]];
    }

    update_stats(time,steps)


    for (let [x, y] of path) {
        if(gridfunc.get_stop() === true){
            break;
        }
        if (!(x === start[0] && y === start[1]) && !(x === end[0] && y === end[1])) {
            grid[x][y] = 4; 
            gridfunc.updateGridFromArray();
            await new Promise(requestAnimationFrame);
        }
    }

}
