function redoLineLength(translation: string, original: string) {
  const originalLines = original.split('\n');
  const translationLines = translation.split('\n');
  const translationWithoutBreaks = translationLines.join(' ');
  const originalLinesCount = originalLines.length;

  // split the translationLines sentence into originalLinesCount lines
  const words = translationWithoutBreaks.split(' ');
  const resultLines: string[] = Array(originalLinesCount).fill('');
  let resultLineIndex = 0;
  const sizeIncrease = translation.length / original.length;

  const targetLineLengths = originalLines.map((line) => line.length * sizeIncrease);
  for (const word of words) {
    resultLines[resultLineIndex] += word + ' ';
    if (resultLineIndex < originalLinesCount + 1 &&
      resultLines[resultLineIndex].length > targetLineLengths[resultLineIndex]
    ) {
      resultLineIndex++;
    }
  }

  return resultLines.map(x => x.trimEnd()).join('\n').trimEnd();
}

/**
 * If there are fewer line breaks in the translation than in the original, we should
 * add some back.
 * @param translation
 * @param original
 */
export const formatResult = (translation: string, original: string) => {
  const originalLines = original.split('\n');
  const translationLines = translation.split('\n');
  if (originalLines.length <= translationLines.length) {
    // this is fine
    return translation;
  }
  const translationWithoutBreaks = translationLines.join(' ');
  const numLinesStartingWithDash = originalLines.filter((line) => line.startsWith('-')).length;
  // if the original has more than one line that start with '-', we should format the translation similarly.
  if (numLinesStartingWithDash > 1) {
    // TODO: we could split based on '-', then put the result into redoLineLength
    return translationWithoutBreaks.replace(/ -/g, '\n-');
  }
  
  return redoLineLength(translation, original);
}
