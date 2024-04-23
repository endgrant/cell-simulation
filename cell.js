// Cell class


class Cell {
  constructor(index, position, faction, size, generation) {
    this.index = index;
    this.position = position;
    this.size = size;
    this.birthTick = millis();
    this.dead = false;
    this.prevTranslation = p5.Vector.random2D();
    this.faction = faction;
    this.generation = generation;
  }
  
  
  // Returns this Cell's lifespan percentage
  getAge() {
    return (this.birthTick - millis()) / cellLifetime + 1;
  }
  
  
  // Updates this Cell's memory of its index
  updateIndex(i) {
    this.index = i;
  }
  
  
  // Returns true if this Cell intersects the passed Cell
  isIntersecting(cell) {
    let distance = quickDist(this.position, cell.position);
    let radialSum = max(this.size, cell.size);
    
    // Check if Cells intersect
    if (radialSum > distance) {
      return true;
    } else {
      return false;
    }
  }
  
  
  // Renders the Cell for a frame
  process() {
    // Cell is already deceased on this iteration
    if (this.dead) {
      return;
    }
    
    // Cell died of old age
    if (this.getAge() <= 0) {
      this.destroy();
      return;
    }
    
    // Cell has reached the end of its lineage
    if (this.generation > endingGeneration) {
      this.destroy();
      return;
    }
    
    // Wrap faction array
    if (this.faction >= factionCount) {
      this.faction = this.faction % factionCount;
    }
    
    // Cell is large enough to split
    if (this.size > mitosisThreshold) {
      this.divide();
    }
    
    let newTranslation = p5.Vector.random2D();
    let turnAmount = this.prevTranslation.dot(newTranslation);
    newTranslation.mult(turnAmount).normalize();
    this.prevTranslation = newTranslation.copy();
    this.position.add(newTranslation.mult(cellSpeed));
    
    
    // Cell died escaping the viewport
    if (this.position.x < -width/2 - this.size ||
        this.position.x > width/2 + this.size ||
        this.position.y < -height/2 - this.size ||
        this.position.y > height/2 + this.size) {
      this.destroy();
    }
    
    // Check for collisions with other cells
    for (let c = 0; c < cells.length; c++) {
      let cell = cells[c];
      
      // Target cell is deceased
      if (cell.dead) {
        continue;
      }
      
      // Cell is in different faction
      if (this.faction != cell.faction) {
        continue;
      }
      
      // Cannot intersect self
      if (this === cell) {
        continue;
      }
      
      // Absorb intersecting cell
      if (this.isIntersecting(cell)) {
        this.absorb(cell);
      }
    }    
    
    let fillColor = factionColors[this.faction];
    fillColor.setAlpha(255 * this.getAge());
    fill(fillColor);
    circle(this.position.x, this.position.y, this.size * 2);
  }
  
  
  // Divide this cell in two
  divide() {
    let cell1 = new Cell(cells.length, this.position.copy(),
                         this.faction+1, this.size/2, this.generation+1);
    let cell2 = new Cell(cells.length+1, this.position.copy(),
                         this.faction+2, this.size/2, this.generation+1);
    cells.push(cell1);
    cells.push(cell2);
    this.destroy();
  }
  
  
  // Absorbs the passed Cell
  absorb(cell) {
    this.size += cell.size;
    this.position.add(distRatio(this, cell));
    this.birthTick = average(this.birthTick, cell.birthTick);
    this.generation = average(this.generation, cell.generation);
    cell.destroy();
  }
  
  
  // Destroys self
  destroy() {
    this.dead = true;
    cells.deref(this.index);
  }
}
