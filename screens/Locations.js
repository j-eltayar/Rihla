import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Platform, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAppData } from '../contexts/UserInfoContext';

const SWIPE_WIDTH = 150;

const SwipeableLocationItem = ({ item, onEdit, onDelete, onPress, openItemId, setOpenItemId, listColor }) => {
  const translateX = useSharedValue(0);
  const isOpenShared = useSharedValue(0);
  const didSwipe = useSharedValue(false);

  // Close this item when openItemId changes to something else or null
  React.useEffect(() => {
    if (openItemId !== item.id) {
      // Close this item
      translateX.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      isOpenShared.value = 0;
      didSwipe.value = false; // Reset didSwipe when closing
    }
  }, [openItemId, item.id]);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .activeOffsetX([-1, 10000])
    .shouldCancelWhenOutside(false)
    .onStart(() => {
      didSwipe.value = false;
    })
    .onUpdate((event) => {
      if (event.translationX < 0 || (event.translationX > 0 && isOpenShared.value === 1)) {
        didSwipe.value = true;
        const newTranslateX = event.translationX + (isOpenShared.value === 1 ? -SWIPE_WIDTH : 0);
        if (newTranslateX <= 0 && newTranslateX >= -SWIPE_WIDTH) {
          translateX.value = newTranslateX;
        } else if (newTranslateX > 0) {
          translateX.value = 0;
        }
      }
    })
    .onEnd((event) => {
      const shouldOpen = translateX.value < -SWIPE_WIDTH * 0.6;
      
      if (shouldOpen) {
        translateX.value = -SWIPE_WIDTH;
        isOpenShared.value = 1;
        runOnJS(setOpenItemId)(item.id);
      } else {
        translateX.value = 0;
        isOpenShared.value = 0;
        didSwipe.value = false; // Reset didSwipe when closing
        runOnJS(setOpenItemId)(null);
      }
    })
    .onFinalize((event) => {
      if (isOpenShared.value === 1) {
        translateX.value = withTiming(-SWIPE_WIDTH, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
      } else {
        translateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
      }
    });

  // Create a tap gesture to block page swipes completely when touching location item
  const blockingGesture = Gesture.Tap()
    .maxDuration(100000)
    .shouldCancelWhenOutside(false);

  // Combine gestures - the pan takes priority, but both block external gestures
  const combinedGesture = Gesture.Exclusive(panGesture, blockingGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { backgroundColor: listColor }]}
          onPress={() => {
            setOpenItemId(null);
            setTimeout(() => onEdit(item), 300);
          }}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            setOpenItemId(null);
            setTimeout(() => onDelete(item.id), 300);
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.locationItem, animatedStyle]}>
          <TouchableOpacity
            style={styles.locationItemContent}
            onPress={() => {
              if (didSwipe.value) {
                return;
              }
              
              if (openItemId === item.id) {
                setOpenItemId(null);
              } else {
                onPress(item);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.locationIconContainer, { backgroundColor: listColor }]}>
              <Ionicons name="location" size={24} color="#fff" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationAddress}>{item.address}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function Locations({ route, navigation }) {
  const { list } = route.params;
  const {
    getLocationsByListId,
    addLocation,
    updateLocation,
    deleteLocation,
  } = useAppData();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [newLocationName, setNewLocationName] = React.useState('');
  const [newLocationAddress, setNewLocationAddress] = React.useState('');
  const [editingLocation, setEditingLocation] = React.useState(null);
  const [editLocationName, setEditLocationName] = React.useState('');
  const [editLocationAddress, setEditLocationAddress] = React.useState('');
  const [openItemId, setOpenItemId] = React.useState(null);
  
  // Bottom sheet swipe gesture states
  const addSheetTranslateY = useSharedValue(0);
  const editSheetTranslateY = useSharedValue(0);
  
  // Get locations for this specific list
  const locations = getLocationsByListId(list.id);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeAllItems = React.useCallback(() => {
    setOpenItemId(null);
  }, []);

  const handleAddLocation = () => {
    if (newLocationName.trim() === '' || newLocationAddress.trim() === '') {
      Alert.alert('Error', 'Please enter both name and address');
      return;
    }

    addLocation(list.id, newLocationName, newLocationAddress);
    closeAddSheet();
  };
  
  // Close functions with slide animation
  const closeAddSheet = () => {
    addSheetTranslateY.value = withTiming(1000, { duration: 250 }, () => {
      runOnJS(setModalVisible)(false);
      runOnJS(setNewLocationName)('');
      runOnJS(setNewLocationAddress)('');
    });
  };
  
  const closeEditSheet = () => {
    editSheetTranslateY.value = withTiming(1000, { duration: 250 }, () => {
      runOnJS(setEditModalVisible)(false);
      runOnJS(setEditingLocation)(null);
      runOnJS(setEditLocationName)('');
      runOnJS(setEditLocationAddress)('');
    });
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setEditLocationName(location.name);
    setEditLocationAddress(location.address);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editLocationName.trim() === '' || editLocationAddress.trim() === '') {
      Alert.alert('Error', 'Please enter both name and address');
      return;
    }

    updateLocation(editingLocation.id, {
      name: editLocationName.trim(),
      address: editLocationAddress.trim(),
    });
    closeEditSheet();
  };

  const handleDeleteLocation = (locationId) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteLocation(locationId);
          }
        }
      ]
    );
  };

  // Add location sheet pan gesture
  const addSheetGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        addSheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        addSheetTranslateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(setModalVisible)(false);
          runOnJS(setNewLocationName)('');
          runOnJS(setNewLocationAddress)('');
        });
      } else {
        addSheetTranslateY.value = withTiming(0, { duration: 200 });
      }
    });

  // Edit location sheet pan gesture
  const editLocationSheetGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        editSheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        editSheetTranslateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(setEditModalVisible)(false);
          runOnJS(setEditingLocation)(null);
          runOnJS(setEditLocationName)('');
          runOnJS(setEditLocationAddress)('');
        });
      } else {
        editSheetTranslateY.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated styles
  const addSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: addSheetTranslateY.value }],
  }));

  const editSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: editSheetTranslateY.value }],
  }));

  // Animate sheet opening
  React.useEffect(() => {
    if (modalVisible) {
      addSheetTranslateY.value = 1000; // Start off-screen
      addSheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [modalVisible]);

  React.useEffect(() => {
    if (editModalVisible) {
      editSheetTranslateY.value = 1000; // Start off-screen
      editSheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [editModalVisible]);

  // Edge swipe gesture for going back
  const edgeSwipeX = useSharedValue(0);
  const SWIPE_THRESHOLD = 100;
  const EDGE_WIDTH = 50; // Only activate on left edge

  const edgeSwipeGesture = Gesture.Pan()
    .activeOffsetX([10, 10000])
    .onStart((event) => {
      // Only activate if starting from left edge
      if (event.x > EDGE_WIDTH) {
        return;
      }
      edgeSwipeX.value = 0;
    })
    .onUpdate((event) => {
      if (event.x <= EDGE_WIDTH || event.translationX > 0) {
        edgeSwipeX.value = Math.max(0, event.translationX);
      }
    })
    .onEnd((event) => {
      if (edgeSwipeX.value > SWIPE_THRESHOLD) {
        runOnJS(navigation.goBack)();
      }
      edgeSwipeX.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    });

  const renderLocationItem = ({ item }) => (
    <SwipeableLocationItem
      item={item}
      listColor={list.color}
      openItemId={openItemId}
      setOpenItemId={setOpenItemId}
      onEdit={(item) => {
        handleEditLocation(item);
      }}
      onDelete={(itemId) => {
        handleDeleteLocation(itemId);
      }}
      onPress={(item) => {
        closeAllItems();
        Alert.alert('Coming Soon', `Opening details for "${item.name}"`);
      }}
    />
  );

  return (
    <GestureDetector gesture={edgeSwipeGesture}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={[styles.headerIconContainer, { backgroundColor: list.color }]}>
              <Text style={styles.headerIcon}>{list.icon}</Text>
            </View>
            <Text style={styles.headerTitle}>{list.name}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={28} color={list.color} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
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

        {/* Locations List */}
        <FlatList
          data={filteredLocations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onScroll={closeAllItems}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No locations found</Text>
              <Text style={styles.emptySubtext}>Add your first location to this list</Text>
            </View>
          }
        />

        {/* Add Location Bottom Sheet */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeAddSheet}
        >
          <TouchableOpacity 
            style={styles.bottomSheetOverlay} 
            activeOpacity={1}
            onPress={closeAddSheet}
          >
            <GestureDetector gesture={addSheetGesture}>
              <Animated.View style={[styles.bottomSheetContent, addSheetAnimatedStyle]}>
                <View style={styles.bottomSheetHandle} />
                
                <Text style={styles.modalTitle}>Add Location</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Location name"
                  value={newLocationName}
                  onChangeText={setNewLocationName}
                  maxLength={100}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={newLocationAddress}
                  onChangeText={setNewLocationAddress}
                  maxLength={200}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={closeAddSheet}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.createButton, { backgroundColor: list.color }]}
                    onPress={handleAddLocation}
                  >
                    <Text style={styles.createButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </GestureDetector>
          </TouchableOpacity>
        </Modal>

        {/* Edit Location Bottom Sheet */}
        <Modal
          animationType="none"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={closeEditSheet}
        >
          <TouchableOpacity 
            style={styles.bottomSheetOverlay} 
            activeOpacity={1}
            onPress={closeEditSheet}
          >
            <GestureDetector gesture={editLocationSheetGesture}>
              <Animated.View style={[styles.bottomSheetContent, editSheetAnimatedStyle]}>
                <View style={styles.bottomSheetHandle} />
                
                <Text style={styles.modalTitle}>Edit Location</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Location name"
                  value={editLocationName}
                  onChangeText={setEditLocationName}
                  maxLength={100}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={editLocationAddress}
                  onChangeText={setEditLocationAddress}
                  maxLength={200}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={closeEditSheet}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.createButton, { backgroundColor: list.color }]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.createButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </GestureDetector>
          </TouchableOpacity>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  swipeContainer: {
    marginVertical: 4,
    height: 90,
    position: 'relative',
    overflow: 'visible',
    borderRadius: 12,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  editButton: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  locationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  locationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationIcon: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#A2C0B0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});
