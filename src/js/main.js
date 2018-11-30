window.addEventListener('DOMContentLoaded', function() {
    
    const rows = 30;
    const columns = 30;
    const cellSize = 18;

    const cellStates = {
        '1': { class: 'cell__live' },
        '0': { class: 'cell__dead' }
    }

    /**@type {HTMLDivElement} */
    const domCellBlueprint = document.createElement('div');
    domCellBlueprint.classList.add('cell');

    /**
     * 
     * @param {number} max 
     */
    const getRandomInt = function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * 
     * @param {{rows: number, columns: number}} props 
     */
    const getRandom2dGrid = function(props = { rows: 10, columns: 10}) {
        let grid = [];
        let {rows, columns} = props
        for(let x = 0; x < columns; x++) {
            grid[x] = [];
            for(let y = 0; y < rows; y++) {
                grid[x][y] = getRandomInt(2);
            }   
        }
        return grid;
    }

    /**
     * 
     * @param {Array<Array<number>>} grid
     * @param {HTMLDivElement} domCellBlueprint 
     * @param {number} cellSize
     */
    const getDomGrid = function(grid, domCellBlueprint, cellSize) {
        
        /**@type {HTMLDivElement} */
        const domGrid = document.createElement('div');
        
        domGrid.classList.add('grid');
    
        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid[x].length; y++) {
                
                /**@type {HTMLDivElement} */
                const cell = domCellBlueprint.cloneNode();
                const cellState = grid[x][y];
                
                cell.setAttribute('data-coords', `${x}-${y}`);
                cell.classList.add(cellStates[cellState].class);
                cell.style.top = `${cellSize * y}px`;
                cell.style.left = `${cellSize * x}px`;
                domGrid.appendChild(cell);
            }   
        }
        return domGrid;
    }

    /**
     * 
     * @param {HTMLDivElement} domGrid 
     * @param {Array<Array<number>>} grid 
     */
    const onDomGridClick = function(domGrid, grid) {
        return function(e) {

            /**@type {HTMLDivElement} */
            const cell = e.target;
        
            if(!cell.classList.contains('cell')) {
                return;
            }
            
            const [x , y] = cell.getAttribute('data-coords').split('-');
            const cellState = grid[+x][+y];
            const newCellState = Number(!Boolean(cellState));

            grid[x][y] = newCellState;
            
            Object.keys(cellStates).forEach(state => {
                cell.classList.remove(cellStates[state].class);
            });
            cell.classList.add(cellStates[newCellState].class);
        }
    } 

    let grid = getRandom2dGrid({ rows, columns });
    const domGrid = getDomGrid(grid, domCellBlueprint, cellSize);
    
    document.querySelector('#game').appendChild(domGrid);
    domGrid.addEventListener('mousedown', onDomGridClick(this, grid));

    function update() {

        /**@type {[[number]]} */
        let nextGrid = JSON.parse(JSON.stringify(grid));
        // let nextGrid = [];

        // for(let x = 0; x < grid.length; x++) {
        //     nextGrid[x] = [];
        //     for(let y = 0; y < grid[x].length; y++) {
        //         nextGrid[x]= [...grid[x]];
        //     }
        // }

        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid[x].length; y++) {
                let nSum = 0;
                for(let nx = x - 1; nx <= x + 1; nx++) {
                    for(let ny = y - 1; ny <= y +1; ny++) {
                        if((nx >= 0 && ny >= 0) && (nx < grid.length && ny < grid[x].length) && (nx !== x || ny !== y)) {
                            nSum += grid[nx][ny];
                        }
                    }
                }
                if(grid[x][y] === 1) {
                    nextGrid[x][y] = (nSum < 2 || nSum > 3) ? 0 : 1;
                } else {
                    if(nSum === 3) {
                        nextGrid[x][y] = 1;
                    }
                }
            }
        }

        grid = JSON.parse(JSON.stringify(nextGrid));

        // for(let x = 0; x < grid.length; x++) {
        //     for(let y = 0; y < grid[x].length; y++) {
        //         grid[x] = [...nextGrid[x]];
        //     }
        // }

        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid[x].length; y++) {
                const coords = `${x}-${y}`;
                const cellState = grid[x][y];
                
                // const cells = document.getElementsByClassName('cell');
                // const cell = Array.prototype.find.call(cells, c => {
                //     return c.getAttribute('data-coords') === `${x}-${y}`;
                // });
                
                const cell = document.querySelector(`.cell[data-coords="${x}-${y}"]`);
                
                if(cellState) {
                    if(cell.classList.contains('cell__dead')) {
                        cell.classList.remove('cell__dead');
                    }
                    if(!cell.classList.contains('cell__live')) {
                        cell.classList.add('cell__live')
                    }
                } else {
                    if(cell.classList.contains('cell__live')) {
                        cell.classList.remove('cell__live');
                    }
                    if(!cell.classList.contains('cell__dead')) {
                        cell.classList.add('cell__dead')
                    }
                }
            }
        }

        requestAnimationFrame(update);
    }

    update()
});