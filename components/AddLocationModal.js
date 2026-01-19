import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import LocationSearchInput from './LocationSearchInput';

export default function AddLocationModal({
  visible,
  onClose,
  onAddLocation,
  accentColor = '#4CAF50',
}) {
  const translateY = useSharedValue(0);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [rating, setRating] = React.useState('');

  // Animate open/close
  React.useEffect(() => {
    if (visible) {
      translateY.value = 1000;
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      // Reset when modal closes
      setSelectedLocation(null);
      setRating('');
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

  const handleAddLocation = () => {
    if (selectedLocation) {
      const numericRating = rating === '' ? null : parseFloat(rating);
      onAddLocation({
        ...selectedLocation,
        rating: numericRating,
      });
      closeSheet();
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={closeSheet}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={closeSheet}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View 
              style={[styles.bottomSheetContent, animatedStyle]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.bottomSheetHandle} />

              <View style={styles.contentContainer}>
                <Text style={styles.modalTitle}>Add Location</Text>

                <Text style={styles.instructionText}>
                  Search for a place using Google
                </Text>

                <LocationSearchInput
                  onLocationSelected={(location) => {
                    setSelectedLocation(location);
                  }}
                  placeholder="Search for a location..."
                />

                {selectedLocation && (
                  <View style={styles.selectedLocationContainer}>
                    <Text style={styles.selectedLocationTitle}>Selected:</Text>
                    <Text style={styles.selectedLocationName}>{selectedLocation.name}</Text>
                    <Text style={styles.selectedLocationAddress}>{selectedLocation.address}</Text>
                  </View>
                )}

                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingLabel}>Rating (optional)</Text>
                  <View style={styles.ratingInputContainer}>
                    <TextInput
                      style={styles.ratingInput}
                      value={rating}
                      onChangeText={(text) => {
                        // Allow numbers and decimal point
                        if (text === '' || /^\d*\.?\d*$/.test(text)) {
                          const num = parseFloat(text);
                          // Limit to 0-10 range
                          if (text === '' || (num >= 0 && num <= 10)) {
                            setRating(text);
                          }
                        }
                      }}
                      placeholder="0.0"
                      keyboardType="decimal-pad"
                      maxLength={4}
                    />
                    <Text style={styles.ratingMaxText}>/ 10.0</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={closeSheet}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.createButton, 
                      { backgroundColor: accentColor },
                      !selectedLocation && styles.disabledButton
                    ]}
                    onPress={handleAddLocation}
                    disabled={!selectedLocation}
                  >
                    <Text style={[
                      styles.createButtonText,
                      !selectedLocation && styles.disabledButtonText
                    ]}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    maxHeight: '80%',
    height: '80%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  selectedLocationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  selectedLocationTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  selectedLocationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedLocationAddress: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 'auto',
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
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
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
  disabledButtonText: {
    color: '#ccc',
  },
  ratingContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  ratingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ratingInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    fontWeight: '600',
    width: 70,
    textAlign: 'center',
  },
  ratingMaxText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
});
