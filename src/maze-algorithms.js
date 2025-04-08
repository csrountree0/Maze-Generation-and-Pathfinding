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

        grid.addEventListener('drop', (e) => {
            console.log("me3")

            e.preventDefault();
            grid.classList.remove('drag-over');

            const algorithm = e.dataTransfer.getData('algorithm');

            const size = Math.sqrt(grid.children.length);
            createGrid(grid.id, size);

            switch (algorithm) {
                case 'backtracking':
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