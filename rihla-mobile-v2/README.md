# For Rania 💖

A beautiful mobile app expressing all the reasons why I love Rania.

## Features

- 8 different sections, each dedicated to a different aspect of what makes Rania amazing
- Beautiful gradient cards with emojis
- Smooth navigation between sections
- Customizable reasons for each category

## Sections

1. **Your Smile** 😊 - Everything about her beautiful smile
2. **Your Personality** ✨ - Her amazing character and authenticity
3. **Your Laugh** 😄 - The joy her laughter brings
4. **Your Kindness** 💕 - Her compassionate heart
5. **Your Intelligence** 🧠 - Her brilliant mind
6. **Your Beauty** 🌸 - Inside and out
7. **Your Heart** ❤️ - Her capacity for love
8. **Everything About You** 🌟 - All the reasons combined

## How to Customize

### Adding/Editing Reasons

Edit the `reasonsData` object in `screens/DetailScreen.js`:

```javascript
const reasonsData = {
  smile: [
    "Your smile lights up my entire world",
    "Add your own reasons here...",
  ],
  // ... other sections
};
```

### Adding New Sections

1. Add a new section to the `sections` array in `screens/HomeScreen.js`:
```javascript
{ 
  id: 'newsection', 
  title: 'New Section Title', 
  emoji: '🎉', 
  color: ['#START_COLOR', '#END_COLOR'] 
}
```

2. Add corresponding reasons in `screens/DetailScreen.js`:
```javascript
const reasonsData = {
  newsection: [
    "Reason 1",
    "Reason 2",
  ],
  // ...
};
```

## Running the App

```bash
# Install dependencies
npm install

# Start the app
npx expo start

# Or run directly on iOS simulator
npx expo start --ios

# Or on Android
npx expo start --android
```

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo Linear Gradient

---

Made with ❤️ for Rania
