/**
 * Calendar constants: month configuration, holidays, and color themes.
 * All dates are for 2026 (current year).
 */

// 12 unique Unsplash hero images — one per month
export const MONTH_CONFIG = [
  {
    month: 'January',
    short: 'JAN',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageAlt: 'Snowy mountain peaks in winter',
    accent: '#0EA5E9',
  },
  {
    month: 'February',
    short: 'FEB',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
    imageAlt: 'Pink cherry blossoms in spring',
    accent: '#0EA5E9',
  },
  {
    month: 'March',
    short: 'MAR',
    image: 'https://images.unsplash.com/photo-1463003416389-296a1ad37ca0?w=800&q=80',
    imageAlt: 'Blooming flower fields at sunrise',
    accent: '#0EA5E9',
  },
  {
    month: 'April',
    short: 'APR',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    imageAlt: 'Lush green forest with sunlight filtering through',
    accent: '#0EA5E9',
  },
  {
    month: 'May',
    short: 'MAY',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    imageAlt: 'Sunlit forest path in spring',
    accent: '#0EA5E9',
  },
  {
    month: 'June',
    short: 'JUN',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    imageAlt: 'Tropical beach with turquoise water',
    accent: '#0EA5E9',
  },
  {
    month: 'July',
    short: 'JUL',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    imageAlt: 'Aerial view of green mountain valleys',
    accent: '#0EA5E9',
  },
  {
    month: 'August',
    short: 'AUG',
    image: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800&q=80',
    imageAlt: 'Rolling hills at golden hour',
    accent: '#0EA5E9',
  },
  {
    month: 'September',
    short: 'SEP',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    imageAlt: 'City skyline at sunset with golden light',
    accent: '#0EA5E9',
  },
  {
    month: 'October',
    short: 'OCT',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
    imageAlt: 'Autumn foliage in vibrant orange and red',
    accent: '#0EA5E9',
  },
  {
    month: 'November',
    short: 'NOV',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80',
    imageAlt: 'Tall pine forest in morning mist',
    accent: '#0EA5E9',
  },
  {
    month: 'December',
    short: 'DEC',
    image: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
    imageAlt: 'Snow-covered landscape with pine trees',
    accent: '#0EA5E9',
  },
];

/**
 * Indian public holidays for 2026 with approximate dates.
 * Key format: "YYYY-MM-DD"
 */
export const HOLIDAYS = {
  '2026-01-01': { name: "New Year's Day", color: '#f59e0b', emoji: '🎆' },
  '2026-01-26': { name: 'Republic Day', color: '#f97316', emoji: '🇮🇳' },
  '2026-03-20': { name: 'Holi', color: '#ec4899', emoji: '🎨' },
  '2026-03-29': { name: 'Good Friday', color: '#8b5cf6', emoji: '✝️' },
  '2026-04-14': { name: 'Dr. Ambedkar Jayanti', color: '#3b82f6', emoji: '⚖️' },
  '2026-05-01': { name: 'Labour Day', color: '#10b981', emoji: '🔨' },
  '2026-06-07': { name: 'Eid ul-Adha', color: '#10b981', emoji: '🌙' },
  '2026-07-29': { name: 'Muharram', color: '#6366f1', emoji: '🌙' },
  '2026-08-15': { name: 'Independence Day', color: '#f97316', emoji: '🇮🇳' },
  '2026-10-02': { name: 'Gandhi Jayanti', color: '#10b981', emoji: '🕊️' },
  '2026-10-20': { name: 'Dussehra', color: '#f59e0b', emoji: '🏹' },
  '2026-11-08': { name: 'Guru Nanak Jayanti', color: '#f97316', emoji: '🙏' },
  '2026-11-14': { name: "Children's Day", color: '#ec4899', emoji: '🎈' },
  '2026-11-18': { name: 'Diwali', color: '#f59e0b', emoji: '🪔' },
  '2026-12-25': { name: 'Christmas', color: '#10b981', emoji: '🎄' },
  '2026-12-31': { name: "New Year's Eve", color: '#8b5cf6', emoji: '🥂' },
};

export const WEEKDAY_LABELS = ['Wk', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'auto', label: 'Auto', icon: '💻' },
];
