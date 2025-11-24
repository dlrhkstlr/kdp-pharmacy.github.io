// main.js - 지도만 먼저 확실하게 그리는 단순 버전

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  const currentLocationText = document.getElementById("current-location");

  const STORE_WIDTH = canvas.width;
  const STORE_HEIGHT = canvas.height;

  const SHELF_COUNT = 10;  // 선반 1~10번
  const ROW_COUNT = 4;     // 줄 1~4

  let currentShelf = null;
  let currentRow = null;

  // ===== QR 파라미터에서 현재 위치 읽기 =====
  function updateCurrentLocationFromQR() {
    const params = new URLSearchParams(window.location.search);
    const loc = params.get("loc");

    if (!loc) {
      currentShelf = null;
      currentRow = null;
      currentLocationText.textContent =
        "현재 위치: QR 코드를 스캔하면 표시됩니다.";
      return;
    }

    const [shelfStr, rowStr] = loc.split("-");
    const shelf = Number(shelfStr);
    const row = Number(rowStr);

    if (!shelf || !row || shelf < 1 || shelf > SHELF_COUNT || row < 1 || row > ROW_COUNT) {
      currentShelf = null;
      currentRow = null;
      currentLocationText.textContent = "현재 위치: 알 수 없음 (QR 정보 오류)";
      return;
    }

    currentShelf = shelf;
    currentRow = row;
    currentLocationText.textContent = `현재 위치: ${shelf}번 선반, ${row}줄`;
  }

  // ===== 선반 좌표 계산 =====
  function getShelfPosition(shelf, row) {
    const marginX = 40;
    const marginY = 90;

    const shelfWidth = 18;    // 선반 두께
    const shelfHeight = 55;   // 줄 높이
    const gapX =
      (STORE_WIDTH - marginX * 2 - shelfWidth * SHELF_COUNT) /
      (SHELF_COUNT - 1);
    const gapY = 20;

    const x = marginX + (shelf - 1) * (shelfWidth + gapX) + shelfWidth / 2;
    const y = marginY + (row - 1) * (shelfHeight + gapY) + shelfHeight / 2;

    return { x, y, shelfWidth, shelfHeight };
  }

  // ===== 지도 그리기 =====
  function drawMap() {
    // 배경
    ctx.clearRect(0, 0, STORE_WIDTH, STORE_HEIGHT);
    ctx.fillStyle = "#f5f5ff";
    ctx.fillRect(0, 0, STORE_WIDTH, STORE_HEIGHT);

    // 매장 테두리
    ctx.strokeStyle = "#144a9e";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, STORE_WIDTH - 20, STORE_HEIGHT - 20);

    // 계산대 (왼쪽)
    ctx.fillStyle = "#ffe066";
    ctx.fillRect(25, 100, 50, 200);
    ctx.fillStyle = "#333";
    ctx.font = "14px sans-serif";
    ctx.fillText("계산대", 30, 90);

    // 입구 (위, 아래)
    ctx.fillStyle = "#ffe066";
    ctx.fillRect(STORE_WIDTH - 150, 20, 120, 30); // 위쪽 입구
    ctx.fillRect(
      STORE_WIDTH / 2 - 120,
      STORE_HEIGHT - 50,
      240,
      30
    ); // 아래 입구

    ctx.fillStyle = "#333";
    ctx.font = "14px sans-serif";
    ctx.fillText("입구", STORE_WIDTH - 115, 42);
    ctx.fillText("입구", STORE_WIDTH / 2 - 15, STORE_HEIGHT - 30);

    // 선반들 (회색 막대)
    ctx.fillStyle = "#bbbbbb";
    for (let s = 1; s <= SHELF_COUNT; s++) {
      for (let r = 1; r <= ROW_COUNT; r++) {
        const { x, y, shelfWidth, shelfHeight } = getShelfPosition(s, r);
        ctx.fillRect(
          x - shelfWidth / 2,
          y - shelfHeight / 2,
          shelfWidth,
          shelfHeight
        );
      }
    }

    // 선반 번호 표시 (아래쪽)
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    for (let s = 1; s <= SHELF_COUNT; s++) {
      const { x } = getShelfPosition(s, ROW_COUNT);
      ctx.fillText(`${s}번`, x - 10, STORE_HEIGHT - 20);
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

  // ===== 초기 실행 =====
  updateCurrentLocationFromQR();
  drawMap();
});
