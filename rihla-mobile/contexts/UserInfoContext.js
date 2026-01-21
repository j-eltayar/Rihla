import React from 'react';

// Create a context to share all app data across screens
export const UserInfoContext = React.createContext(null);

// Provider component that manages all app state
export const AppDataProvider = ({ children, initialUserInfo }) => {
  // User information
  const [userInfo, setUserInfo] = React.useState(initialUserInfo || null);

  // Lists data
  const [lists, setLists] = React.useState([
    { id: '1', name: 'Favorite Restaurants', itemCount: 3, icon: '🍕', color: '#A2C0B0' },
    { id: '2', name: 'Coffee Shops', itemCount: 2, icon: '☕', color: '#FFB5C5' },
    { id: '3', name: 'Travel Spots', itemCount: 4, icon: '✈️', color: '#C5B9E5' },
  ]);

  // Locations data (organized by listId)
  const [locations, setLocations] = React.useState([
    // Locations for list '1' - Favorite Restaurants
    { id: 'loc1', listId: '1', name: 'Italian Bistro', address: '123 Main St, Montreal', rating: 4.5, lat: 45.5017, lng: -73.5673 },
    { id: 'loc2', listId: '1', name: 'Sushi Palace', address: '456 Oak Ave, Montreal', rating: 4.8, lat: 45.5037, lng: -73.5693 },
    { id: 'loc3', listId: '1', name: 'Taco Haven', address: '789 Pine Rd, Montreal', rating: 4.2, lat: 45.4997, lng: -73.5653 },
    
    // Locations for list '2' - Coffee Shops
    { id: 'loc4', listId: '2', name: 'Cafe Lumière', address: '321 Elm St, Montreal', rating: 4.6, lat: 45.5057, lng: -73.5713 },
    { id: 'loc5', listId: '2', name: 'Bean & Brew', address: '654 Maple Dr, Montreal', rating: 4.4, lat: 45.5077, lng: -73.5633 },
    
    // Locations for list '3' - Travel Spots
    { id: 'loc6', listId: '3', name: 'Mount Royal Park', address: 'Mount Royal, Montreal', rating: 4.9, lat: 45.5088, lng: -73.5878 },
    { id: 'loc7', listId: '3', name: 'Old Port', address: 'Old Montreal, Montreal', rating: 4.7, lat: 45.5048, lng: -73.5540 },
    { id: 'loc8', listId: '3', name: 'Biodome', address: '4777 Pierre-De Coubertin Ave', rating: 4.5, lat: 45.5585, lng: -73.5515 },
    { id: 'loc9', listId: '3', name: 'Notre-Dame Basilica', address: '110 Notre-Dame St W', rating: 4.8, lat: 45.5045, lng: -73.5562 },
  ]);

  // Available emoji icons
  const foodEmojis = [
    '🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', 
    '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🫓', '🥗', '🥙', 
    '🥪', '🌮', '🌯', '🫔', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', 
    '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', 
    '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', 
    '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫘', '🍯', '🥛', 
    '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', 
    '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', 
    '🍽️', '✈️', '🏖️', '🗺️', '🎭', '🎨', '🎪', '🎬', '🎮', '🎯'
  ];

  // Available pastel colors
  const pastelColors = [
    { name: 'Mint', color: '#A2C0B0' },
    { name: 'Rose', color: '#FFB5C5' },
    { name: 'Lavender', color: '#C5B9E5' },
    { name: 'Peach', color: '#FFD4B5' },
    { name: 'Sky', color: '#B5D4FF' },
    { name: 'Lemon', color: '#FFF4B5' },
    { name: 'Coral', color: '#FFB5B5' },
    { name: 'Sage', color: '#C5D4B9' },
  ];

  // List management functions
  const addList = (name, icon, color) => {
    const newList = {
      id: Date.now().toString(),
      name: name.trim(),
      itemCount: 0,
      icon: icon,
      color: color,
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const updateList = (listId, updates) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, ...updates } : list
    ));
  };

  const deleteList = (listId) => {
    setLists(prev => prev.filter(list => list.id !== listId));
    // Also delete all locations in this list
    setLocations(prev => prev.filter(loc => loc.listId !== listId));
  };

  // Location management functions
  const addLocation = (listId, name, address, lat, lng, rating = 0) => {
    const newLocation = {
      id: `loc${Date.now()}`,
      listId: listId,
      name: name.trim(),
      address: address.trim(),
      rating: rating,
      lat: lat || 45.5017, // Default to Montreal
      lng: lng || -73.5673,
    };
    setLocations(prev => [...prev, newLocation]);
    
    // Update list item count
    updateListItemCount(listId);
    return newLocation;
  };

  const updateLocation = (locationId, updates) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId ? { ...loc, ...updates } : loc
    ));
  };

  const deleteLocation = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    
    // Update list item count
    if (location) {
      updateListItemCount(location.listId);
    }
  };

  const reorderLocations = (listId, reorderedLocations) => {
    // Update the order of locations for a specific list
    setLocations(prev => {
      // Keep locations from other lists unchanged
      const otherLocations = prev.filter(loc => loc.listId !== listId);
      // Combine with reordered locations for this list
      return [...otherLocations, ...reorderedLocations];
    });
  };

  const getLocationsByListId = (listId) => {
    return locations.filter(loc => loc.listId === listId);
  };

  const updateListItemCount = (listId) => {
    const count = locations.filter(loc => loc.listId === listId).length;
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, itemCount: count } : list
    ));
  };

  // Update all list item counts whenever locations change
  React.useEffect(() => {
    lists.forEach(list => {
      const count = locations.filter(loc => loc.listId === list.id).length;
      if (list.itemCount !== count) {
        updateList(list.id, { itemCount: count });
      }
    });
  }, [locations.length]);

  const value = {
    // User info
    userInfo,
    setUserInfo,
    
    // Lists
    lists,
    setLists,
    addList,
    updateList,
    deleteList,
    
    // Locations
    locations,
    setLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    reorderLocations,
    getLocationsByListId,
    
    // Reference data
    foodEmojis,
    pastelColors,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

// Custom hook to use the context
export const useAppData = () => {
  const context = React.useContext(UserInfoContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};
