// main.js

// ===== 기본 설정 =====
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
const currentLocationText = document.getElementById("current-location");
const searchInput = document.getElementById("search-input");
const autocompleteBox = document.getElementById("autocomplete");

const STORE_WIDTH = 360;
const STORE_HEIGHT = 480;

// 선반 레이아웃 (1~10번, 4줄, 간격 1m 가정)
const SHELF_COUNT = 10;
const ROW_COUNT = 4;

// 캔버스 좌표계에서 선반 위치 계산
// (단순하게 왼쪽에서 오른쪽으로 1~10번, 위에서 아래로 줄 1~4)
function getShelfPosition(shelf, row) {
  const marginX = 20;
  const marginY = 80;
  const shelfWidth = 20;
  const shelfHeight = 50;
  const gapX = (STORE_WIDTH - marginX * 2 - shelfWidth * SHELF_COUNT) / (SHELF_COUNT - 1);
  const gapY = 20; // 줄 간격 비율용 (대략)

  const x = marginX + (shelf - 1) * (shelfWidth + gapX) + shelfWidth / 2;
  const y = marginY + (row - 1) * (shelfHeight + gapY) + shelfHeight / 2;
  return { x, y, shelfWidth, shelfHeight };
}

// ===== 현재 위치: QR 파라미터에서만 가져오기 =====
let currentShelf = null;
let currentRow = null;

function updateCurrentLocationFromQR() {
  const params = new URLSearchParams(window.location.search);
  const loc = params.get("loc");

  if (!loc) {
    currentLocationText.textContent = "현재 위치: QR 코드를 스캔하면 표시됩니다.";
    return;
  }

  const [shelfStr, rowStr] = loc.split("-");
  const shelf = Number(shelfStr);
  const row = Number(rowStr);

  if (!shelf || !row || shelf < 1 || shelf > SHELF_COUNT || row < 1 || row > ROW_COUNT) {
    currentLocationText.textContent = "현재 위치: 알 수 없음 (QR 정보 오류)";
    return;
  }

  currentShelf = shelf;
  currentRow = row;
  currentLocationText.textContent = `현재 위치: ${shelf}번 선반, ${row}줄`;
}

// ===== 매장 지도 그리기 =====
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경
  ctx.fillStyle = "#f5f9ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 출입구 & 계산대 (대략적인 위치)
  ctx.fillStyle = "#ffe66d";
  ctx.fillRect(0, canvas.height - 40, canvas.width * 0.6, 30); // 아래 출입구
  ctx.fillRect(20, 80, 40, 180); // 왼쪽 계산대

  // 출입구 글자
  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText("입구", 25, canvas.height - 50);
  ctx.fillText("계산대", 24, 70);

  // 선반들
  ctx.fillStyle = "#bbbbbb";
  for (let s = 1; s <= SHELF_COUNT; s++) {
    for (let r = 1; r <= ROW_COUNT; r++) {
      const { x, y, shelfWidth, shelfHeight } = getShelfPosition(s, r);
      ctx.fillRect(x - shelfWidth / 2, y - shelfHeight / 2, shelfWidth, shelfHeight);
    }
  }

  // 현재 위치 (파란 점)
  if (currentShelf && currentRow) {
    const { x, y } = getShelfPosition(currentShelf, currentRow);
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#007bff";
    ctx.fill();
  }
}

// ===== 약품 검색 =====

// data.js 에서 medicines 배열을 가져온다고 가정
// 예시:
// const medicines = [
//   { name: "타이레놀 500mg", shelf: 3, row: 2, position: 1 },
//   ...
// ];

function searchMedicines(keyword) {
  keyword = keyword.trim();
  if (!keyword) return [];

  const lower = keyword.toLowerCase();
  return medicines.filter((m) => m.name.toLowerCase().includes(lower));
}

function renderAutocomplete(list) {
  autocompleteBox.innerHTML = "";
  if (!list.length) {
    autocompleteBox.style.display = "none";
    return;
  }

  list.forEach((item) => {
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    div.textContent = `${item.name} (선반 ${item.shelf}, 줄 ${item.row})`;
    div.addEventListener("click", () => {
      focusOnMedicine(item);
      autocompleteBox.innerHTML = "";
      autocompleteBox.style.display = "none";
      searchInput.value = item.name;
    });
    autocompleteBox.appendChild(div);
  });
  autocompleteBox.style.display = "block";
}

// 약 선택 시 해당 위치에 빨간 점 표시
let focusedMedicine = null;

function focusOnMedicine(med) {
  focusedMedicine = med;
  drawMap();

  const { x, y } = getShelfPosition(med.shelf, med.row);
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#ff3b3b";
  ctx.fill();
}

// 검색 입력 이벤트
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value;
  const res = searchMedicines(keyword);
  renderAutocomplete(res);
});

// ===== 초기 실행 =====
updateCurrentLocationFromQR();
drawMap();
