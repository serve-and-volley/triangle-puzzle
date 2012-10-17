function TrianglePuzzle() {
  // The triangle lattice input
  var triangle = document.triangleForm.triangleInput.value;

  // Converting the input into an array consisting of the triangle rows
  var triangleArray = triangle.split(/\n/);	
  var n = triangleArray.length;
  document.triangleForm.triangleSize.value = n;  

  // Initialize "bottom" row
  var bottomRow = triangleArray[n - 1].split(" ");
  for (j = 0; j < bottomRow.length; j++) {
    bottomRow[j] = +bottomRow[j];
  } 

  // Max Array
  var maxArray = triangle.split(/\n/);
  for (i=0; i<maxArray.length; i++) {
    maxArray[i] = maxArray[i].split(" ");
  }  

  // Adds the maximum sum for each row, starting at the bottom
  var topRow;
  var m;
  for (i = n - 1; i >= 1; i--) {
    topRow = triangleArray[i-1].split(" ");
    m = topRow.length;
    for (j = 0; j < m; j++) {
      topRow[j] = +topRow[j];
      if (bottomRow[j] > bottomRow[j+1]) {
        bottomRow[j] = topRow[j] + bottomRow[j];
        maxArray[i-1][j] = bottomRow[j];
      }
      else {
        bottomRow[j] = topRow[j] + bottomRow[j+1];
        maxArray[i-1][j] = bottomRow[j];        
      }
    }
  }

  // Outputs the maximum sum
  document.triangleForm.outputSum.value = bottomRow[0];    

  // Array of the max summations from the algorithm  
  maxArray[0][0] = "yes";

  for (i=1; i<maxArray.length; i++) {
    for (j=0; j<maxArray[i].length; j++) {
      if (maxArray[i-1][j] == "yes") {
        if (maxArray[i][j] > maxArray[i][j+1]) {
          maxArray[i][j] = "yes";
        }
        else if (maxArray[i][j] < maxArray[i][j+1]) {
          maxArray[i][j+1] = "yes";
        }
        else {
          maxArray[i][j] = "yes";
          maxArray[i][j+1] = "yes";
        }
      }
    }
  }

  /* For debugging
  test = "";
  for (i=0; i<n; i++){
    test = test + maxArray[i] + "<br />";
  }  
  document.getElementById('test1').innerHTML = test + "<br />";
  */

  // Sets up the arrays to display the triangle and path
  var pathArray = new Array(triangleArray.length);
  for (i = 0; i < pathArray.length; i++) {
    triangleRow = triangleArray[i].split(" ");        
    pathArray[i] = new Array(triangleRow.length);
  }

  for (i = 0; i < pathArray.length; i++) {
    triangleRow = triangleArray[i].split(" ");        
    for (j = 0; j < triangleRow.length; j++) {
      pathArray[i][j] = triangleRow[j];
    }
  }  
  var size = pathArray.length;
  var triangleGrid = new Array(size);
  var extraSpacingArray = new Array(size);
  var maxGrid = new Array(size);
  var gridSize = 2*size - 1;
  for (i = 0; i < size; i++) {
    triangleGrid[i] = new Array(gridSize);
    extraSpacingArray[i] = new Array(gridSize);
    maxGrid[i] = new Array(gridSize);    
  }
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      triangleGrid[i][2*j] = pathArray[i][j];       
      extraSpacingArray[i][2*j] = pathArray[i][j];    
      maxGrid[i][2*j] = maxArray[i][j];
    }    
  }  
  for (i=1; i<size; i++) {
    for (j=0; j<gridSize; j++) {
      triangleGrid[size-i-1][gridSize-j] = triangleGrid[size-i-1][gridSize-j-i];
      extraSpacingArray[size-i-1][gridSize-j] = triangleGrid[size-i-1][gridSize-j-i];
      maxGrid[size-i-1][gridSize-j] = maxGrid[size-i-1][gridSize-j-i];                  
    }
  }
  for (i=0; i<size-1; i++) {
    triangleGrid[i][0] = null;
    extraSpacingArray[i][0] = null;
    maxGrid[i][0] = null;           
  }

  // Transposes the triangleGrid array 
  var triangleGridTranspose = new Array(gridSize);
  for (i = 0; i < gridSize; i++) {
    triangleGridTranspose[i] = new Array(size);
  }
  for (i = 0; i < gridSize; i++) {
    for (j = 0; j < size; j++) {
        triangleGridTranspose[i][j] = triangleGrid[j][i];
        if (triangleGridTranspose[i][j] == null) {
          triangleGridTranspose[i][j] = 0;
        }
      }
  }

  var columnMax = new Array(gridSize);
  for (i=0; i<gridSize; i++) {
    columnMax[i] = Math.max.apply(Math, triangleGridTranspose[i]);
  }

  // Calculates the proper spacing for each number
  for (i=0; i<size; i++) {
    for (j=0; j<gridSize; j++) {  
      if (extraSpacingArray[i][j] == null) {
        extraSpacingArray[i][j] = 0;
      }
      var a = columnMax[j].toString();
      var b = extraSpacingArray[i][j].toString();
      var c =  a.length - b.length;
      //extraSpacingArray[i][j] = c;
      dummySpace = "";
      for (k=0; k<c; k++) {
        dummySpace = dummySpace + "&nbsp;";
      }
      extraSpacingArray[i][j] = dummySpace;
    }
  }

  // The symbol separating the numbers
  spaceSymbol = "&nbsp;"
  for (i=0; i<size; i++) {
    for (j=0; j<gridSize; j++) {
      if (triangleGrid[i][j] == null) {
        triangleGrid[i][j] = spaceSymbol;
      }
    }
  }

  // Display triangle inside the div box
  var display = "";
  var spacing;
  for (i=0; i<size; i++) {
    display = display + "<br />";
    for (j=0; j<gridSize; j++) {
      spacing = "";
      for (k=1; k<=1*1; k++){ 
        spacing = spacing + spaceSymbol + spacing;
      }
      if (maxGrid[i][j] == "yes") {
        display = display + "<font style='color:#FF0000;'><b>" + triangleGrid[i][j] + "</b></font>" + spacing + extraSpacingArray[i][j];  
      }
      else {
        display = display + triangleGrid[i][j] + spacing + extraSpacingArray[i][j];                      
      }
    }
  }
  document.getElementById('test1').innerHTML = display;

  // For debugging purposes
  var test2 = "";
  for (i=0; i<size; i++) {
    test2 = test2 + maxGrid[i] + "<br />";
  }

// Display triangle and maximum path on new window
  /*
  var display2;
  display2 = "<div style='font-family:courier; font-size:15px;'><font style='font-family:Baskerville; font-size:16px'>The maximum possible path sum is: <font style='color:#32CD32;'>" + bottomRow[0] + "</font><br /><br />For large triangles, resize the window and using scrolling for optimal viewing.</li></ul></font><br /><br />" + display + "</div>";

  var newWindow = window.open("","","width=570,height=300,scrollbars=1,resizable=1, top=0,left=600");
  newWindow.document.open();
  newWindow.document.write(display2);
  newWindow.document.close();
  */
// End Triangle Display
}

function RandomTriangle() {

var rows = document.triangleForm.randomRows.value;
var maxNumber = document.triangleForm.randomMax.value;

var newTriangle = "";
var newTriangleArray = new Array(rows);
for (i = 0; i < rows; i++) {
  newTriangleArray[i] = new Array(i+1);
  for (j = 0; j < i+1; j++) {
    newTriangleArray[i][j] = Math.floor(Math.random()*maxNumber);
    newTriangleArray[i][j] += '';
    if (j < i) {
      newTriangle = newTriangle + newTriangleArray[i][j] + " ";      
    }
    else {
      newTriangle = newTriangle + newTriangleArray[i][j];
    }
  }
  if (i < rows-1) {
    newTriangle = newTriangle + "\n";    
  }
  else {
    newTriangle = newTriangle;
  }
}
document.triangleForm.triangleInput.value = newTriangle;
//document.getElementById('randomTriangleOutput').innerHTML = newTriangle;

TrianglePuzzle();
}

function TriangleWindow() {  
  var sum = document.triangleForm.outputSum.value;
  var display = document.getElementById('test1').innerHTML;

  var display2;
  display2 = "<div style='font-family:Monaco; font-size:15px;'><font style='font-family:Helvetica; font-size:16px'>The maximum possible path sum is: <font style='color:#32CD32;'>" + sum + "</font><br /><br />For large triangles, resize the window and using scrolling for optimal viewing.</li></ul></font><br /><br />" + display + "</div>";  

  var newWindow = window.open("","","width=570,height=300,scrollbars=1,resizable=1, top=0,left=600");
  newWindow.document.open();
  newWindow.document.write(display2);
  newWindow.document.close();
}