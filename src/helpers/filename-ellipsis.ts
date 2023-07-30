const ellipsisInTheMiddle = (words: string) => {
  if (words.length > 15) {
    return (
      words.substring(0, 7) +
      "..." +
      words.substring(words.length - 3, words.length)
    );
  }
  return words;
};

const fileNameEllipsis = (filename: string) => {
  const splittedFileName = filename.split(".");

  return `${ellipsisInTheMiddle(splittedFileName[0])}.${splittedFileName[1]}`;
};

export default fileNameEllipsis;
