



let arr = [];
let i = 0;
let sorting = false;
let numValuesSlider, algorithmSelect, startButton, subarrays, stack, GREEN, BLUE;


function setup() {
 
// for large screens the canvas dimensions are 800*460, for small screens 0.8*windowWidth x 0.5*windowHeight

  let canvasWidth, canvasHeight;

    if (windowWidth >= 800) {  
        canvasWidth = 800;
        canvasHeight = 460;
    } else {  
        canvasWidth = windowWidth * 0.8;
        canvasHeight = windowHeight * 0.4;
    }

  let canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container');

  // the number of times we will execute the draw function per second
  frameRate(10);
 
  numValuesSlider = select('#num-values');
  numValuesSlider.input(updateArrayDraw);
  algorithmSelect = select('#algorithm');
  startButton = select('#start-button');
  
  
  
  startButton.mousePressed(startSorting);
  BLUE = color('#2f76cc')
  GREEN = color('#50ad8e')


  // this function draws the bars when the user changes the range input
  updateArrayDraw();
}


function updateArrayDraw() {
  let numValues = parseInt(numValuesSlider.value());  
  arr = Array(numValues).fill().map(() => floor(random(30)) + 1);
  colors = Array(arr.length).fill(color(100));
  document.getElementById('array-size-display').textContent = numValues;

  background(220);
  drawBars();
}



// this is needed in case the user resizes the window
function windowResized() {
  if (windowWidth >= 800) {
    resizeCanvas(800, 460);
} else {
    resizeCanvas(windowWidth * 0.8, windowHeight * 0.5);
}
}


function draw() {
  background(220);
  drawBars();
  
  if (sorting) {

    // this disables the range input if the animation is running so the user cant change the array
    numValuesSlider.elt.disabled = true;

    if (sortingAlgorithm === 'bubble-sort') {
      bubbleSortStep();
    } else if (sortingAlgorithm === 'insertion-sort') {
      insertionSortStep();
    } else if (sortingAlgorithm === 'quick-sort') {
      quickSortStep();
    } else if (sortingAlgorithm === 'merge-sort') {
      mergeSortStep();
    }
  } else {
    numValuesSlider.elt.disabled = false;
  }
}



function drawBars() {
  const barWidth = width / arr.length;
  for (let i = 0; i < arr.length; i++) {
    const barHeight = arr[i] * (height / 30);
    fill(colors[i]);
    rect(i * barWidth, height - barHeight, barWidth, barHeight);
  }
}


function resetArray() {
  arr = Array(parseInt(numValuesSlider.value())).fill().map(() => floor(random(30)) + 1);
  colors = Array(arr.length).fill(color(100)); 
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





/* coloring rule : in each iteration color the bar that is correctly sorted in blue, other ones in green
this works correctly for insertion sort and bubble sort and quick sort, because in each iteration a bar is guarenteed
to be in its correct position, for merge sort this doesnt exactly work and i have exactly zero clue what is going on

*/


function bubbleSortStep() {
  if (i < arr.length) {
    for (let k = 0; k < arr.length - i - 1; k++) {
      if (arr[k] > arr[k + 1]) {
        [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
        colors[k] = GREEN;
        colors[k + 1] = GREEN;
       } 
    }
    colors[arr.length - i - 1] = BLUE;
    i++;
  } else {
    sorting = false;
    colors = Array(arr.length).fill(BLUE);
    console.log('Bubble sort complete:', arr);
  }
}



function insertionSortStep() {
  if (i < arr.length) {
    let key = arr[i];
    let j = i - 1;
    colors[i] = GREEN;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      colors[j + 1] = GREEN;
      j--;
    }
    arr[j + 1] = key;
    for (let k = 0; k <= i; k++) {
      colors[k] = BLUE;
    }
    i++;
  } else {
    sorting = false;
    colors = Array(arr.length).fill(BLUE);
    console.log('Insertion sort complete:', arr);
  }
}


/* 
this function is different from the other ones because of how merge sort works,
because steps in merge sort are sorting steps for sub arrays of the original array and not
modifications of the original array itself ( not until the end ), hence the need for 
updateMainArray() to keep updating the original array for the animation
*/


function mergeSortStep() {
  if (!subarrays) {
    subarrays = arr.map(num => [num]);
    colors = Array(arr.length).fill(100);
  }
  if (subarrays.length > 1) {
    let left = subarrays.shift();
    let right = subarrays.shift();
    let merged = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        merged.push(left[leftIndex]);
        colors[merged.length - 1] = GREEN;
        leftIndex++;
      } else {
        merged.push(right[rightIndex]);
        colors[merged.length - 1] = GREEN;
        rightIndex++;
      }
    }
    merged = [...merged, ...left.slice(leftIndex), ...right.slice(rightIndex)];
    subarrays.push(merged);
    updateMainArray();
    
    let startIndex = arr.length - merged.length;
    for (let i = startIndex; i < arr.length; i++) {
      colors[i] = BLUE;
    }
  } else {
    arr = subarrays[0];
    colors = Array(arr.length).fill(BLUE);
    sorting = false;
    console.log('Merge sort complete:', arr);
  }
}


function updateMainArray() {
  let index = 0;
  for (let subarray of subarrays) {
    for (let value of subarray) {
      arr[index] = value;
      index++;
    }
  }
}




function quickSortStep() {
  if (stack.length > 0) {
    let [low, high] = stack.pop();
    if (low < high) {
      let pivotIndex = partition(low, high);
      
      colors[pivotIndex] = BLUE;
    

      for (let i = low; i <= high; i++) {
        if (i !== pivotIndex) {
          colors[i] = GREEN
        }
       
      }
      stack.push([low, pivotIndex - 1]);
      stack.push([pivotIndex + 1, high]);
    }
  } else {
    sorting = false;
    colors = Array(arr.length).fill(BLUE);
    console.log('Quick sort complete:', arr);
  }
}



function partition(low, high) {
  let pivot = arr[high];
  colors[high] = BLUE;
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    colors[j] = GREEN;
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      colors[i] = GREEN;
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  colors[i + 1] = BLUE; 
    
  return i + 1;
}
