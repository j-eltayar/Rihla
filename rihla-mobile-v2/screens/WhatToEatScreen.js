import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function WhatToEatScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      question: "What are you in the mood for?",
      options: [
        { text: "Something light", value: "light" },
        { text: "Something filling", value: "filling" },
        { text: "Something sweet", value: "sweet" },
        { text: "Something savory", value: "savory" }
      ]
    },
    {
      id: 2,
      question: "How hungry are you?",
      options: [
        { text: "Not very hungry", value: "snack" },
        { text: "Medium hungry", value: "medium" },
        { text: "Very hungry", value: "very" },
        { text: "Starving!", value: "starving" }
      ]
    },
    {
      id: 3,
      question: "What kind of cuisine?",
      options: [
        { text: "Italian", value: "italian" },
        { text: "Asian", value: "asian" },
        { text: "American", value: "american" },
        { text: "Mediterranean", value: "mediterranean" }
      ]
    },
    {
      id: 4,
      question: "Temperature preference?",
      options: [
        { text: "Hot/Warm", value: "hot" },
        { text: "Cold", value: "cold" },
        { text: "Room temp", value: "room" },
        { text: "Doesn't matter", value: "any" }
      ]
    }
  ];

  const foodSuggestions = {
    // LIGHT MOOD
    // Light - Snack - Italian
    "light-snack-italian-hot": "Bruschetta or Minestrone Soup",
    "light-snack-italian-cold": "Caprese Salad or Antipasto",
    "light-snack-italian-room": "Focaccia with Olive Oil",
    "light-snack-italian-any": "Bruschetta or Caprese Salad",
    
    // Light - Snack - Asian
    "light-snack-asian-hot": "Edamame or Miso Soup",
    "light-snack-asian-cold": "Spring Rolls or Cucumber Salad",
    "light-snack-asian-room": "Rice Crackers or Seaweed Snacks",
    "light-snack-asian-any": "Spring Rolls or Edamame",
    
    // Light - Snack - American
    "light-snack-american-hot": "Tomato Soup or Grilled Cheese",
    "light-snack-american-cold": "Greek Yogurt with Berries",
    "light-snack-american-room": "Crackers with Cheese",
    "light-snack-american-any": "Fruit Salad or Yogurt Parfait",
    
    // Light - Snack - Mediterranean
    "light-snack-mediterranean-hot": "Lentil Soup",
    "light-snack-mediterranean-cold": "Hummus with Veggies",
    "light-snack-mediterranean-room": "Olives and Pita Bread",
    "light-snack-mediterranean-any": "Hummus Plate",
    
    // Light - Medium - Italian
    "light-medium-italian-hot": "Pasta Primavera or Minestrone",
    "light-medium-italian-cold": "Panzanella Salad",
    "light-medium-italian-room": "Arugula Salad with Parmesan",
    "light-medium-italian-any": "Pasta with Vegetables",
    
    // Light - Medium - Asian
    "light-medium-asian-hot": "Pho or Udon Soup",
    "light-medium-asian-cold": "Poke Bowl or Cold Soba Noodles",
    "light-medium-asian-room": "Sushi",
    "light-medium-asian-any": "Fried Rice platter",
    
    // Light - Medium - American
    "light-medium-american-hot": "Chicken Noodle Soup",
    "light-medium-american-cold": "Caesar Salad or Cobb Salad",
    "light-medium-american-room": "Turkey Sandwich",
    "light-medium-american-any": "Garden Salad with Grilled Chicken",
    
    // Light - Medium - Mediterranean
    "light-medium-mediterranean-hot": "Lentil Soup with Pita",
    "light-medium-mediterranean-cold": "Greek Salad with Feta",
    "light-medium-mediterranean-room": "Falafel Wrap",
    "light-medium-mediterranean-any": "Mediterranean Mezze Platter",
    
    // Light - Very - Italian
    "light-very-italian-hot": "Pasta Pomodoro",
    "light-very-italian-cold": "Insalata Caprese with Fresh Bread",
    "light-very-italian-room": "Italian Pasta Salad",
    "light-very-italian-any": "Margherita Pizza (light toppings)",
    
    // Light - Very - Asian
    "light-very-asian-hot": "Vegetable Stir Fry with Rice",
    "light-very-asian-cold": "Large Sushi Platter",
    "light-very-asian-room": "Vietnamese Banh Mi",
    "light-very-asian-any": "Buddha Bowl with Tofu",
    
    // Light - Very - American
    "light-very-american-hot": "Grilled Chicken with Steamed Veggies",
    "light-very-american-cold": "Chef Salad with Everything",
    "light-very-american-room": "Turkey Club Sandwich",
    "light-very-american-any": "Grilled Fish with Rice",
    
    // Light - Very - Mediterranean
    "light-very-mediterranean-hot": "Grilled Fish with Lemon",
    "light-very-mediterranean-cold": "Fattoush Salad",
    "light-very-mediterranean-room": "Chicken Shawarma Wrap",
    "light-very-mediterranean-any": "Grilled Vegetables with Couscous",
    
    // Light - Starving - Italian
    "light-starving-italian-hot": "Pasta with Light Tomato Sauce",
    "light-starving-italian-cold": "Large Caprese with Bread",
    "light-starving-italian-room": "Vegetarian Panini",
    "light-starving-italian-any": "Vegetable Pizza",
    
    // Light - Starving - Asian
    "light-starving-asian-hot": "Large Bowl of Pho",
    "light-starving-asian-cold": "Massive Sushi Boat",
    "light-starving-asian-room": "Pad Thai (light version)",
    "light-starving-asian-any": "Vegetable Fried Rice (large)",
    
    // Light - Starving - American
    "light-starving-american-hot": "Rotisserie Chicken with Sides",
    "light-starving-american-cold": "Triple Decker Club Sandwich",
    "light-starving-american-room": "Large Subway Sandwich",
    "light-starving-american-any": "Grilled Chicken Pasta",
    
    // Light - Starving - Mediterranean
    "light-starving-mediterranean-hot": "Large Shawarma Plate",
    "light-starving-mediterranean-cold": "Mezze Platter with Pita",
    "light-starving-mediterranean-room": "Double Falafel Wrap",
    "light-starving-mediterranean-any": "Grilled Chicken with Hummus & Tabbouleh",

    // FILLING MOOD
    // Filling - Snack - Italian
    "filling-snack-italian-hot": "Garlic Bread or Small Pizza",
    "filling-snack-italian-cold": "Prosciutto & Mozzarella",
    "filling-snack-italian-room": "Arancini (Rice Balls)",
    "filling-snack-italian-any": "Mozzarella Sticks",
    
    // Filling - Snack - Asian
    "filling-snack-asian-hot": "Dumplings or Gyoza",
    "filling-snack-asian-cold": "California Rolls",
    "filling-snack-asian-room": "Onigiri (Rice Balls)",
    "filling-snack-asian-any": "Steamed Buns",
    
    // Filling - Snack - American
    "filling-snack-american-hot": "Mac & Cheese Bites",
    "filling-snack-american-cold": "Ham & Cheese Wrap",
    "filling-snack-american-room": "Peanut Butter Sandwich",
    "filling-snack-american-any": "Chicken Wings",
    
    // Filling - Snack - Mediterranean
    "filling-snack-mediterranean-hot": "Cheese Borek",
    "filling-snack-mediterranean-cold": "Stuffed Grape Leaves",
    "filling-snack-mediterranean-room": "Labneh with Pita",
    "filling-snack-mediterranean-any": "Spanakopita",
    
    // Filling - Medium - Italian
    "filling-medium-italian-hot": "Pasta Carbonara or Risotto",
    "filling-medium-italian-cold": "Italian Sub Sandwich",
    "filling-medium-italian-room": "Calzone",
    "filling-medium-italian-any": "Fettuccine Alfredo",
    
    // Filling - Medium - Asian
    "filling-medium-asian-hot": "Pad Thai or Fried Rice",
    "filling-medium-asian-cold": "Sushi & Sashimi Combo",
    "filling-medium-asian-room": "Chicken Teriyaki Bowl",
    "filling-medium-asian-any": "Orange Chicken with Rice",
    
    // Filling - Medium - American
    "filling-medium-american-hot": "Burger and Fries",
    "filling-medium-american-cold": "Roast Beef Sandwich",
    "filling-medium-american-room": "BLT with Chips",
    "filling-medium-american-any": "Chicken Sandwich Combo",
    
    // Filling - Medium - Mediterranean
    "filling-medium-mediterranean-hot": "Falafel Plate or Shawarma",
    "filling-medium-mediterranean-cold": "Chicken Gyro",
    "filling-medium-mediterranean-room": "Lamb Wrap",
    "filling-medium-mediterranean-any": "Mixed Grill Plate",
    
    // Filling - Very - Italian
    "filling-very-italian-hot": "Lasagna or Meat Pizza",
    "filling-very-italian-cold": "Italian Hero Sandwich",
    "filling-very-italian-room": "Meatball Sub",
    "filling-very-italian-any": "Chicken Parmesan with Pasta",
    
    // Filling - Very - Asian
    "filling-very-asian-hot": "Ramen or Curry",
    "filling-very-asian-cold": "Large Sushi Combo",
    "filling-very-asian-room": "Korean BBQ Bowl",
    "filling-very-asian-any": "General Tso's Chicken",
    
    // Filling - Very - American
    "filling-very-american-hot": "Steak and Potatoes",
    "filling-very-american-cold": "Loaded Sub Sandwich",
    "filling-very-american-room": "Philly Cheesesteak",
    "filling-very-american-any": "BBQ Ribs with Sides",
    
    // Filling - Very - Mediterranean
    "filling-very-mediterranean-hot": "Grilled Lamb Kebabs",
    "filling-very-mediterranean-cold": "Large Shawarma Wrap",
    "filling-very-mediterranean-room": "Mixed Grill Platter",
    "filling-very-mediterranean-any": "Lamb Chops with Rice",
    
    // Filling - Starving - Italian
    "filling-starving-italian-hot": "Large Meat Lovers Pizza",
    "filling-starving-italian-cold": "Massive Italian Sub",
    "filling-starving-italian-room": "Double Portion Pasta",
    "filling-starving-italian-any": "Family Size Lasagna",
    
    // Filling - Starving - Asian
    "filling-starving-asian-hot": "Hot Pot for Two or Korean BBQ",
    "filling-starving-asian-cold": "All-You-Can-Eat Sushi",
    "filling-starving-asian-room": "Deluxe Bento Box",
    "filling-starving-asian-any": "Fried Rice + Noodles + Appetizers",
    
    // Filling - Starving - American
    "filling-starving-american-hot": "Triple Burger with Everything",
    "filling-starving-american-cold": "Footlong Sub Combo",
    "filling-starving-american-room": "Double Decker Sandwich Platter",
    "filling-starving-american-any": "Steak + Chicken Combo Plate",
    
    // Filling - Starving - Mediterranean
    "filling-starving-mediterranean-hot": "Mixed Grill Feast",
    "filling-starving-mediterranean-cold": "Family Mezze with Shawarma",
    "filling-starving-mediterranean-room": "Double Shawarma Plate",
    "filling-starving-mediterranean-any": "Meat Lover's Platter",

    // SWEET MOOD
    // Sweet - Snack - Italian
    "sweet-snack-italian-hot": "Bomboloni or Cannoli",
    "sweet-snack-italian-cold": "Gelato",
    "sweet-snack-italian-room": "Biscotti",
    "sweet-snack-italian-any": "Tiramisu",
    
    // Sweet - Snack - Asian
    "sweet-snack-asian-hot": "Mochi or Taiyaki",
    "sweet-snack-asian-cold": "Mochi Ice Cream",
    "sweet-snack-asian-room": "Pocky or Matcha Cookies",
    "sweet-snack-asian-any": "Bubble Tea with Tapioca",
    
    // Sweet - Snack - American
    "sweet-snack-american-hot": "Warm Cookies",
    "sweet-snack-american-cold": "Frozen Chocolate Cake",
    "sweet-snack-american-room": "Chocolate Chip Cookies",
    "sweet-snack-american-any": "Brownies",
    
    // Sweet - Snack - Mediterranean
    "sweet-snack-mediterranean-hot": "Baklava (warm)",
    "sweet-snack-mediterranean-cold": "Turkish Delight",
    "sweet-snack-mediterranean-room": "Halva",
    "sweet-snack-mediterranean-any": "Baklava",
    
    // Sweet - Medium - Italian
    "sweet-medium-italian-hot": "Chocolate Lava Cake",
    "sweet-medium-italian-cold": "Panna Cotta",
    "sweet-medium-italian-room": "Cannoli",
    "sweet-medium-italian-any": "Tiramisu or Affogato",
    
    // Sweet - Medium - Asian
    "sweet-medium-asian-hot": "Warm Dorayaki",
    "sweet-medium-asian-cold": "Mango Sticky Rice",
    "sweet-medium-asian-room": "Matcha Cake",
    "sweet-medium-asian-any": "Red Bean Dessert",
    
    // Sweet - Medium - American
    "sweet-medium-american-hot": "Apple Pie",
    "sweet-medium-american-cold": "McCain Chocolate Cake",
    "sweet-medium-american-room": "Any Chocolate Cake",
    "sweet-medium-american-any": "Any Chocolate Cake",
    
    // Sweet - Medium - Mediterranean
    "sweet-medium-mediterranean-hot": "Kunafa",
    "sweet-medium-mediterranean-cold": "Muhallebi",
    "sweet-medium-mediterranean-room": "Basbousa",
    "sweet-medium-mediterranean-any": "Baklava Assortment",
    
    // Sweet - Very - Italian
    "sweet-very-italian-hot": "Tiramisu with Hot Espresso",
    "sweet-very-italian-cold": "Large Gelato Sundae",
    "sweet-very-italian-room": "Sfogliatelle Assortment",
    "sweet-very-italian-any": "Dessert Sampler Platter",
    
    // Sweet - Very - Asian
    "sweet-very-asian-hot": "Warm Taiyaki Set",
    "sweet-very-asian-cold": "Shaved Ice Dessert",
    "sweet-very-asian-room": "Mochi Variety Box",
    "sweet-very-asian-any": "Asian Dessert Sampler",
    
    // Sweet - Very - American
    "sweet-very-american-hot": "Chocolate Brownie Sundae",
    "sweet-very-american-cold": "McCain's Chocolate Cake",
    "sweet-very-american-room": "Cookie Platter",
    "sweet-very-american-any": "Dessert Trio",
    
    // Sweet - Very - Mediterranean
    "sweet-very-mediterranean-hot": "Warm Baklava with Honey",
    "sweet-very-mediterranean-cold": "Assorted Halva",
    "sweet-very-mediterranean-room": "Mixed Baklava Box",
    "sweet-very-mediterranean-any": "Middle Eastern Dessert Platter",
    
    // Sweet - Starving - Italian
    "sweet-starving-italian-hot": "Nutella Pizza",
    "sweet-starving-italian-cold": "Gelato Flight (6 flavors)",
    "sweet-starving-italian-room": "Italian Pastry Box",
    "sweet-starving-italian-any": "Everything Sweet from the Bakery!",
    
    // Sweet - Starving - Asian
    "sweet-starving-asian-hot": "Dessert Hot Pot",
    "sweet-starving-asian-cold": "Bingsu (Korean Shaved Ice)",
    "sweet-starving-asian-room": "Asian Dessert Box",
    "sweet-starving-asian-any": "All the Mochi + Bubble Tea",
    
    // Sweet - Starving - American
    "sweet-starving-american-hot": "Mega Chocolate Cake",
    "sweet-starving-american-cold": "McCain's Chocolate Cake (whole)",
    "sweet-starving-american-room": "Dessert Sampler for Two",
    "sweet-starving-american-any": "Every Dessert on the Menu!",
    
    // Sweet - Starving - Mediterranean
    "sweet-starving-mediterranean-hot": "Baklava Feast",
    "sweet-starving-mediterranean-cold": "Layali Lubnan",
    "sweet-starving-mediterranean-room": "Mixed Dessert Box",
    "sweet-starving-mediterranean-any": "Turkish Dessert Platter",

    // SAVORY MOOD
    // Savory - Snack - Italian
    "savory-snack-italian-hot": "Garlic Knots",
    "savory-snack-italian-cold": "Salami & Cheese Board",
    "savory-snack-italian-room": "Italian Bread with EVOO",
    "savory-snack-italian-any": "Fried Calamari",
    
    // Savory - Snack - Asian
    "savory-snack-asian-hot": "Potstickers or Gyoza",
    "savory-snack-asian-cold": "Sesame Noodles",
    "savory-snack-asian-room": "Spam Musubi",
    "savory-snack-asian-any": "Chicken Satay",
    
    // Savory - Snack - American
    "savory-snack-american-hot": "Buffalo Wings",
    "savory-snack-american-cold": "Deviled Eggs",
    "savory-snack-american-room": "Beef Jerky",
    "savory-snack-american-any": "Nachos",
    
    // Savory - Snack - Mediterranean
    "savory-snack-mediterranean-hot": "Cheese Sambousek",
    "savory-snack-mediterranean-cold": "Stuffed Grape Leaves",
    "savory-snack-mediterranean-room": "Za'atar Flatbread",
    "savory-snack-mediterranean-any": "Kibbeh",
    
    // Savory - Medium - Italian
    "savory-medium-italian-hot": "Spaghetti Bolognese",
    "savory-medium-italian-cold": "Antipasto Platter",
    "savory-medium-italian-room": "Prosciutto Panini",
    "savory-medium-italian-any": "Penne Arrabbiata",
    
    // Savory - Medium - Asian
    "savory-medium-asian-hot": "Mongolian Beef",
    "savory-medium-asian-cold": "Cold Sesame Noodles",
    "savory-medium-asian-room": "Chicken Katsu",
    "savory-medium-asian-any": "Kung Pao Chicken",
    
    // Savory - Medium - American
    "savory-medium-american-hot": "BBQ Chicken Sandwich",
    "savory-medium-american-cold": "Club Sandwich",
    "savory-medium-american-room": "Pulled Pork Sandwich",
    "savory-medium-american-any": "Chicken Tenders with Fries",
    
    // Savory - Medium - Mediterranean
    "savory-medium-mediterranean-hot": "Chicken Shawarma or Falafel",
    "savory-medium-mediterranean-cold": "Chicken Gyro",
    "savory-medium-mediterranean-room": "Kafta Wrap",
    "savory-medium-mediterranean-any": "Mixed Shawarma Plate",
    
    // Savory - Very - Italian
    "savory-very-italian-hot": "Osso Buco or Veal Parmesan",
    "savory-very-italian-cold": "Cold Italian Pasta Salad",
    "savory-very-italian-room": "Sausage & Peppers Sub",
    "savory-very-italian-any": "Chicken Cacciatore",
    
    // Savory - Very - Asian
    "savory-very-asian-hot": "Beef & Broccoli with Rice",
    "savory-very-asian-cold": "Sashimi Platter",
    "savory-very-asian-room": "Tonkatsu Curry",
    "savory-very-asian-any": "Peking Duck",
    
    // Savory - Very - American
    "savory-very-american-hot": "Ribeye Steak",
    "savory-very-american-cold": "Pastrami on Rye",
    "savory-very-american-room": "Meatloaf Sandwich",
    "savory-very-american-any": "Prime Rib Dinner",
    
    // Savory - Very - Mediterranean
    "savory-very-mediterranean-hot": "Grilled Lamb Kebabs",
    "savory-very-mediterranean-cold": "Cold Mezze Feast",
    "savory-very-mediterranean-room": "Lamb Kofta",
    "savory-very-mediterranean-any": "Mixed Grill with Hummus",
    
    // Savory - Starving - Italian
    "savory-starving-italian-hot": "Meat Lovers Pizza (XL)",
    "savory-starving-italian-cold": "Italian Cold Cut Platter",
    "savory-starving-italian-room": "Mega Meatball Sub",
    "savory-starving-italian-any": "Pasta + Pizza Combo",
    
    // Savory - Starving - Asian
    "savory-starving-asian-hot": "All-You-Can-Eat Korean BBQ",
    "savory-starving-asian-cold": "Sushi & Sashimi Boat",
    "savory-starving-asian-room": "Deluxe Bento Box",
    "savory-starving-asian-any": "Chinese Banquet Combo",
    
    // Savory - Starving - American
    "savory-starving-american-hot": "T-Bone Steak Dinner",
    "savory-starving-american-cold": "Deli Sandwich Platter",
    "savory-starving-american-room": "Double Burger Combo",
    "savory-starving-american-any": "Smokehouse Platter (Ribs + Brisket)",
    
    // Savory - Starving - Mediterranean
    "savory-starving-mediterranean-hot": "Royal Mixed Grill Feast",
    "savory-starving-mediterranean-cold": "Family Mezze Platter",
    "savory-starving-mediterranean-room": "Double Shawarma + Falafel Plate",
    "savory-starving-mediterranean-any": "Mediterranean Feast for Kings",
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate result
      const key = newAnswers.join('-');
      const suggestion = foodSuggestions[key] || foodSuggestions['default'];
      setResult(suggestion);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>What to Eat 🍽️</Text>
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultTitle}>Here's what you should eat:</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
            <Text style={styles.resetButtonText}>Start Over 🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backToMenuButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backToMenuButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>What to Eat 🍽️</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionEmoji}>🤔</Text>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentQuestion > 0 && (
          <TouchableOpacity 
            style={styles.backButtonQuiz} 
            onPress={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
          >
            <Text style={styles.backButtonQuizText}>← Previous Question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FF6F00',
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
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFE0B2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6F00',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  questionEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F57C00',
    flex: 1,
  },
  optionArrow: {
    fontSize: 20,
    color: '#FF6F00',
    fontWeight: '700',
  },
  backButtonQuiz: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  backButtonQuizText: {
    fontSize: 16,
    color: '#F57C00',
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 24,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  resultText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6F00',
    textAlign: 'center',
    lineHeight: 36,
  },
  resetButton: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  backToMenuButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backToMenuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    textAlign: 'center',
  },
});
