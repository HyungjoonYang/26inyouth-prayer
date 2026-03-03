# feat: 기도카드 댓글 수 표시 뱃지

## 목표
기도카드에 댓글이 있을 때 💬 아이콘 + 댓글 수를 표시하여 댓글 존재를 알 수 있게 한다.

## 접근 방식
prayer 문서에 `commentCount` 필드를 비정규화(denormalize)하여, 별도 서브컬렉션 구독 없이 기존 `subscribeToPrayers`로 댓글 수를 가져온다.

## 변경 파일
1. **src/firebase.js** - `addComment`에서 `commentCount` increment 추가
2. **src/components/PrayerCard.jsx** - 💬 댓글 수 뱃지 UI 추가 (1개 이상일 때만)

## 서브태스크
1. `firebase.js`: `addComment` 함수에서 부모 prayer 문서의 `commentCount`를 `increment(1)` 처리
2. `PrayerCard.jsx`: 🤲 기도 버튼 왼쪽에 💬 + 숫자 뱃지 표시 (commentCount > 0일 때만)

## 리스크
- 기존 prayer 문서에는 `commentCount` 필드가 없음 → `|| 0` 으로 폴백 처리
- 댓글 삭제 기능이 없으므로 decrement는 불필요
