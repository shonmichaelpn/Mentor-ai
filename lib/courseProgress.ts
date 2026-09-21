export function getLatestUnlockedChapterIndex<T extends { id: number }>(
  chapters: T[],
  completedChapters: number[]
): number {
  if (chapters.length === 0) {
    return 0;
  }

  let lastUnlockedIndex = 0;

  for (let index = 0; index < chapters.length; index += 1) {
    const chapter = chapters[index];
    const previousChapter = chapters[index - 1];

    if (
      index === 0 ||
      completedChapters.includes(previousChapter.id)
    ) {
      lastUnlockedIndex = index;
    }
  }

  return lastUnlockedIndex;
}
