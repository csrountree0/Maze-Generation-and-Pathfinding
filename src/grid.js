import {set_start,set_end} from './maze-algorithms.js';

let isMouseDown = false;
let isAddingWall = false;
let currentGrid = null;
let grid2d = [];
let gridSize = 0;
let generating = false;
let stop = false;

function createGrid(containerId, size) {
    set_start(-1,-1);
    set_end(-1,-1);
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
        const size = parseInt(document.getElementById('grid-size').value);
        createGrid('grid', size);
        stop = true;
    });

    document.addEventListener('mousedown', (e) => {
        if (!generating && e.target.classList.contains('grid-square')) {
            isMouseDown = true;
            currentGrid = e.target.closest('.grid-container');
            isAddingWall = !(e.target.style.backgroundColor === 'black');
            if (isAddingWall) {
                e.target.style.backgroundColor = 'black';
            } else {
                e.target.style.backgroundColor = 'white';
            }
            e.target.style.borderColor = e.target.style.backgroundColor;
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
        if (!generating && isMouseDown && e.target.classList.contains('grid-square') && currentGrid === e.target.closest('.grid-container')) {
            if (isAddingWall) {
                e.target.style.backgroundColor = 'black';
            } else {
                e.target.style.backgroundColor = 'white';
            }
            e.target.style.borderColor = e.target.style.backgroundColor;
            updateSquareState(e.target);
        }
    }, true);
});

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

