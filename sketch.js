let arr = [];
let i = 0;
let sorting = false;
let numValuesSlider, algorithmSelect, startButton, subarrays, stack;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  frameRate(10);
  
  // Get UI elements from HTML
  numValuesSlider = select('#num-values');
  algorithmSelect = select('#algorithm');
  startButton = select('#start-button');
  
  
   // Initialize array
  resetArray();
  
  startButton.mousePressed(startSorting);

}


function draw() {
  background(220);
  drawBars();
  
  if (sorting) {
    if (sortingAlgorithm === 'bubble-sort') {
      bubbleSortStep();
    } else if (sortingAlgorithm === 'insertion-sort') {
      insertionSortStep();
    } else if (sortingAlgorithm === 'quick-sort') {
      quickSortStep();
    } else if (sortingAlgorithm === 'merge-sort') {
      mergeSortStep();
    }
  }
}


function drawBars() {
  const barWidth = width / arr.length;
  for (let i = 0; i < arr.length; i++) {
    const barHeight = arr[i] * (height / 20);
    fill(100);
    rect(i * barWidth, height - barHeight, barWidth, barHeight);
  }
}

function resetArray() {
  arr = Array(parseInt(numValuesSlider.value())).fill().map(() => floor(random(20)) + 1);
  i = 0;
  sorting = false;
}

function startSorting() {
  resetArray();
  sorting = true;
  i = 0;
  sortingAlgorithm = algorithmSelect.value();
  subarrays = null
  stack = [[0, arr.length - 1]];
}


function bubbleSortStep() {
  if (i < arr.length) {
    for (let k = 0; k < arr.length - i - 1; k++) {
      if (arr[k] > arr[k + 1]) {
        [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
      }
    }
    i++;
  } else {
    sorting = false;
    console.log('Bubble sort complete:', arr);
  }
}



function insertionSortStep() {
  if (i < arr.length) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
    i++;
  } else {
    sorting = false;
    console.log('Insertion sort complete:', arr);
  }
}



function mergeSortStep() {
  if (!subarrays) {
    subarrays = arr.map(num => [num]);
  }
  if (subarrays.length > 1) {
    let left = subarrays.shift();
    let right = subarrays.shift();
    let merged = [];
    while (left.length && right.length) {
      merged.push(left[0] <= right[0] ? left.shift() : right.shift());
    }
    merged = [...merged, ...left, ...right];
    subarrays.push(merged);
    
    // Update the main array to reflect the current state
    updateMainArray();
  } else {
    arr = subarrays[0];
    sorting = false;
    console.log('Merge sort complete:', arr);
  }
}

function updateMainArray() {
  let index = 0;
  for (let subarray of subarrays) {
    for (let value of subarray) {
      arr[index++] = value;
    }
  }
}



function quickSortStep() {
  if (stack.length > 0) {
    let [low, high] = stack.pop();
    if (low < high) {
      let pivotIndex = partition(low, high);
      stack.push([low, pivotIndex - 1]);
      stack.push([pivotIndex + 1, high]);
    }
  } else {
    sorting = false;
    console.log('Quick sort complete:', arr);
  }
}


function partition(low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
