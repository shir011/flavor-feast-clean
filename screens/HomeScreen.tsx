import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Recipe } from '../types';
import { useRecipeContext } from '../context/RecipeContext';
import { useFilterContext } from '../context/FilterContext';
import { useSortContext } from '../context/SortContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipes, toggleFavorite, isFavorite } = useRecipeContext();
  const { filters } = useFilterContext();
  const { sortOrder } = useSortContext();
  const [search, setSearch] = useState('');

  const applySort = (list: Recipe[]) => {
    return [...list].sort((a, b) => {
      if (sortOrder === 'Mas recientes') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortOrder === 'Mas antiguas') return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortOrder === 'Nombre A-Z') return a.title.localeCompare(b.title);
      if (sortOrder === 'Nombre Z-A') return b.title.localeCompare(a.title);
      return 0;
    });
  };

  const filtered = useMemo(() => {
    return recipes.filter((r: Recipe) => {
      const bySearch = r.title.toLowerCase().includes(search.toLowerCase());
      const byAuthor =
        !filters.user || r.author?.toLowerCase().includes(filters.user.toLowerCase());
      const byCategory =
        filters.categories.length === 0 || filters.categories.includes(r.category);
      const byInclude =
        filters.include.length === 0 ||
        filters.include.every((inc) =>
          r.ingredients?.some((i) =>
            i.name.toLowerCase().includes(inc.toLowerCase())
          )
        );
      const byExclude =
        filters.exclude.length === 0 ||
        filters.exclude.every((exc) =>
          !r.ingredients?.some((i) =>
            i.name.toLowerCase().includes(exc.toLowerCase())
          )
        );

      return bySearch && byAuthor && byCategory && byInclude && byExclude;
    });
  }, [recipes, filters, search]);

  const sorted = useMemo(() => applySort(filtered), [filtered, sortOrder]);
  const latestThree = useMemo(() => applySort([...recipes]).slice(0, 3), [recipes, sortOrder]);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
    >
      <Image source={item.image} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>Por: {item.author}</Text>
        
        <Text style={styles.rating}>{'⭐'.repeat(item.rating)}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.heartIcon}>
        <Ionicons
          name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite(item.id) ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header fijo */}
      <View style={styles.headerContainer}>
        <View style={styles.searchHeader}>
          <Ionicons name="restaurant" size={24} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Buscar recetas..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.subheading}>Más recientes</Text>
        <FlatList
          data={latestThree}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.latestCard}
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
            >
              <Image source={item.image} style={styles.latestImage} />
              <Text style={styles.latestTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />

        <View style={styles.filtersHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('SortOptions')}>
            <Text style={styles.orderText}>
              Ordenar por <Text style={styles.bold}>{sortOrder}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
            <Ionicons name="filter" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista con scroll vertical */}
      <FlatList
        style={styles.list}
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  latestCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  latestImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  latestTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  orderText: {
    fontSize: 14,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  list: {
    flex: 1, // ¡Muy importante para que ocupe el espacio restante!
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  recipeImage: { width: 100, height: 100 },
  recipeInfo: { flex: 1, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontWeight: 'bold' },
  author: { fontSize: 12, color: '#555' },
  time: { fontSize: 12, color: '#555' },
  rating: { color: '#f9a825', fontSize: 14, marginTop: 5 },
  heartIcon: { padding: 10 },
});

export default HomeScreen;
