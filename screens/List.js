import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, runOnUI, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAppData } from '../contexts/UserInfoContext';

const SWIPE_WIDTH = 150;

const SwipeableListItem = ({ item, onEdit, onDelete, onPress, openItemId, setOpenItemId }) => {
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

  // Create a tap gesture to block page swipes completely when touching list item
  const blockingGesture = Gesture.Tap()
    .maxDuration(100000) // Very long duration to capture the entire touch
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
          style={[styles.actionButton, styles.editButton]}
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
        <Animated.View style={[styles.listItem, animatedStyle]}>
          <TouchableOpacity 
            style={styles.listItemContent}
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
            <View style={[styles.listIconContainer, { backgroundColor: item.color || '#f0f8f5' }]}>
              <Text style={styles.listEmoji}>{item.icon || '🍕'}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listItemCount}>
                {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function List({ navigation }) {
  const {
    lists,
    addList,
    updateList,
    deleteList,
    foodEmojis,
    pastelColors,
  } = useAppData();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const [newListIcon, setNewListIcon] = React.useState('🍕');
  const [newListColor, setNewListColor] = React.useState('#A2C0B0');
  const [editingList, setEditingList] = React.useState(null);
  const [editListName, setEditListName] = React.useState('');
  const [selectedIcon, setSelectedIcon] = React.useState('🍕');
  const [selectedColor, setSelectedColor] = React.useState('#A2C0B0');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openItemId, setOpenItemId] = React.useState(null);

  // Bottom sheet swipe gesture states
  const createSheetTranslateY = useSharedValue(0);
  const editSheetTranslateY = useSharedValue(0);

  const closeAllItems = React.useCallback(() => {
    setOpenItemId(null);
  }, []);

  // Close items when navigating away
  React.useEffect(() => {
    const unsubscribe = navigation?.addListener('blur', () => {
      closeAllItems();
    });
    return unsubscribe;
  }, [navigation]);

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper functions to close sheets with animation
  const closeCreateSheet = () => {
    createSheetTranslateY.value = withTiming(1000, { duration: 250 }, () => {
      runOnJS(setModalVisible)(false);
      runOnJS(setNewListName)('');
      runOnJS(setNewListIcon)('🍕');
      runOnJS(setNewListColor)('#A2C0B0');
    });
  };

  const closeEditSheet = () => {
    editSheetTranslateY.value = withTiming(1000, { duration: 250 }, () => {
      runOnJS(setEditModalVisible)(false);
      runOnJS(setEditingList)(null);
      runOnJS(setEditListName)('');
    });
  };

  const handleAddList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    addList(newListName, newListIcon, newListColor);
    closeCreateSheet();
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditListName(list.name);
    setSelectedIcon(list.icon || '🍕');
    setSelectedColor(list.color || '#A2C0B0');
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    updateList(editingList.id, {
      name: editListName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });
    closeEditSheet();
  };

  const handleDeleteList = (listId) => {
    const listToDelete = lists.find(list => list.id === listId);
    
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${listToDelete.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteList(listId);
          },
        },
      ],
    );
  };

  // Create sheet pan gesture
  const createSheetGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        createSheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        createSheetTranslateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(setModalVisible)(false);
          runOnJS(setNewListName)('');
          runOnJS(setNewListIcon)('🍕');
          runOnJS(setNewListColor)('#A2C0B0');
        });
      } else {
        createSheetTranslateY.value = withTiming(0, { duration: 200 });
      }
    });

  // Edit sheet pan gesture
  const editSheetGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        editSheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        editSheetTranslateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(setEditModalVisible)(false);
          runOnJS(setEditingList)(null);
          runOnJS(setEditListName)('');
        });
      } else {
        editSheetTranslateY.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated styles
  const createSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: createSheetTranslateY.value }],
  }));

  const editSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: editSheetTranslateY.value }],
  }));

  // Reset sheet position when opening
  React.useEffect(() => {
    if (modalVisible) {
      createSheetTranslateY.value = 0;
    }
  }, [modalVisible]);

  React.useEffect(() => {
    if (editModalVisible) {
      editSheetTranslateY.value = 0;
    }
  }, [editModalVisible]);

  // Animate sheet opening
  React.useEffect(() => {
    if (modalVisible) {
      createSheetTranslateY.value = 1000; // Start off-screen
      createSheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [modalVisible]);

  React.useEffect(() => {
    if (editModalVisible) {
      editSheetTranslateY.value = 1000; // Start off-screen
      editSheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [editModalVisible]);

  const renderListItem = ({ item }) => {
    return (
      <SwipeableListItem
        item={item}
        openItemId={openItemId}
        setOpenItemId={setOpenItemId}
        onEdit={(item) => {
          handleEditList(item);
        }}
        onDelete={(itemId) => {
          handleDeleteList(itemId);
        }}
        onPress={(item) => {
          closeAllItems();
          navigation.navigate('Locations', { list: item });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              closeAllItems();
              Alert.alert('Share', 'Share functionality coming soon!');
            }}
          >
            <Ionicons name="share-outline" size={24} color="#A2C0B0" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              closeAllItems();
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={closeAllItems}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {lists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="list-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No lists yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first list</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLists}
          renderItem={renderListItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          onScroll={closeAllItems}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No lists found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}

      {/* Create New List Bottom Sheet */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeCreateSheet}
      >
        <TouchableOpacity 
          style={styles.bottomSheetOverlay} 
          activeOpacity={1}
          onPress={closeCreateSheet}
        >
          <GestureDetector gesture={createSheetGesture}>
            <Animated.View style={[styles.bottomSheetContent, createSheetAnimatedStyle]}>
              <View style={styles.bottomSheetHandle} />
              
              <Text style={styles.modalTitle}>Create New List</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Enter list name"
                value={newListName}
                onChangeText={setNewListName}
                maxLength={50}
              />

              <Text style={styles.iconSectionTitle}>Choose Icon</Text>
              <FlatList
                data={foodEmojis}
                numColumns={6}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.emojiButton,
                      newListIcon === item && styles.emojiButtonSelected
                    ]}
                    onPress={() => setNewListIcon(item)}
                  >
                    <Text style={styles.emojiText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.emojiGrid}
                contentContainerStyle={styles.emojiGridContent}
              />

              <Text style={styles.iconSectionTitle}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {pastelColors.map((colorItem) => (
                  <TouchableOpacity
                    key={colorItem.color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: colorItem.color },
                      newListColor === colorItem.color && styles.colorButtonSelected
                    ]}
                    onPress={() => setNewListColor(colorItem.color)}
                  >
                    {newListColor === colorItem.color && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeCreateSheet}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleAddList}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </GestureDetector>
        </TouchableOpacity>
      </Modal>

      {/* Edit List Bottom Sheet */}
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
          <GestureDetector gesture={editSheetGesture}>
            <Animated.View style={[styles.bottomSheetContent, editSheetAnimatedStyle]}>
              <View style={styles.bottomSheetHandle} />
              
              <Text style={styles.modalTitle}>Edit List</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={editListName}
              onChangeText={setEditListName}
              maxLength={50}
            />

            <Text style={styles.iconSectionTitle}>Choose Icon</Text>
            <FlatList
              data={foodEmojis}
              numColumns={6}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.emojiButton,
                    selectedIcon === item && styles.emojiButtonSelected
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.emojiGrid}
              contentContainerStyle={styles.emojiGridContent}
            />

            <Text style={styles.iconSectionTitle}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {pastelColors.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem.color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: colorItem.color },
                    selectedColor === colorItem.color && styles.colorButtonSelected
                  ]}
                  onPress={() => setSelectedColor(colorItem.color)}
                >
                  {selectedColor === colorItem.color && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={closeEditSheet}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffffA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fffffA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A2C0B0',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#A2C0B0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 20,
  },
  swipeContainer: {
    marginBottom: 12,
    height: 72,
    position: 'relative',
    overflow: 'visible',
    borderRadius: 12,
  },
  listItem: {
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
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listEmoji: {
    fontSize: 24,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemCount: {
    fontSize: 14,
    color: '#999',
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
    backgroundColor: '#A2C0B0',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A2C0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  iconSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  emojiGrid: {
    maxHeight: 200,
    marginBottom: 20,
  },
  emojiGridContent: {
    paddingBottom: 10,
  },
  emojiButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  emojiButtonSelected: {
    backgroundColor: '#A2C0B0',
  },
  emojiText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#A2C0B0',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
