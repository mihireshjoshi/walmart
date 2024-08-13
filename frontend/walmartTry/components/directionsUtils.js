// src/components/directionsUtils.js

export const generateDirections = (path) => {
    const directions = [];
  
    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const current = path[i];
      
      if (current.x > prev.x) {
        directions.push('Move right');
      } else if (current.x < prev.x) {
        directions.push('Move left');
      } else if (current.y > prev.y) {
        directions.push('Move down');
      } else if (current.y < prev.y) {
        directions.push('Move up');
      }
    }
  
    return directions;
  };
  