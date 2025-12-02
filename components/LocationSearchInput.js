import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// TODO: Re-enable after native rebuild
// import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDv3uen4tlhqrOs8CNXZthm-HWsyiaS1xo';

export default function LocationSearchInput({ 
  onLocationSelected, 
  placeholder = "Search for a location",
  initialValue = "",
}) {
  const [selectedPlace, setSelectedPlace] = React.useState(initialValue);
  // const [currentLocation, setCurrentLocation] = React.useState(null);

  // TODO: Re-enable after native rebuild
  // Request location permissions and get current location
  // React.useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       console.log('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setCurrentLocation({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //   })();
  // }, []);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log('Place selected:', data);
          console.log('Details:', details);
          // 'details' is provided when fetchDetails = true
          if (details) {
            const location = {
              name: data.structured_formatting?.main_text || data.description,
              address: details.formatted_address,
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
              placeId: data.place_id,
            };
            console.log('Location object:', location);
            setSelectedPlace(location.name);
            onLocationSelected(location);
          }
        }}
        onFail={(error) => console.log('Google Places Error:', error)}
        onNotFound={() => console.log('No results found')}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
          components: 'country:ca', // Focus on Canada, change as needed
          types: 'establishment', // Show all types of places
          // TODO: Re-enable after native rebuild
          // location: currentLocation ? `${currentLocation.latitude},${currentLocation.longitude}` : undefined,
          // radius: currentLocation ? 50000 : undefined, // 50km radius
        }}
        listViewDisplayed="auto"
        keepResultsAfterBlur={true}
        minLength={2}
        styles={{
          container: styles.autocompleteContainer,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          poweredContainer: styles.poweredContainer,
          powered: styles.powered,
        }}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        textInputProps={{
          placeholderTextColor: '#999',
          returnKeyType: 'search',
        }}
        // TODO: Re-enable after native rebuild
        // currentLocation={true}
        // currentLocationLabel="Current location"
        // enableHighAccuracyLocation={true}
        GooglePlacesSearchQuery={{
          rankby: 'distance',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    minHeight: 250, // Ensure space for suggestions
    zIndex: 1,
  },
  autocompleteContainer: {
    flex: 1,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 50,
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    padding: 13,
    minHeight: 44,
    flexDirection: 'row',
  },
  description: {
    fontSize: 15,
    color: '#333',
  },
  poweredContainer: {
    display: 'none',
  },
  powered: {
    display: 'none',
  },
});
