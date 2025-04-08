let isMouseDown = false;
let isAddingWall = false;
let currentGrid = null;

function createGrid(containerId, size) {
    const grid = document.getElementById(containerId);
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    grid.innerHTML = '';
    
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.className = 'grid-square';
        square.draggable = false;
        square.classList.add('right-wall', 'bottom-wall', 'left-wall', 'top-wall');
        
        grid.appendChild(square);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createGrid('grid', 20);
    
    document.getElementById('grid-size').addEventListener('change', (e) => {
        createGrid('grid', parseInt(e.target.value));
    });

    document.getElementById('reset-grid').addEventListener('click', () => {
        const size = parseInt(document.getElementById('grid-size').value);
        createGrid('grid', size);
    });

    document.addEventListener('mousedown', (e) => {
        console.log("mousedown");
        if (e.target.classList.contains('grid-square')) {
            isMouseDown = true;
            currentGrid = e.target.closest('.grid-container');
            isAddingWall = !e.target.classList.contains('wall');
            e.target.classList.toggle('wall');
        }
    });

    document.addEventListener('mouseup', () => {
        console.log("mouseup");
        isMouseDown = false;
        currentGrid = null;
        isAddingWall = false;
    });

    document.addEventListener('mouseleave', () => {
        console.log("mouseleave");
        isMouseDown = false;
        currentGrid = null;
    });

     document.addEventListener('mouseenter', (e) => {
         if (isMouseDown && e.target.classList.contains('grid-square') && currentGrid === e.target.closest('.grid-container')) {
             if (isAddingWall) {
                 e.target.classList.add('wall');
            } else {
                 e.target.classList.remove('wall');
             }
             console.log("mouseenter");
         }

     }, true);
});