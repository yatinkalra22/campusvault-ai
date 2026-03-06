// Maps item categories to Ionicons names and colors
import { theme } from './theme';

export const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  electronics: { icon: 'laptop-outline', color: '#5B8DEF', label: 'Electronics' },
  av_equipment: { icon: 'mic-outline', color: '#F06292', label: 'AV Equipment' },
  furniture: { icon: 'bed-outline', color: '#8D6E63', label: 'Furniture' },
  lab_equipment: { icon: 'flask-outline', color: '#4DB6AC', label: 'Lab Equipment' },
  tools: { icon: 'hammer-outline', color: '#FFB74D', label: 'Tools' },
  books: { icon: 'book-outline', color: '#9575CD', label: 'Books & Media' },
  sporting: { icon: 'football-outline', color: '#4CAF50', label: 'Sporting' },
  clothing: { icon: 'shirt-outline', color: '#E91E63', label: 'Clothing' },
  other: { icon: 'cube-outline', color: theme.colors.textMuted, label: 'Other' },
};

export function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.other;
}
