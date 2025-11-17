let data, bomb;
let countries = ["USA", "USSR", "CHINA", "UK", "FRANCE", "INDIA", "PAKISTAN"];
let UG_types = [
  "UG",
  "SHAFT",
  "TUNNEL",
  "GALLERY",
  "MINE",
  "SHAFT/GR",
  "SHAFT/LG",
];
let colors = [
  [168, 15, 18],
  [158, 166, 194],
  [213, 234, 239],
  [189, 230, 88],
  [143, 140, 124],
  [228, 46, 43],
  [197, 160, 232],
];

function preload() {
  data = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(5, 21, 29);

  fill(0, 255, 0);
  textSize(20);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text("NUCLEAR EXPLOSIONS", 40, 40);

  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  bomb = data.getRow(Number(id));

  let gridCols = 36;
  let gridRows = 24;
  let cellSize = 22;
  let startX = width / 2 - (gridCols * cellSize) / 2;
  let startY = height / 2 - (gridRows * cellSize) / 2;

  stroke(0, 255, 0, 50);
  strokeWeight(0.5);
  noFill();
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      rect(startX + i * cellSize, startY + j * cellSize, cellSize, cellSize);
    }
  }

  let gridRightX = startX + gridCols * cellSize;
  let gridBottomY = startY + gridRows * cellSize;

  stroke(0, 255, 0);
  strokeWeight(1);
  line(gridRightX + 100, startY, gridRightX + 100, gridBottomY);

  let years = [1945, 1950, 1960, 1970, 1980, 1990, 1998];
  let yearStart = years[0];
  let yearEnd = years[years.length - 1];

  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(0, 255, 0, 150);
  textSize(10);

  for (let i = 0; i < years.length; i++) {
    let proportion = (years[i] - yearStart) / (yearEnd - yearStart);
    let yearY = gridBottomY - proportion * (gridBottomY - startY);
    text(years[i], gridRightX + 120, yearY);
  }

  let minLonLabel = -180;
  let maxLonLabel = 180;
  let minLatLabel = -90;
  let maxLatLabel = 90;
  let ticks = 5;

  for (let i = 0; i < ticks; i++) {
    let t = i / (ticks - 1);
    let lon = lerp(minLonLabel, maxLonLabel, t);
    let x = startX + t * (gridCols * cellSize);
    text(nf(lon, 1, 0) + "°", x, startY - 12);
  }

  textAlign(RIGHT, CENTER);
  for (let i = 0; i < ticks; i++) {
    let t = i / (ticks - 1);
    let lat = lerp(maxLatLabel, minLatLabel, t);
    let y = startY + t * (gridRows * cellSize);
    textAlign(LEFT, CENTER);
    text(nf(lat, 1, 0) + "°", startX + gridCols * cellSize + 8, y);
  }

  textAlign(LEFT, CENTER);
  textSize(12);
  fill(197, 160, 232);
  text("name:", 40, 100);
  text("id:", 40, 180);
  text("type:", 40, 350);
  text("yield (length of the rectangle):", 40, 530);
  text("atmosphere", 40, 400);
  text("underground", 40, 450);
  text("location (center of the rectangle):", 40, 580);
  text("depth (width of the rectangle):", 40, 630);
  fill(231, 226, 91);
  text(bomb.get("name"), 40, 130);
  text(bomb.get("id_no"), 40, 210);  
  text(bomb.get("type"), 40, 370);
  text(bomb.get("average_yield"), 40, 550);
  text(
    "Lat: " + bomb.get("latitude") + ",  Lon: " + bomb.get("longitude"),
    40,
    600
  );
  text(bomb.get("depth"), 40, 650);
  textSize(18);

  drawGradientRect(40, 415, 70, 20, color(0, 200, 50), color(5, 21, 29));
  drawGradientRect(40, 465, 70, 20, color(0, 200, 255), color(5, 21, 29));

  let lon = Number(bomb.get("longitude"));
  let lat = Number(bomb.get("latitude"));
  let depth = Number(bomb.get("depth"));
  let avgYield = Number(bomb.get("average_yield"));
  let allDepths = data.getColumn("depth");
  let allYields = data.getColumn("average_yield");
  let allYears = data.getColumn("year").map(Number);
  let minDepth = min(allDepths);
  let maxDepth = max(allDepths);
  let minYield = min(allYields);
  let maxYield = max(allYields);
  let minYear = min(allYears);
  let maxYear = max(allYears);

  let bombYear = Number(bomb.get("year"));
  let proportion = (bombYear - minYear) / (maxYear - minYear);
  let bombY = gridBottomY - proportion * (gridBottomY - startY);
  let bombX = gridRightX + 100;

  fill(197, 160, 232);
  ellipse(bombX, bombY, 10, 10);

  let col = floor(map(lon, -180, 180, 0, gridCols));
  let row = floor(map(lat, -90, 90, gridRows, 0));

  let rectCols = floor(map(depth, minDepth, maxDepth, 1, 8));
  let rectRows = floor(map(avgYield, minYield, maxYield, 1, 8));

  if (col + rectCols > gridCols) col = gridCols - rectCols;
  if (row + rectRows > gridRows) row = gridRows - rectRows;

  let centerX = startX + col * cellSize + (rectCols * cellSize) / 2;
  let centerY = startY + row * cellSize + (rectRows * cellSize) / 2;

  let country = bomb.get("country");
  let type = bomb.get("type");
  let colorIndex = countries.indexOf(country);

  fill(colors[colorIndex]);
  noStroke();
  rect(
    centerX - (rectCols * cellSize) / 2,
    centerY - (rectRows * cellSize) / 2,
    rectCols * cellSize,
    rectRows * cellSize
  );

  let x1 = centerX - (rectCols * cellSize) / 2;
  let x2 = centerX;
  let ctx = drawingContext;
  let gradient = ctx.createLinearGradient(x1, 0, x2, 0);

  if (UG_types.includes(type)) {
    gradient.addColorStop(0, "rgba(0,200,255,1)");
    gradient.addColorStop(1, "rgba(0,100,255,0)");
  } else {
    gradient.addColorStop(0, "rgba(0, 200, 50,1)");
    gradient.addColorStop(1, "rgba(0,200,0,0)");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(
    centerX - (rectCols * cellSize) / 2,
    centerY - (rectRows * cellSize) / 2,
    (rectCols * cellSize) / 2,
    rectRows * cellSize
  );
  let num = countries.length;
  let spacing = 100;
  let circleDiameter = 20;
  let totalWidth = (num - 1) * spacing;
  let circleX = (width - totalWidth) / 2;
  let y = height - 60;

  textSize(12);
  fill(197, 160, 232);
  text("the state that carried\nout the explosion:", 40, y);

  noStroke();
  textAlign(CENTER, TOP);

  for (let i = 0; i < num; i++) {
    let x = circleX + i * spacing;
    fill(colors[i]);
    ellipse(x, y, circleDiameter, circleDiameter);
    fill(0, 255, 0);
    text(countries[i], x, y + circleDiameter / 2 + 8);
  }
}
function drawGradientRect(x, y, w, h, c1, c2) {
  noStroke();
  for (let i = 0; i < w; i++) {
    let t = map(i, 0, w - 1, 0, 1);
    t = pow(t, 0.6);
    let c = lerpColor(c1, c2, t);
    fill(c);
    rect(x + i, y, 1, h);
  }
}
