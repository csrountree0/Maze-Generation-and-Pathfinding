import * as gridfunc from "./grid.js";
import * as pathfunc from "./path-algorithms.js";

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
            gridfunc.set_stop(false);

            switch (algorithm) {
                case 'backtracking-m':
                    await backtrack();
                    break;
                case 'backtracking-p':
                    await pathfunc.backtrack();
                    break;
                case 'brute-force':
                    break;
                case 'dijkstra':
                    break;
                case 'astar':
                    break;
            }
        }
    });
});

var start;
var end;
var grid;


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
    await backtrackHelper(sx,sy,visited,sx,sy);
    grid[1][1]=2;
    grid[grid.length-2][grid.length-2]=3;
    gridfunc.updateGridFromArray();
    gridfunc.set_generating(false);
}
export async function backtrackHelper(sx,sy,v,x,y ){
v[x][y] = 1;
let d = [1,2,3,4]
// 1: up, 2: right, 3: left, 4: down
    while(d.length > 0 && !gridfunc.get_stop()){
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





}




