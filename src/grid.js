let isMouseDown = false;
let isAddingWall = false;
let currentGrid = null;
let grid2d = [];
let gridSize = 0;

function createGrid(containerId, size) {
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
            grid.appendChild(square);
        }
    }
}

function updateSquareState(square) {
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    grid2d[row][col] = square.classList.contains('wall') ? 1 : 0;
}

// export function updateGridFromArray() {
//     const grid = document.getElementById('grid');
//     const squares = grid.getElementsByClassName('grid-square');
//
//     for (let i = 0; i < gridSize; i++) {
//         for (let j = 0; j < gridSize; j++) {
//             const square = Array.from(squares).find(s =>
//                 parseInt(s.dataset.row) === i &&
//                 parseInt(s.dataset.col) === j
//             );
//
//             if (square) {
//                 if (grid2d[i][j] === 1) {
//                     square.classList.add('wall');
//                 } else {
//                     square.classList.remove('wall');
//                 }
//             }
//         }
//     }
// }

export function updateGridFromArray() {
    const grid = document.getElementById('grid');
    const squares = grid.getElementsByClassName('grid-square');
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0 ; j < gridSize; j++) {
            if(grid2d[i][j] === 1){
                squares[(i*gridSize)+j].style.backgroundColor = 'black';
            }
            else if (grid2d[i][j] === 0){
                squares[(i*gridSize)+j].style.backgroundColor = 'white';
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    createGrid('grid', 19);
    
    document.getElementById('grid-size').addEventListener('change', (e) => {
        createGrid('grid', parseInt(e.target.value));
    });

    document.getElementById('reset-grid').addEventListener('click', () => {
        const size = parseInt(document.getElementById('grid-size').value);
        createGrid('grid', size);
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('grid-square')) {
            isMouseDown = true;
            currentGrid = e.target.closest('.grid-container');
            //isAddingWall = !e.target.classList.contains('wall');
            isAddingWall = !(e.target.style.backgroundColor === 'black');
          //  e.target.classList.toggle('wall');
            updateSquareState(e.target);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        currentGrid = null;
        isAddingWall = false;
    });

    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
        currentGrid = null;
    });

    document.addEventListener('mouseenter', (e) => {
        if (isMouseDown && e.target.classList.contains('grid-square') && currentGrid === e.target.closest('.grid-container')) {
            console.log("hello")
            if (isAddingWall) {
                e.target.classList.add('wall');
            } else {
                e.target.classList.remove('wall');
            }
            updateSquareState(e.target);
        }
    }, true);
});

export function get_grid(){
    return grid2d
}

export function set_grid(grid){
    grid2d = grid
}