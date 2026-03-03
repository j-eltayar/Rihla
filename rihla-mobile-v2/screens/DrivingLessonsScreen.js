import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Platform, Alert, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DrivingLessonsScreen({ navigation }) {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Practice 1: Parking Lot', description: 'Getting comfortable with the car in a safe space', status: 'pending', order: 1 },
    { id: 2, title: 'Practice 2: Empty Streets', description: 'Basic driving on quiet roads learning not to be in the middle', status: 'pending', order: 2 },
    { id: 3, title: 'Practice 3: Empty Streets', description: 'Building confidence on quiet roads', status: 'pending', order: 3 },
    { id: 4, title: 'Practice 4: Empty Streets', description: 'More practice on quiet roads', status: 'pending', order: 4 },
    { id: 5, title: 'Practice 5: Neighborhood Driving', description: 'Residential streets with some traffic', status: 'pending', order: 5 },
    { id: 6, title: 'Practice 6: Busier Roads', description: 'More traffic, multiple lanes', status: 'pending', order: 6 },
    { id: 7, title: 'Practice 7: City Driving', description: 'Downtown traffic, pedestrians, lights', status: 'pending', order: 7 },
    { id: 8, title: 'Practice 8: Highway Driving', description: 'Merging, highway speeds, lane changes', status: 'pending', order: 8 },
    { id: 9, title: 'Parking Lesson 1', description: 'Parallel parking practice', status: 'pending', order: 9 },
    { id: 10, title: 'Parking Lesson 2', description: 'All types of parking (parallel, perpendicular, angle)', status: 'pending', order: 10 },
  ]);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in-progress':
        return '#FF9800';
      case 'scheduled':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🚗';
      case 'scheduled':
        return '📅';
      default:
        return '⏳';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Not Started';
    }
  };

  const updateLessonStatus = (lessonId, newStatus) => {
    console.log('updateLessonStatus called with:', lessonId, newStatus);
    
    if (newStatus === 'scheduled') {
      console.log('Opening date picker for scheduling');
      // Close the status modal first
      setShowModal(false);
      setSelectedLesson(lessons.find(l => l.id === lessonId));
      // Show date picker for scheduling after a brief delay
      setTimeout(() => {
        console.log('Setting showDatePicker to true');
        setShowDatePicker(true);
      }, 400);
    } else {
      console.log('Updating lesson status directly');
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, status: newStatus } : lesson
      ));
      setShowModal(false);
      setSelectedLesson(null);
    }
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      // Show time picker after date is selected
      setShowTimePicker(true);
    }
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
      // Combine date and time
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());
      
      // Send calendar invite and update status
      sendCalendarInvite(selectedLesson, combinedDateTime);
    }
  };

  const sendCalendarInvite = async (lesson, dateTime) => {
    try {
      const startTime = dateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endDateTime = new Date(dateTime.getTime() + 60 * 60 * 1000); // 1 hour later
      const endTime = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      
      const title = encodeURIComponent(`Driving Lesson: ${lesson.title}`);
      const description = encodeURIComponent(`${lesson.description}\n\nLesson ${lesson.order} of 10`);
      const location = encodeURIComponent('TBD');
      
      // Create Google Calendar URL
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=${location}&add=eltayarjames@gmail.com`;
      
      // Open the calendar URL
      const supported = await Linking.canOpenURL(calendarUrl);
      if (supported) {
        await Linking.openURL(calendarUrl);
        
        // Update lesson status with scheduled date
        setLessons(lessons.map(l => 
          l.id === lesson.id ? { ...l, status: 'scheduled', scheduledDate: dateTime.toISOString() } : l
        ));
        
        Alert.alert(
          'Lesson Scheduled! 📅',
          `Your driving lesson has been scheduled for ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. A calendar invite will be sent to James!`,
          [{ text: 'Great!', onPress: () => setShowModal(false) }]
        );
      } else {
        Alert.alert('Error', 'Unable to open calendar');
      }
    } catch (error) {
      console.error('Error creating calendar invite:', error);
      Alert.alert('Error', 'Failed to create calendar invite');
    }
  };

  const openLessonModal = (lesson) => {
    setSelectedLesson(lesson);
    setShowModal(true);
  };

  const getCompletedCount = () => {
    return lessons.filter(lesson => lesson.status === 'completed').length;
  };

  const getProgressPercentage = () => {
    return (getCompletedCount() / lessons.length) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driving Lessons 🚗</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressEmoji}>🎯</Text>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressStats}>
            {getCompletedCount()} of {lessons.length} lessons completed
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[styles.progressBar, { width: `${getProgressPercentage()}%` }]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(getProgressPercentage())}%
          </Text>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageEmoji}>💪</Text>
          <Text style={styles.messageText}>
            You're doing amazing! Each lesson brings you closer to becoming a confident driver. The journey from passenger princess to driving queen ain't easy 🚗
          </Text>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Lesson Plan</Text>
          {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard,
                { borderLeftColor: getStatusColor(lesson.status) }
              ]}
              onPress={() => openLessonModal(lesson)}
              activeOpacity={0.7}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonNumberContainer}>
                  <Text style={styles.lessonNumber}>{lesson.order}</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>
                </View>
              </View>
              <View style={[styles.lessonFooter, lesson.scheduledDate && styles.lessonFooterWithDate]}>
                {lesson.scheduledDate && (
                  <Text style={styles.scheduledDateText}>
                    📅 {new Date(lesson.scheduledDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {new Date(lesson.scheduledDate).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Text>
                )}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lesson.status) }]}>
                  <Text style={styles.statusEmoji}>{getStatusEmoji(lesson.status)}</Text>
                  <Text style={styles.statusText}>{getStatusText(lesson.status)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Encouragement Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerEmoji}>❤️</Text>
          <Text style={styles.footerText}>
            Remember: Everyone learns at their own pace. Take your time, stay safe, and enjoy the journey! It's the road's fault for not letting you be in the middle! No matter what you know I'll always be your chauffeur!
          </Text>
          <Text style={styles.footerSignature}>- Your instructor (and biggest fan) 💕</Text>
        </View>
      </ScrollView>

      {/* Lesson Status Modal */}
      {selectedLesson && showModal && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowModal(false);
            setSelectedLesson(null);
          }}
        >
          <View style={styles.modalOverlay} pointerEvents="box-none">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Lesson {selectedLesson.order}</Text>
              <Text style={styles.modalLessonTitle}>{selectedLesson.title}</Text>
              <Text style={styles.modalDescription}>{selectedLesson.description}</Text>
              
              <View style={styles.statusOptionsContainer}>
                <Text style={styles.statusOptionsTitle}>Update Status:</Text>
                
                <TouchableOpacity
                  style={[styles.statusOption, { backgroundColor: '#9E9E9E' }]}
                  onPress={() => updateLessonStatus(selectedLesson.id, 'pending')}
                >
                  <Text style={styles.statusOptionEmoji}>⏳</Text>
                  <Text style={styles.statusOptionText}>Not Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusOption, { backgroundColor: '#2196F3' }]}
                  onPress={() => updateLessonStatus(selectedLesson.id, 'scheduled')}
                >
                  <Text style={styles.statusOptionEmoji}>📅</Text>
                  <Text style={styles.statusOptionText}>Schedule</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusOption, { backgroundColor: '#FF9800' }]}
                  onPress={() => updateLessonStatus(selectedLesson.id, 'in-progress')}
                >
                  <Text style={styles.statusOptionEmoji}>🚗</Text>
                  <Text style={styles.statusOptionText}>In Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusOption, { backgroundColor: '#4CAF50' }]}
                  onPress={() => updateLessonStatus(selectedLesson.id, 'completed')}
                >
                  <Text style={styles.statusOptionEmoji}>✅</Text>
                  <Text style={styles.statusOptionText}>Completed</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowModal(false);
                  setSelectedLesson(null);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && !showModal && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContentCenter}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Date</Text>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                style={styles.picker}
              />
              <View style={styles.pickerButtons}>
                <TouchableOpacity
                  style={styles.pickerCancelButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pickerConfirmButton}
                  onPress={() => {
                    setShowDatePicker(false);
                    setShowTimePicker(true);
                  }}
                >
                  <Text style={styles.pickerConfirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && !showModal && !showDatePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContentCenter}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Time</Text>
              </View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={(event, time) => {
                  if (time) {
                    setSelectedTime(time);
                  }
                }}
                style={styles.picker}
              />
              <View style={styles.pickerButtons}>
                <TouchableOpacity
                  style={styles.pickerCancelButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pickerConfirmButton}
                  onPress={() => {
                    setShowTimePicker(false);
                    // Combine date and time
                    const combinedDateTime = new Date(selectedDate);
                    combinedDateTime.setHours(selectedTime.getHours());
                    combinedDateTime.setMinutes(selectedTime.getMinutes());
                    // Send calendar invite and update status
                    sendCalendarInvite(selectedLesson, combinedDateTime);
                  }}
                >
                  <Text style={styles.pickerConfirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  progressEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 8,
  },
  progressStats: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#BBDEFB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1976D2',
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  messageEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
  },
  lessonsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  lessonFooterWithDate: {
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusEmoji: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scheduledDateText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
    flex: 1,
  },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  footerEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  footerSignature: {
    fontSize: 14,
    color: '#1976D2',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalLessonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusOptionsContainer: {
    marginBottom: 20,
  },
  statusOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  statusOptionEmoji: {
    fontSize: 20,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContentCenter: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  pickerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  pickerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
  },
  picker: {
    width: '100%',
    height: 200,
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  pickerCancelButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  pickerConfirmButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
