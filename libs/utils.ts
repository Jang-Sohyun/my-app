/* 공용 유틸 함수 모음 */

// 정수로 입력받은 수를 규칙에 맞게 Formatting하여 리턴한다.
// - 10,000 이하는 그대로 표시한다.
// - 10,000 이상은 소숫점 한자리까지 자른 후 표시한다.
export const formatCount = (count: number): string => {
  if (count < 10000) return String(count);

  const printCount = count / 10000;

  return printCount.toFixed(1) + '만';
};

// 본문 전체 string을 size만큼으로 줄이고
// 뒤에 말줄임표를 붙인 문자열을 리턴한다.
export const formatDescriptionSummary = (text: string, size: number) =>
  text.substring(0, size) + (text.length > size ? '…' : '');
