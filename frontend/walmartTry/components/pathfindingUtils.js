// src/components/pathfindingUtils.js
export const aStar = (start, goal, grid) => {
  const openSet = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  const getNeighbors = (pos) => {
    const { x, y } = pos;
    const neighbors = [];

    const directions = [
      { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: 0, y: -1 }, { x: 0, y: 1 }
    ];

    for (let dir of directions) {
      const neighborX = x + dir.x;
      const neighborY = y + dir.y;

      if (
        neighborX >= 0 && neighborX < grid[0].length &&
        neighborY >= 0 && neighborY < grid.length &&
        grid[neighborY][neighborX] === 0 
      ) {
        neighbors.push({ x: neighborX, y: neighborY });
      }
    }

    return neighbors;
  };

  const heuristic = (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      gScore[`${x},${y}`] = Infinity;
      fScore[`${x},${y}`] = Infinity;
    }
  }

  gScore[`${start.x},${start.y}`] = 0;
  fScore[`${start.x},${start.y}`] = heuristic(start, goal);

  while (openSet.length > 0) {
    let current = openSet.reduce((lowest, pos) => {
      return fScore[`${pos.x},${pos.y}`] < fScore[`${lowest.x},${lowest.y}`] ? pos : lowest;
    });

    if (grid[goal.y][goal.x] === 0 && current.x === goal.x && current.y === goal.y) {
      const path = [];
      while (current) {
        path.unshift(current);
        current = cameFrom[`${current.x},${current.y}`];
      }
      return path;
    }

    openSet.splice(openSet.indexOf(current), 1);

    for (let neighbor of getNeighbors(current)) {
      const tentative_gScore = gScore[`${current.x},${current.y}`] + 1;
      if (tentative_gScore < gScore[`${neighbor.x},${neighbor.y}`]) {
        cameFrom[`${neighbor.x},${neighbor.y}`] = current;
        gScore[`${neighbor.x},${neighbor.y}`] = tentative_gScore;
        fScore[`${neighbor.x},${neighbor.y}`] = gScore[`${neighbor.x},${neighbor.y}`] + heuristic(neighbor, goal);
        if (!openSet.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // If no path to goal, find the closest walkable block to the goal
  let closestWalkable = null;
  let closestDistance = Infinity;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 0) {
        const distance = heuristic({ x, y }, goal);
        if (distance < closestDistance) {
          closestWalkable = { x, y };
          closestDistance = distance;
        }
      }
    }
  }

  if (closestWalkable) {
    return aStar(start, closestWalkable, grid);
  }

  return [];
};

  
  export const positionToGridIndex = (position, gridSize) => {
    return {
      x: Math.floor(position.x / gridSize),
      y: Math.floor(position.y / gridSize)
    };
  };
  