// src/lib/bookmarks.js
const STORAGE_KEY = "recipeBookmarks";

const read = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return [];
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing bookmarks:", error);
  }
};

export const getBookmarks = () => read();

export const addBookmark = (recipeId) => {
  const bookmarks = read();
  if (!bookmarks.includes(String(recipeId))) {
    write([...bookmarks, String(recipeId)]);
    return true;
  }
  return false;
};

export const removeBookmark = (recipeId) => {
  const bookmarks = read();
  write(bookmarks.filter((id) => id !== String(recipeId)));
  return true;
};

export const isBookmarked = (recipeId) => {
  return read().includes(String(recipeId));
};

export const toggleBookmark = (recipeId) => {
  if (isBookmarked(recipeId)) {
    removeBookmark(recipeId);
    return false;
  } else {
    addBookmark(recipeId);
    return true;
  }
};

export const getBookmarkedCount = () => {
  return read().length;
};