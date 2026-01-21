import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, runOnUI, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAppData } from '../contexts/UserInfoContext';
import CreateListModal from '../components/CreateListModal';
import EditListModal from '../components/EditListModal';

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
          style={[styles.actionButton, styles.editButton, { backgroundColor: item.color }]}
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

  const handleAddList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    addList(newListName, newListIcon, newListColor);
    setNewListName('');
    setNewListIcon('🍕');
    setNewListColor('#A2C0B0');
    setModalVisible(false);
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
    setEditModalVisible(false);
    setEditingList(null);
    setEditListName('');
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

      <CreateListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateList={handleAddList}
        listName={newListName}
        setListName={setNewListName}
        selectedIcon={newListIcon}
        setSelectedIcon={setNewListIcon}
        selectedColor={newListColor}
        setSelectedColor={setNewListColor}
        iconOptions={foodEmojis}
        colorOptions={pastelColors}
      />

      <EditListModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSaveEdit={handleSaveEdit}
        listName={editListName}
        setListName={setEditListName}
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        iconOptions={foodEmojis}
        colorOptions={pastelColors}
      />

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
});
