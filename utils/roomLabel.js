// "TwoInARoom" -> "2 in a room". Anything else is returned as it is.
const NUMBERS = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8 };

export default function roomLabel(roomType) {
  if (!roomType) return null;
  const match = String(roomType).match(/^(\w+?)InARoom$/);
  return match && NUMBERS[match[1]] ? `${NUMBERS[match[1]]} in a room` : String(roomType);
}
