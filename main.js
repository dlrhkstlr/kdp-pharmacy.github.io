// 샘플 약품 데이터 (추후 Google Sheets로 교체)
const items = [
    { name: "타이레놀", shelf: 7, level: 2 },
    { name: "판콜에스", shelf: 3, level: 1 },
    { name: "베아제", shelf: 5, level: 3 }
];

// 페이지 로드 시 현재 위치 표시
const currentLocText = document.getElementById("current-loc");
const currentLoc = getCurrentLocation();

if (currentLoc) {
    currentLocText.innerText = `현재 위치: ${currentLoc}번 선반`;
} else {
    currentLocText.innerText = "현재 위치: (QR 코드를 스캔해주세요)";
}

// 검색 자동완성
const input = document.getElementById("search-input");
const auto = document.getElementById("autocomplete");

input.addEventListener("input", () => {
    const val = input.value.trim();
    auto.innerHTML = "";

    if (val === "") {
        auto.style.display = "none";
        return;
    }

    const filtered = items.filter(x => x.name.includes(val));

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("autocomplete-item");
        div.innerText = item.name;
        div.onclick = () => showResult(item);
        auto.appendChild(div);
    });

    auto.style.display = "block";
});

// 검색 결과 표시
function showResult(item) {
    document.getElementById("result-section").innerHTML = `
        <h2>${item.name}</h2>
        <p>위치: ${item.shelf}번 선반 / ${shelfLevels[item.level - 1]}</p>
    `;
    drawPath(item.shelf);
}

// 지도에 경로 표시
function drawPath(targetShelf) {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 지도 배경
    const img = new Image();
    img.src = "images/map.png";
    img.onload = () => {
        ctx.drawImage(img, 0, 0, 360, 480);

        if (currentLoc && shelves[currentLoc]) {
            const cur = shelves[currentLoc];
            const tar = shelves[targetShelf];

            // 현재 위치
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(cur.x, cur.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // 목표 위치
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(tar.x, tar.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // 경로선
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cur.x, cur.y);
            ctx.lineTo(tar.x, tar.y);
            ctx.stroke();
        }
    };
}
