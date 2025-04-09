import {get_grid,set_grid,updateGridFromArray} from "./grid.js";

document.addEventListener('DOMContentLoaded', () => {
    const algorithmButtons = document.querySelectorAll('.algorithm-button');
    const grids = document.querySelectorAll('.grid-container');
    
    algorithmButtons.forEach(button => {
        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('algorithm', e.target.dataset.algorithm);
            e.target.classList.add('dragging');
        });
        
        button.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
    
    grids.forEach(grid => {
        grid.addEventListener('dragover', (e) => {
            console.log('dragover');
                e.preventDefault();
                grid.classList.add('drag-over');
        });

        grid.addEventListener('dragleave', () => {
            console.log("me2")

            grid.classList.remove('drag-over');
        });

        grid.addEventListener('drop', async (e) => {

            e.preventDefault();
            grid.classList.remove('drag-over');

            const algorithm = e.dataTransfer.getData('algorithm');

            switch (algorithm) {
                case 'backtracking':
                   await backtrack()
                    break;
                case 'brute-force':
                    break;
                case 'dijkstra':
                    break;
                case 'astar':
                    break;
            }
        });
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


export async function backtrack(){
 grid = get_grid()
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
                visited[i].push(0);
            }

        }
    }

    console.log(visited)

   // set_grid(grid)
    updateGridFromArray(grid)
    await new Promise(requestAnimationFrame)

    let sx =Math.floor( Math.random() % (grid.length - 2));
    sx = !(sx % 2) ? sx + 1 : sx;
    let sy = Math.floor(Math.random() % (grid.length - 2));
    sy = !(sy % 2) ? sy + 1 : sy;

  //  await backtrackHelper(sx,sy,visited,sx,sy)
}
export async function backtrackHelper(sx,sy,v,x,y ){
v[x][y] = 1;
let d = [1,2,3,4]
// 1: up, 2: right, 3: left, 4: down
    while(d.length > 0){

        let ran =Math.floor(Math.random() * d.length);
        console.log(ran)
        if(d[ran] === 1){   // up
            if(x-2 > -1 && !v[x-2][y]){
                v[x-2][y] = 1;
                grid[x - 1][y] = 0;
                updateGridFromArray();
                await new Promise(requestAnimationFrame)
               await backtrackHelper(sx, sy, v, x-2, y);
            }
        }
        else if(d[ran] === 2){   // right
            if(y+2 < grid.length && !v[x][y+2]){
                v[x][y+2] = 1;
                grid[x][y+1] = 0;
                updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x, y+2);
            }
        }
        else if(d[ran] === 3){   // left
            if(y-2 > -1 && !v[x][y-2]){
                v[x][y-2] = 1;
                grid[x][y-1] = 0;
                updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x, y-2);
            }
        }
        else if(d[ran] === 4){   // down
            if(x+2 < grid.length && !v[x+2][y]){
                v[x+2][y] = 1;
                grid[x+1][y] = 0;
                updateGridFromArray();
                await new Promise(requestAnimationFrame)
                await backtrackHelper(sx, sy, v, x+2, y);
            }
        }
        d.splice(ran,1)
    }




}

export async function kruskals(){





}




