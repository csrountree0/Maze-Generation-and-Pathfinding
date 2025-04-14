let isMouseDown = false;
let isAddingWall = false;
let currentGrid = null;
let grid2d = [];
let gridSize = 0;
let generating = false;
let stop = false;
let start = null;
let end = null;

function createGrid(containerId, size) {
    document.getElementById('time-value').textContent = '0s';
    document.getElementById('steps-value').textContent = '0';
    set_start(-1,-1);
    set_end(-1,-1);
    start = null;
    end = null;
    gridSize = size;
    grid2d = Array(size).fill().map(() => Array(size).fill(0));
    const grid = document.getElementById(containerId);
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    grid.innerHTML = '';

    for (let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            const square = document.createElement('div');
            square.className = 'grid-square';
            square.draggable = false;
            square.dataset.row = i;
            square.dataset.col = j;
            square.style.backgroundColor = 'white';
            square.style.borderColor = square.style.backgroundColor;
            grid.appendChild(square);
        }
    }
}

function updateSquareState(square) {
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    grid2d[row][col] = square.style.backgroundColor === 'black' ? 1 : 0;
}

export function updateGridFromArray() {
    const grid = document.getElementById('grid');
    const squares = grid.getElementsByClassName('grid-square');
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0 ; j < gridSize; j++) {
            const square = squares[(i*gridSize)+j];
            
            switch(grid2d[i][j]) {
                case 0: // empty
                    square.style.backgroundColor = 'white';
                    square.style.borderColor = 'white';
                    break;
                case 1: // wall
                    square.style.backgroundColor = 'black';
                    break;
                case 2: // start
                    square.style.backgroundColor = 'green';
                    break;
                case 3: // end
                    square.style.backgroundColor = 'red';
                    break;
                case 4: // path
                    square.style.backgroundColor = 'yellow';
                    break;
                case 5: // unexplored
                    square.style.backgroundColor = 'purple';
                    break;
                case 6: // group color 1
                    square.style.backgroundColor = 'blue';
                    break;
                case 7: // group color 2
                    square.style.backgroundColor = 'orange';
                    break;
                case 8: // group color 3
                    square.style.backgroundColor = 'pink';
                    break;
                case 9: // group color 4
                    square.style.backgroundColor = 'cyan';
                    break;
                case 10: // group color 5
                    square.style.backgroundColor = 'magenta';
                    break;
                default:
                    square.style.backgroundColor = 'white';
            }
            square.style.borderColor = square.style.backgroundColor;
        }   
    }
}


document.addEventListener('DOMContentLoaded', () => {
    createGrid('grid', 19);
    
    document.getElementById('grid-size').addEventListener('change', (e) => {
        createGrid('grid', parseInt(e.target.value));
    });

    document.getElementById('reset-grid').addEventListener('click', () => {
        createGrid('grid', gridSize);
    });

    document.getElementById('reset-paths').addEventListener('click', () => reset_paths());

   
    const grid = document.getElementById('grid');
    let draggedPoint = null;


    const startPoint = document.createElement('div');
    startPoint.className = 'draggable-point start-point';
    startPoint.draggable = true;
    startPoint.textContent = 'Start';
    startPoint.addEventListener('dragstart', (e) => {
        draggedPoint = 'start';
        e.dataTransfer.setData('text/plain', 'start');
    });
    startPoint.addEventListener('dragend', () => {
        draggedPoint = null;
    });

    const endPoint = document.createElement('div');
    endPoint.className = 'draggable-point end-point';
    endPoint.draggable = true;
    endPoint.textContent = 'End';
    endPoint.addEventListener('dragstart', (e) => {
        draggedPoint = 'end';
        e.dataTransfer.setData('text/plain', 'end');
    });
    endPoint.addEventListener('dragend', () => {
        draggedPoint = null;
    });

   
    const controlPanel = document.querySelector('.controls-panel');
    const pointsContainer = document.createElement('div');
    pointsContainer.className = 'points-container';
    pointsContainer.appendChild(startPoint);
    pointsContainer.appendChild(endPoint);
    controlPanel.insertBefore(pointsContainer, controlPanel.firstChild);


    grid.addEventListener('dragover', (e) => {
        if (e.target.classList.contains('grid-square') && draggedPoint) {
            e.preventDefault();
        }
    });

    grid.addEventListener('dragenter', (e) => {
        if (!generating && e.target.classList.contains('grid-square') && draggedPoint) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            if (grid2d[row][col] !== 1) {
                e.target.classList.add('drag-over');
            }
        }
    });

    grid.addEventListener('dragleave', (e) => {
        if (e.target.classList.contains('grid-square') && draggedPoint) {
            e.target.classList.remove('drag-over');
        }
    });

    grid.addEventListener('drop', (e) => {
        if (!generating && e.target.classList.contains('grid-square') && draggedPoint) {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            if (grid2d[row][col] === 1) return;

            if (draggedPoint === 'start') {
                reset_paths();
                if (start) {
                    grid2d[start[0]][start[1]] = 0;
                }
             
                start = [row, col];
                grid2d[row][col] = 2;
                set_start(row, col);
            } else if (draggedPoint === 'end') {
                reset_paths();
                if (end) {
                    grid2d[end[0]][end[1]] = 0;
                }
                end = [row, col];
                grid2d[row][col] = 3;
                set_end(row, col);
            }
            
            updateGridFromArray();
            draggedPoint = null; 
        }
    });

    function handleWallDrawing(e) {
        if (!generating && e.target.classList.contains('grid-square')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            isMouseDown = true;
            currentGrid = e.target.closest('.grid-container');
            isAddingWall = !(e.target.style.backgroundColor === 'black');
            
           
            if (isAddingWall) {
                if (grid2d[row][col] === 2) {
                    start = null;
                    set_start(-1, -1);
                } else if (grid2d[row][col] === 3) {
                    end = null;
                    set_end(-1, -1);
                }
                e.target.style.backgroundColor = 'black';
            } else {
                e.target.style.backgroundColor = 'white';
            }
            e.target.style.borderColor = e.target.style.backgroundColor;
            updateSquareState(e.target);
        }
    }

   
    document.addEventListener('mousedown', handleWallDrawing);
    document.addEventListener('touchstart', handleWallDrawing);

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        currentGrid = null;
        isAddingWall = false;
    });

    document.addEventListener('touchend', () => {
        isMouseDown = false;
        currentGrid = null;
        isAddingWall = false;
    });

    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
        currentGrid = null;
    });

    function handleWallDrawingMove(e) {
        if (!generating && isMouseDown && e.target.classList.contains('grid-square') && currentGrid === e.target.closest('.grid-container')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            if (isAddingWall) {
             
                if (grid2d[row][col] === 2) {
                    start = null;
                    set_start(-1, -1);
                } else if (grid2d[row][col] === 3) {
                    end = null;
                    set_end(-1, -1);
                }
                e.target.style.backgroundColor = 'black';
            } else {
                e.target.style.backgroundColor = 'white';
            }
            e.target.style.borderColor = e.target.style.backgroundColor;
            updateSquareState(e.target);
        }
    }

    document.addEventListener('mousemove', handleWallDrawingMove);
    document.addEventListener('touchmove', handleWallDrawingMove);
});

export function reset_paths(){
    stop = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid2d[i][j] === 4 || grid2d[i][j] === 5) {
                grid2d[i][j] = 0;
            }
        }
    }
    updateGridFromArray();
}

export function update_stats(time,steps){
    time = (Date.now() - time)/1000;
    document.getElementById('time-value').textContent = `${time}s`;
    document.getElementById('steps-value').textContent = `${steps}`;

}

export function get_grid(){
    return grid2d;
}

export function set_grid(grid){
    grid2d = grid;
    updateGridFromArray();
}

export function set_generating(v){
    generating = v;
}
export function get_generating(){
    return generating;
}

export function get_stop(){
    return stop;
}
export function set_stop(v){
    stop = v;
}

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

