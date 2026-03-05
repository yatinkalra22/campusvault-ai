import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import api from '@/services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<'nl' | 'semantic'>('nl');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get('/search', { params: { q: query, mode } });
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Search Inventory</Text>
      <Text style={styles.subtitle}>Find items using natural language or voice</Text>

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="e.g. 'find a camera in Media Lab'"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeChip, mode === 'nl' && styles.modeActive]}
          onPress={() => setMode('nl')}
        >
          <Text style={[styles.modeText, mode === 'nl' && styles.modeTextActive]}>Smart Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeChip, mode === 'semantic' && styles.modeActive]}
          onPress={() => setMode('semantic')}
        >
          <Text style={[styles.modeText, mode === 'semantic' && styles.modeTextActive]}>Semantic</Text>
        </TouchableOpacity>
      </View>

      {/* Voice search placeholder */}
      <TouchableOpacity style={styles.voiceBtn}>
        <Ionicons name="mic-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.voiceText}>Voice Search (coming soon)</Text>
      </TouchableOpacity>

      {/* Results */}
      {searching ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 32 }} />
      ) : results.length > 0 ? (
        <View style={styles.results}>
          <Text style={styles.resultCount}>{results.length} results found</Text>
          {results.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => router.push(`/item/${item.id}`)}>
              <Card style={styles.resultCard}>
                <View style={styles.resultRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.brandName && <Text style={styles.itemBrand}>{item.brandName}</Text>}
                    <Text style={styles.itemLocation}>{item.placeName ?? item.category}</Text>
                  </View>
                  <Badge label={item.status} status={item.status} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ) : query && !searching ? (
        <Text style={styles.noResults}>No results found. Try a different query.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.fontSize.md, marginBottom: 20 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  searchBtn: {
    backgroundColor: theme.colors.primary, width: 48, height: 48,
    borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center',
  },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 16 },
  modeChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceAlt,
  },
  modeActive: { backgroundColor: theme.colors.primary },
  modeText: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, fontWeight: '600' },
  modeTextActive: { color: '#fff' },
  voiceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 14, borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed',
    marginBottom: 20,
  },
  voiceText: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  results: { gap: 8 },
  resultCount: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginBottom: 8 },
  resultCard: { marginBottom: 4 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemName: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  itemBrand: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  itemLocation: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs, marginTop: 2 },
  noResults: { color: theme.colors.textMuted, textAlign: 'center', marginTop: 32, fontSize: theme.fontSize.md },
});
