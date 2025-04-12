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
            gridfunc.set_stop(false);
            console.log(algorithm);
            switch (algorithm) {
                case 'backtracking-m':
                    await backtrack();
                    break;
                case 'backtracking-p':
                    await pathfunc.backtrack();
                    break;
                case 'kruskals':
                    kruskals()
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
    grid = gridfunc.get_grid()

    let parents = []
    let walls = []
    for (let i = 0; i < grid.length; i++) {
        parents.push([]);
        for (let j = 0; j < grid.length; j++) {
            parents[i].push([-1,-1]);
            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid.length - 1) {						// make edges walls
                grid[i][j]=1;
            }
            else if ((!(j % 2) || !(i % 2))) {													// make even rows and colunns walls
                grid[i][j] = 1;
                if (!(i % 2 === 0 && j % 2 === 0)) {
                    grid[i][j] = 1;
                    walls.push([ i,j ]);													// only nodes where one is odd get pushed into our vector
                }
            }

        }
    }

console.log(parents)
    updateGridFromArray()
   // return
    while(walls.length!==0){    //

        let ran = Math.floor(Math.random() *walls.length) //get a random wall from arr
        let wx = walls[ran][0]
        let wy = walls[ran][1]
        grid[wx][wy] = 0

        // since even we only need to check up and down
        if(wx%2){
            if(grid[wx-1][wy] !== 0 && grid[wx+1][wy] !== 0){ // up and down
                if(sameparent(parents,parents[wx-1][wy],parents[wx+1][wy])){
                    walls.splice(ran,1)
                    continue;
                }
               grid[wx][wy] = 0
                parents[wx+1][wy] = [wx-1,wy]

                walls.splice(ran,1)
            }
        }
        else{
            if(grid[wx][wy-1] !== 0 && grid[wx][wy+1] !== 0){ // up and down
                if(sameparent(parents,parents[wx][wy-1],parents[wx][wy+1])){

                    walls.splice(ran,1)
                    continue;
                }
                grid[wx][wy] = 0
                parents[wx][wy+1] = [wx,wy-1]
                walls.splice(ran,1)
            }
        }


        updateGridFromArray()
        await new Promise(requestAnimationFrame)

    }


}


function sameparent(parents, o1,o2){
    if(o1[0]===-1){
        return false
    }

    while(o1[0]!== -1){
       o1 = parents[o1[0]][o1[1]]
    }
    while(o2[0]!== -1){
        o2 = parents[o2[0]][o2[1]]
    }



    return  o1[0] === o2[0] && o2[1] === o2[1]
}
function RemoveWall(x, y, w) {
//	sort(w.begin(), w.end(), comp);
    let l = 0, m = 0, r = w.size() - 1;

    while (l <= r) {

        m = (l+r)/2;
        if (w[m][0]=== x && w[m][1]=== y) {
            //	std::cout << "wall at " << x << " " << y << " has been erased\n";
            w.splice(m,1);
            return;
        }
        else if (w[m][0] === x) {
            if (w[m][1] > y) {
                r = m-1;
            }
            else {
                l = m+1;
            }
        }
        else {
            if (w[m][1] > x) {
                r = m-1;
            }
            else {
                l = m+1;
            }
        }

    }


    //std::cout << "No wall to erase\n";
}






