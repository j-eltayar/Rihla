import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressContext = createContext();

const STORAGE_KEY = '@rania_app_progress';

export const ProgressProvider = ({ children }) => {
  const [completedSections, setCompletedSections] = useState([]);
  const [sectionProgress, setSectionProgress] = useState({});
  const [checkedItemsPerSection, setCheckedItemsPerSection] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from AsyncStorage on app start
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveProgress();
    }
  }, [completedSections, sectionProgress, checkedItemsPerSection, isLoaded]);

  const loadProgress = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { completed, progress, checkedItems } = JSON.parse(savedData);
        setCompletedSections(completed || []);
        setSectionProgress(progress || {});
        setCheckedItemsPerSection(checkedItems || {});
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveProgress = async () => {
    try {
      const dataToSave = {
        completed: completedSections,
        progress: sectionProgress,
        checkedItems: checkedItemsPerSection,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const markSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const updateSectionProgress = (sectionId, checkedCount, totalCount) => {
    setSectionProgress({
      ...sectionProgress,
      [sectionId]: { checked: checkedCount, total: totalCount }
    });
  };

  const saveCheckedItems = (sectionId, checkedItems) => {
    setCheckedItemsPerSection({
      ...checkedItemsPerSection,
      [sectionId]: checkedItems,
    });
  };

  const getCheckedItems = (sectionId) => {
    return checkedItemsPerSection[sectionId] || [];
  };

  const getTotalCompleted = () => {
    return Object.values(sectionProgress).reduce((sum, section) => sum + section.checked, 0);
  };

  const getTotalReasons = () => {
    return Object.values(sectionProgress).reduce((sum, section) => sum + section.total, 0);
  };

  const resetProgress = () => {
    setCompletedSections([]);
    setSectionProgress({});
    setCheckedItemsPerSection({});
  };

  return (
    <ProgressContext.Provider
      value={{
        completedSections,
        sectionProgress,
        markSectionComplete,
        updateSectionProgress,
        getTotalCompleted,
        getTotalReasons,
        resetProgress,
        saveCheckedItems,
        getCheckedItems,
        isLoaded,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
