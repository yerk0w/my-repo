const THEME_STORAGE_KEY = 'app_theme';

// Возможные значения темы
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

/**
 * Получает текущую тему из localStorage или определяет по предпочтениям системы
 * @returns {string} 'dark' или 'light'
 */
export const getCurrentTheme = () => {
  // Проверяем сохраненную тему
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Если тема не сохранена, определяем по предпочтениям системы
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDarkMode ? THEMES.DARK : THEMES.LIGHT;
};

/**
 * Применяет тему к документу
 * @param {string} theme 'dark' или 'light'
 */
export const applyTheme = (theme) => {
  if (theme === THEMES.DARK) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Сохраняем выбор в localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * Переключает текущую тему
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  applyTheme(newTheme);
  return newTheme;
};

/**
 * Инициализирует тему при загрузке приложения
 */
export const initTheme = () => {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
  return currentTheme;
};