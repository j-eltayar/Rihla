import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

export default function CreateListModal({
  visible,
  onClose,
  onCreateList,
  listName,
  setListName,
  selectedIcon,
  setSelectedIcon,
  selectedColor,
  setSelectedColor,
  iconOptions = ['🍕', '☕️', '🍔', '🍜', '🍰', '🌮', '🍱', '🥗', '🍣', '🥘'],
  colorOptions = [
    { color: '#A2C0B0' },
    { color: '#E8B4B8' },
    { color: '#B8C5E8' },
    { color: '#E8D4B8' },
    { color: '#C4B8E8' },
    { color: '#B8E8D4' },
  ],
}) {
  const translateY = useSharedValue(0);

  // Animate open/close
  React.useEffect(() => {
    if (visible) {
      translateY.value = 1000;
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [visible]);

  const closeSheet = () => {
    translateY.value = withTiming(1000, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  };

  // Pan gesture for swipe to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={closeSheet}
    >
      <TouchableOpacity
        style={styles.bottomSheetOverlay}
        activeOpacity={1}
        onPress={closeSheet}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheetContent, animatedStyle]}>
            <View style={styles.bottomSheetHandle} />

            <Text style={styles.modalTitle}>Create New List</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={listName}
              onChangeText={setListName}
              maxLength={50}
            />

            <Text style={styles.iconSectionTitle}>Choose Icon</Text>
            <FlatList
              data={iconOptions}
              numColumns={6}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    selectedIcon === item && styles.selectedIconOption,
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <Text style={styles.iconText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.iconGrid}
            />

            <Text style={styles.iconSectionTitle}>Choose Color</Text>
            <View style={styles.colorOptions}>
              {colorOptions.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem.color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorItem.color },
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
                onPress={closeSheet}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={onCreateList}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  iconSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  iconGrid: {
    maxHeight: 200,
    marginBottom: 20,
  },
  iconOption: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconOption: {
    borderColor: '#A2C0B0',
    backgroundColor: '#e8f5e9',
  },
  iconText: {
    fontSize: 28,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#A2C0B0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
