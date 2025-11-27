import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = -80;
const SWIPE_WIDTH = 150;

const SwipeableListItem = ({ item, onEdit, onDelete, onPress }) => {
  const translateX = useSharedValue(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      const newTranslateX = event.translationX + (isOpen ? -SWIPE_WIDTH : 0);
      if (newTranslateX <= 0 && newTranslateX >= -SWIPE_WIDTH) {
        translateX.value = newTranslateX;
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SWIPE_WIDTH, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        runOnJS(setIsOpen)(true);
      } else {
        translateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        runOnJS(setIsOpen)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const closeRow = () => {
    translateX.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    setIsOpen(false);
  };

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            closeRow();
            setTimeout(() => onEdit(item), 300);
          }}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            closeRow();
            setTimeout(() => onDelete(item.id), 300);
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.listItem, animatedStyle]}>
          <TouchableOpacity 
            style={styles.listItemContent}
            onPress={() => {
              if (isOpen) {
                closeRow();
              } else {
                onPress(item);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.listIconContainer}>
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

export default function List() {
  const [lists, setLists] = React.useState([
    { id: '1', name: 'Sample List 1', itemCount: 5, icon: '🍕' },
    { id: '2', name: 'Sample List 2', itemCount: 3, icon: '🍜' },
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const [editingList, setEditingList] = React.useState(null);
  const [editListName, setEditListName] = React.useState('');
  const [selectedIcon, setSelectedIcon] = React.useState('🍕');
  const [searchQuery, setSearchQuery] = React.useState('');

  const foodEmojis = ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🫓', '🥗', '🥙', '🥪', '🌮', '🌯', '🫔', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫘', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️'];

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    const newList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      itemCount: 0,
      icon: '🍕',
    };

    setLists([...lists, newList]);
    setNewListName('');
    setModalVisible(false);
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditListName(list.name);
    setSelectedIcon(list.icon || '🍕');
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    setLists(lists.map(list => 
      list.id === editingList.id 
        ? { ...list, name: editListName.trim(), icon: selectedIcon }
        : list
    ));
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
            setLists(lists.filter(list => list.id !== listId));
          },
        },
      ],
    );
  };

  const renderListItem = ({ item }) => (
    <SwipeableListItem
      item={item}
      onEdit={handleEditList}
      onDelete={handleDeleteList}
      onPress={(item) => {
        Alert.alert('Coming Soon', `Opening "${item.name}"`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => Alert.alert('Share', 'Share functionality coming soon!')}
          >
            <Ionicons name="share-outline" size={24} color="#A2C0B0" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No lists found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New List</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
              maxLength={50}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setNewListName('');
                  setModalVisible(false);
                }}
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
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingList(null);
                  setEditListName('');
                }}
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
          </View>
        </View>
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
    backgroundColor: '#f0f8f5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
