function convertSecondsToHoursMinutesSeconds(seconds: number) {
  const jam = Math.floor(seconds / 3600);
  const menit = Math.floor((seconds % 3600) / 60);
  const detik = Math.floor(seconds % 60);

  let result = "";

  if (jam) {
    result += `${jam.toString().padStart(2, "0")} jam `;
  }

  if (menit || jam) {
    result += `${menit.toString().padStart(2, "0")} menit `;
  }

  if (detik || menit || jam) {
    result += `${detik.toString().padStart(2, "0")} detik `;
  }

  return result.trim();
}

export { convertSecondsToHoursMinutesSeconds };
