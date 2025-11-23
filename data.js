// C 타입 선반 배치
// 1  2  3
// 4  5  6
// 7  8  9
//    10

const shelves = {
    1: { x: 50, y: 50 },
    2: { x: 180, y: 50 },
    3: { x: 310, y: 50 },

    4: { x: 50,  y: 160 },
    5: { x: 180, y: 160 },
    6: { x: 310, y: 160 },

    7: { x: 50,  y: 270 },
    8: { x: 180, y: 270 },
    9: { x: 310, y: 270 },

    10: { x: 180, y: 380 }
};

// 선반 4단 구조
const shelfLevels = ["1단 (상단)", "2단", "3단", "4단 (하단)"];

// 화면에서 현재 위치 URL로 받아오기
function getCurrentLocation() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("loc");
}
