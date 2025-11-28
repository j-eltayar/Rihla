import React from 'react';
import { StyleSheet, View, Platform, TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../contexts/UserInfoContext';
import { customMapStyle } from '../constants/mapStyle';

export default function Landing({ route }) {
  const { lists, locations: allLocations } = useAppData();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLists, setSelectedLists] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(false);
  
  const toggleList = (listId) => {
    setSelectedLists(prev => 
      prev.includes(listId) 
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };
  
  const filteredLocations = allLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesList = selectedLists.length === 0 || selectedLists.includes(location.listId);
    return matchesSearch && matchesList;
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="standard"
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 45.5017,
          longitude: -73.5673,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {filteredLocations.map(location => {
          const list = lists.find(l => l.id === location.listId);
          return (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.lat, longitude: location.lng }}
              title={location.name}
              description={list?.name || ''}
            >
              <View style={styles.customMarker}>
                <Ionicons name="location" size={32} color={list?.color || '#A2C0B0'} />
              </View>
            </Marker>
          );
        })}
      </MapView>
      
      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter Dropdown Button */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="list-outline" size={20} color="#fff" style={styles.filterIcon} />
          <Text style={styles.filterButtonText}>
            {selectedLists.length > 0 ? `Lists (${selectedLists.length})` : 'My Lists'}
          </Text>
          <Ionicons 
            name={showFilters ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        {/* Dropdown Filter Options */}
        {showFilters && (
          <View style={styles.filterDropdown}>
            {lists.map(list => (
              <TouchableOpacity
                key={list.id}
                style={[
                  styles.filterOption,
                  selectedLists.includes(list.id) && styles.filterOptionActive
                ]}
                onPress={() => toggleList(list.id)}
              >
                <View style={styles.listOptionContent}>
                  <View style={[styles.listColorDot, { backgroundColor: list.color }]} />
                  <Text style={[
                    styles.filterOptionText,
                    selectedLists.includes(list.id) && styles.filterOptionTextActive
                  ]}>
                    {list.icon} {list.name}
                  </Text>
                </View>
                {selectedLists.includes(list.id) && (
                  <Ionicons name="checkmark" size={20} color={list.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A2C0B0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  filterDropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterOptionActive: {
    backgroundColor: '#f0f8f5',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  filterOptionTextActive: {
    fontWeight: '600',
  },
  listOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
