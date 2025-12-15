import React from 'react';
import { StyleSheet, View, Platform, TextInput, TouchableOpacity, ScrollView, Text, FlatList, Dimensions, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAppData } from '../contexts/UserInfoContext';
import { customMapStyle } from '../constants/mapStyle';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 10;
const CARD_SPACING = 12;
const TAB_BAR_HEIGHT = 85;
const SHEET_HEIGHT = 240;
const COLLAPSED_HEIGHT = 80;

export default function Landing({ route, navigation }) {
  const { lists, locations: allLocations } = useAppData();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLists, setSelectedLists] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState(null);
  const [sheetExpanded, setSheetExpanded] = React.useState(false);
  const mapRef = React.useRef(null);
  const markerRefs = React.useRef({});
  const [mapRegion, setMapRegion] = React.useState(null);
  
  const translateY = useSharedValue(0);
  const sheetHeight = useSharedValue(80);
  
  // Show callout when marker is selected
  React.useEffect(() => {
    if (selectedLocationId && markerRefs.current[selectedLocationId]) {
      setTimeout(() => {
        markerRefs.current[selectedLocationId]?.showCallout();
      }, 150);
    }
  }, [selectedLocationId]);
  
  const toggleList = (listId) => {
    setSelectedLists(prev => 
      prev.includes(listId) 
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };
  
  // Memoize filtered locations to prevent unnecessary recalculations
  const filteredLocations = React.useMemo(() => {
    if (!allLocations || !Array.isArray(allLocations)) {
      return [];
    }
    
    const filtered = allLocations.filter(location => {
      // Validate coordinates first - prevent any location with invalid coordinates
      const hasValidCoordinates = 
        location.lat != null && 
        location.lng != null && 
        typeof location.lat === 'number' &&
        typeof location.lng === 'number' &&
        !isNaN(location.lat) && 
        !isNaN(location.lng);
      
      const matchesSearch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesList = selectedLists.length === 0 || 
        selectedLists.includes(location.listId);
      
      return hasValidCoordinates && matchesSearch && matchesList;
    });
    
    return filtered;
  }, [allLocations, searchQuery, selectedLists]);

  // Create a stable markers array that updates safely
  const [renderedMarkers, setRenderedMarkers] = React.useState([]);
  const [markersVersion, setMarkersVersion] = React.useState(0);
  const prevMarkerIds = React.useRef('');
  
  React.useEffect(() => {
    // Build markers array - filteredLocations is already validated
    const markers = filteredLocations
      .map(location => {
        const list = lists.find(l => l.id === location.listId);
        
        // If list doesn't exist, skip this marker
        if (!list) {
          console.warn(`Location "${location.name}" has invalid listId: ${location.listId}`);
          return null;
        }
        
        return {
          id: location.id,
          listId: location.listId,
          lat: location.lat,
          lng: location.lng,
          name: location.name,
          listName: list.name,
          listIcon: list.icon,
          color: list.color || '#A2C0B0'
        };
      })
      .filter(marker => marker !== null); // Remove any null entries
    
    console.log('Updating markers:', markers.length, 'markers from', filteredLocations.length, 'filtered locations');
    
    // Check if marker IDs actually changed
    const currentMarkerIds = markers.map(m => m.id).sort().join(',');
    if (currentMarkerIds !== prevMarkerIds.current) {
      prevMarkerIds.current = currentMarkerIds;
      setRenderedMarkers(markers);
      // Increment version to force marker re-render
      setMarkersVersion(v => v + 1);
    } else {
      // Just update the data without changing version
      setRenderedMarkers(markers);
    }
  }, [filteredLocations, lists]);

  // Filter markers that are visible in the current map viewport for carousel
  const visibleCarouselMarkers = React.useMemo(() => {
    if (!mapRegion) {
      return renderedMarkers;
    }
    
    return renderedMarkers.filter(marker => {
      const latInBounds = 
        marker.lat >= (mapRegion.latitude - mapRegion.latitudeDelta / 2) &&
        marker.lat <= (mapRegion.latitude + mapRegion.latitudeDelta / 2);
      const lngInBounds = 
        marker.lng >= (mapRegion.longitude - mapRegion.longitudeDelta / 2) &&
        marker.lng <= (mapRegion.longitude + mapRegion.longitudeDelta / 2);
      
      return latInBounds && lngInBounds;
    });
  }, [renderedMarkers, mapRegion]);

  // Function to navigate map to a specific location
  const navigateToLocation = (location) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
    setSelectedLocationId(location.id);
    setSearchQuery('');
    setShowSearchResults(false);
    setShowFilters(false);
    if (sheetExpanded) {
      sheetHeight.value = withSpring(80);
      setSheetExpanded(false);
    }
  };

  // Bottom sheet gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Dragging up (negative) expands, dragging down (positive) collapses
      const newHeight = 80 - event.translationY;
      if (newHeight >= 80 && newHeight <= SHEET_HEIGHT) {
        sheetHeight.value = newHeight;
      }
    })
    .onEnd((event) => {
      const finalHeight = 80 - event.translationY;
      const midpoint = (80 + SHEET_HEIGHT) / 2;
      
      // If dragged more than halfway or with velocity, snap to that state
      if (finalHeight > midpoint || event.velocityY < -500) {
        sheetHeight.value = withSpring(SHEET_HEIGHT);
        runOnJS(setSheetExpanded)(true);
      } else {
        sheetHeight.value = withSpring(80);
        runOnJS(setSheetExpanded)(false);
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      height: sheetHeight.value,
    };
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="standard"
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        onPress={() => {
          setSelectedLocationId(null);
          setShowFilters(false);
          if (sheetExpanded) {
            sheetHeight.value = withSpring(80);
            setSheetExpanded(false);
          }
        }}
        initialRegion={{
          latitude: 45.5017,
          longitude: -73.5673,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {renderedMarkers.map((marker) => {
          const isSelected = marker.id === selectedLocationId;
          return (
            <Marker
              key={`marker-${marker.id}`}
              ref={(ref) => (markerRefs.current[marker.id] = ref)}
              coordinate={{ 
                latitude: marker.lat, 
                longitude: marker.lng 
              }}
              title={marker.name}
              description={marker.listName}
              tracksViewChanges={true}
              onPress={(e) => {
                e.stopPropagation();
                console.log('Marker pressed:', marker.name, marker.id);
                // Zoom to the marker location
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    latitude: marker.lat,
                    longitude: marker.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }, 1000);
                }
                setSelectedLocationId(marker.id);
                setShowFilters(false);
                if (sheetExpanded) {
                  sheetHeight.value = withSpring(80);
                  setSheetExpanded(false);
                }
              }}
            >
              <View style={[
                styles.customMarker,
                isSelected && styles.customMarkerSelected
              ]}>
                {/* Black outline layer */}
                <Ionicons 
                  name="location" 
                  size={isSelected ? 50 : 42} 
                  color="#000" 
                  style={[styles.markerIconOutline, { position: 'absolute' }]}
                />
                {/* Colored icon on top */}
                <Ionicons 
                  name="location" 
                  size={isSelected ? 50 : 42} 
                  color={marker.color} 
                />
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
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSearchResults(text.length > 0);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) {
                setShowSearchResults(true);
              }
              setShowFilters(false);
              if (sheetExpanded) {
                sheetHeight.value = withSpring(80);
                setSheetExpanded(false);
              }
            }}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearchResults(false);
              setShowFilters(false);
            }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.length > 0 && filteredLocations.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <ScrollView 
              style={styles.searchResults}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {filteredLocations.map((location) => {
                const list = lists.find(l => l.id === location.listId);
                if (!list) return null;
                
                return (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.searchResultItem}
                    onPress={() => navigateToLocation(location)}
                  >
                    <View style={styles.searchResultContent}>
                      <Ionicons 
                        name="location" 
                        size={20} 
                        color={list.color} 
                      />
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultName}>{location.name}</Text>
                        <Text style={styles.searchResultList}>{list.icon} {list.name}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
      
      {/* Filter Dropdown Button */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            setShowFilters(!showFilters);
            if (sheetExpanded && !showFilters) {
              sheetHeight.value = withSpring(80);
              setSheetExpanded(false);
            }
          }}
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
        {showFilters && lists && lists.length > 0 && (
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
      
      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={async () => {
            if (mapRef.current) {
              const region = await mapRef.current.getCamera();
              mapRef.current.animateToRegion({
                latitude: region.center.latitude,
                longitude: region.center.longitude,
                latitudeDelta: (mapRegion?.latitudeDelta || 0.0922) / 2,
                longitudeDelta: (mapRegion?.longitudeDelta || 0.0421) / 2,
              }, 300);
            }
          }}
        >
          <Ionicons name="add" size={24} color="#A2C0B0" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={async () => {
            if (mapRef.current) {
              const region = await mapRef.current.getCamera();
              mapRef.current.animateToRegion({
                latitude: region.center.latitude,
                longitude: region.center.longitude,
                latitudeDelta: (mapRegion?.latitudeDelta || 0.0922) * 2,
                longitudeDelta: (mapRegion?.longitudeDelta || 0.0421) * 2,
              }, 300);
            }
          }}
        >
          <Ionicons name="remove" size={24} color="#A2C0B0" />
        </TouchableOpacity>
      </View>
      
      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={async () => {
          try {
            // Import expo-location dynamically
            const Location = await import('expo-location');
            
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              alert('Permission to access location was denied');
              return;
            }
            
            // Get current location
            const location = await Location.getCurrentPositionAsync({});
            
            // Animate to user's location
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }
          } catch (error) {
            console.error('Error getting location:', error);
            alert('Could not get your current location');
          }
        }}
      >
        <Ionicons name="locate" size={24} color="#A2C0B0" />
      </TouchableOpacity>
      
      {/* Bottom Sheet for Locations */}
      {visibleCarouselMarkers.length > 0 && (
        <GestureDetector gesture={panGesture}>
          <Animated.View 
            style={[styles.bottomSheet, animatedSheetStyle]}
          >
            <View style={styles.sheetHandle} />
            
            <TouchableOpacity 
              style={styles.sheetHeaderBar}
              onPress={() => {
                if (sheetExpanded) {
                  sheetHeight.value = withSpring(80);
                  setSheetExpanded(false);
                } else {
                  sheetHeight.value = withSpring(SHEET_HEIGHT);
                  setSheetExpanded(true);
                }
                setShowFilters(false);
              }}
            >
              <Text style={styles.sheetTitle}>
                {visibleCarouselMarkers.length} {visibleCarouselMarkers.length === 1 ? 'Location' : 'Locations'} Nearby
              </Text>
              <Ionicons 
                name={sheetExpanded ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#A2C0B0" 
              />
            </TouchableOpacity>
            
            <View style={styles.carouselContainer}>
              <FlatList
                data={visibleCarouselMarkers}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sheetCarousel}
                keyExtractor={(item) => item.id}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                snapToAlignment="start"
                contentInset={{ left: (width - CARD_WIDTH) / 2, right: (width - CARD_WIDTH) / 2 }}
                contentOffset={{ x: -(width - CARD_WIDTH) / 2, y: 0 }}
                renderItem={({ item }) => (
                  <View style={[styles.carouselCard, { borderLeftColor: item.color }]}>
                    <TouchableOpacity
                      style={styles.carouselCardMainContent}
                      onPress={() => {
                        // Navigate to location on map
                        if (mapRef.current) {
                          mapRef.current.animateToRegion({
                            latitude: item.lat,
                            longitude: item.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          }, 1000);
                        }
                        setSelectedLocationId(item.id);
                        // Collapse the sheet
                        sheetHeight.value = withSpring(80);
                        setSheetExpanded(false);
                        setShowFilters(false);
                      }}
                    >
                      <View style={styles.carouselCardHeader}>
                        <Ionicons 
                          name="location" 
                          size={28} 
                          color={item.color} 
                        />
                        <Text style={styles.carouselCardName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.carouselCardDivider} />
                    
                    <TouchableOpacity 
                      style={styles.carouselCardFooter}
                      onPress={() => {
                        const list = lists.find(l => l.id === item.listId);
                        if (list) {
                          navigation.navigate('List', {
                            screen: 'Locations',
                            params: { list: list }
                          });
                        }
                      }}
                    >
                      <Text style={styles.listEmoji}>{item.listIcon}</Text>
                      <Text style={[styles.carouselCardListLink, { color: item.color }]}>{item.listName}</Text>
                      <Ionicons name="arrow-forward" size={14} color={item.color} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Animated.View>
        </GestureDetector>
      )}
      
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
    zIndex: 1000,
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
  searchResultsContainer: {
    marginTop: 8,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  searchResults: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  searchResultList: {
    fontSize: 14,
    color: '#666',
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
    overflow: 'visible',
    padding: 10,
  },
  markerIconOutline: {
    opacity: 0.8,
  },
  customMarkerSelected: {
    transform: [{ scale: 1.3 }],
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    gap: 10,
  },
  zoomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myLocationButton: {
    position: 'absolute',
    right: 20,
    bottom: 220,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myLocationButtonWithCarousel: {
    bottom: 130,
  },
  myLocationButtonNoCarousel: {
    bottom: 30,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fffffA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    minHeight: 80,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  carouselContainer: {
    flex: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  sheetCarousel: {
    paddingVertical: 20,
    gap: CARD_SPACING,
  },
  carouselCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 16,
    marginRight: CARD_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    minHeight: 140,
  },
  carouselCardMainContent: {
    position: 'relative',
  },
  carouselCardHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  carouselCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
  },
  carouselCardDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  carouselCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  carouselCardList: {
    fontSize: 13,
    color: '#5A6C7D',
    fontWeight: '500',
  },
  carouselCardListLink: {
    fontSize: 13,
    color: '#A2C0B0',
    fontWeight: '600',
    flex: 1,
  },
  listEmoji: {
    fontSize: 16,
  },
  carouselCardArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  sheetList: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  locationCardText: {
    flex: 1,
  },
  locationCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  locationCardList: {
    fontSize: 14,
    color: '#5A6C7D',
  },
});
