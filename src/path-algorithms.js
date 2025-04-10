import * as gridfunc from './grid.js';

var grid;
var start;
var end;
let done = false
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
    console.log(visited);
    await backtrackHelper(visited, start[0], start[1]);
    gridfunc.updateGridFromArray();
    await new Promise(requestAnimationFrame);

    
}

async function backtrackHelper(v,x,y){
    if(x === end[0] && y === end[1]){
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
    if(done){
        //console.log("done");
        if(x!==start[0] || y!==start[1]){
            grid[x][y] = 4;
        }
    }
    }
    
    
}
