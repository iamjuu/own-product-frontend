// Master Product Catalog with detailed specs, nutrition, gallery images, and reviews (Prices in INR ₹)
export const masterProducts = [
  // -------------------------------------------------------------
  // CHICKEN / POULTRY
  // -------------------------------------------------------------
  {
    id: 'prod-chk-2',
    aliases: ['shop-chk-3', 'chk-2', 'whole-tender-spring-chicken-1200g'],
    name: 'Whole Tender Spring Chicken (1.2 kg)',
    category: 'CHICKEN',
    categoryLabel: 'Farm Poultry',
    price: 260.00,
    originalPrice: 320.00,
    discount: '-19%',
    rating: 5.0,
    reviewsCount: 148,
    inStock: true,
    stockCount: 24,
    sku: 'CHK-SPR-1200',
    weight: '1.2 kg (Oven-ready)',
    servings: '3 - 4 Persons',
    shelfLife: '3 Days refrigerated (0-4°C)',
    origin: 'Locally Farmed (Free-Range)',
    halalCertified: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Cleaned, dressed, and oven-ready tender farm chicken ideal for whole roasting, biryanis, and tandoori specials. Sourced exclusively from certified humane, antibiotic-free poultry farms.',
    highlights: [
      '100% Hand-Slaughtered Halal Certified',
      'No added hormones, chemical washes, or preservatives',
      'Gutted, de-feathered, skin-on and ready to cook immediately',
      'Chilled in food-grade vacuum packing for maximum freshness'
    ],
    nutrition: {
      servingSize: '100g',
      calories: '215 kcal',
      protein: '27.3g',
      fats: '11.2g',
      carbs: '0g',
      iron: '8% DV',
      sodium: '75mg'
    },
    storageGuide: 'Keep refrigerated between 0°C to 4°C. Consume within 72 hours of delivery. For extended storage, freeze immediately at -18°C for up to 3 months.',
    cookingTips: 'Rub with butter, crushed garlic, spices, and sea salt. Roast at 200°C for 50-60 minutes until juicy and internal temp reaches 74°C.',
    reviews: [
      {
        id: 'rev-1',
        author: 'Farhan Akhtar',
        date: 'Yesterday',
        rating: 5,
        title: 'Perfect for Sunday roast!',
        comment: 'Extremely fresh and tender. Arrived ice-cold within 20 minutes of placing the order. Cleaned thoroughly with zero foul odor.'
      },
      {
        id: 'rev-2',
        author: 'Amina Begum',
        date: '3 days ago',
        rating: 5,
        title: 'Juicy and authentic halal cut',
        comment: 'Made butter chicken curry and roast chicken with this. The meat was remarkably juicy and tender. Will definitely reorder.'
      }
    ]
  },
  {
    id: 'prod-chk-1',
    aliases: ['shop-chk-1', 'chk-1', 'fresh-farm-chicken-breast-fillet-1kg'],
    name: 'Fresh Farm Chicken Breast Fillet (1 kg)',
    category: 'CHICKEN',
    categoryLabel: 'Farm Poultry',
    price: 290.00,
    originalPrice: 360.00,
    discount: '-19%',
    rating: 5.0,
    reviewsCount: 210,
    inStock: true,
    stockCount: 38,
    sku: 'CHK-BRS-1000',
    weight: '1 kg (4-5 Fillets)',
    servings: '4 - 5 Persons',
    shelfLife: '3 Days refrigerated (0-4°C)',
    origin: 'Locally Farmed (Grain-Fed)',
    halalCertified: true,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Skinless, boneless halal chicken breast cut fresh daily and vacuum sealed. Ultra-lean high protein cuts ideal for gym diet meal prep, grilling, and salads.',
    highlights: [
      '100% Halal Certified & Hormone Free',
      'Zero skin, trimmed fat, boneless cuts',
      'Rich in lean protein, low saturated fat',
      'Delivered chilled, never frozen'
    ],
    nutrition: {
      servingSize: '100g',
      calories: '165 kcal',
      protein: '31g',
      fats: '3.6g',
      carbs: '0g',
      iron: '6% DV',
      sodium: '70mg'
    },
    storageGuide: 'Store at 0°C to 4°C. Cook within 3 days or store in freezer at -18°C.',
    cookingTips: 'Pan-sear on medium-high heat with garlic butter for 5-6 minutes per side. Do not overcook to maintain tenderness.',
    reviews: []
  },
  {
    id: 'prod-chk-3',
    aliases: ['shop-chk-2', 'chk-3', 'tender-chicken-drumsticks-800g'],
    name: 'Tender Chicken Drumsticks (800g)',
    category: 'CHICKEN',
    categoryLabel: 'Farm Poultry',
    price: 220.00,
    originalPrice: 280.00,
    discount: '-21%',
    rating: 5.0,
    reviewsCount: 88,
    inStock: true,
    stockCount: 30,
    sku: 'CHK-DRM-800',
    weight: '800g (Approx 6 Pcs)',
    servings: '3 - 4 Persons',
    shelfLife: '3 Days refrigerated',
    origin: 'Locally Farmed',
    halalCertified: true,
    badge: 'Grill Special',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Juicy chicken drumsticks trimmed of excess fat, perfect for tandoori marinades, biryani, and crispy fried chicken.',
    highlights: ['Skin-on succulent bone-in meat', '100% Halal Hand-Cut', 'Free from chemical baths'],
    nutrition: { servingSize: '100g', calories: '172 kcal', protein: '28g', fats: '5.7g', carbs: '0g' },
    storageGuide: 'Keep refrigerated between 0°C to 4°C.',
    cookingTips: 'Marinate with yogurt, ginger-garlic paste, and tandoori spices for 2 hours before roasting.',
    reviews: []
  },

  // -------------------------------------------------------------
  // FISH & SEAFOOD
  // -------------------------------------------------------------
  {
    id: 'prod-fsh-1',
    aliases: ['shop-fsh-1', 'fsh-1', 'fresh-atlantic-salmon-fillet-500g'],
    name: 'Fresh Atlantic Salmon Fillet (500g)',
    category: 'FISH',
    categoryLabel: 'Wild Seafood',
    price: 480.00,
    originalPrice: 600.00,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 182,
    inStock: true,
    stockCount: 16,
    sku: 'FSH-SLM-500',
    weight: '500g (Skin-on Portions)',
    servings: '2 - 3 Persons',
    shelfLife: '2 Days refrigerated (0-2°C)',
    origin: 'North Atlantic (Sustainable Catch)',
    halalCertified: true,
    badge: 'Premium Catch',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Rich in healthy Omega-3 fatty acids, sushi-grade pink salmon with pristine skin-on fillet. Hand-cut and de-boned by master fishmongers.',
    highlights: [
      'High in Heart-Healthy Omega-3 (EPA & DHA)',
      'Sushi & Sashimi Grade Freshness',
      'Descaled and pin-bones meticulously removed',
      'Cold-chain express delivered with thermo-insulated ice padding'
    ],
    nutrition: {
      servingSize: '100g',
      calories: '208 kcal',
      protein: '22g',
      fats: '13g',
      carbs: '0g',
      omega3: '2.5g',
      sodium: '60mg'
    },
    storageGuide: 'Keep between 0°C to 2°C on crushed ice or coldest part of refrigerator.',
    cookingTips: 'Crisp skin down in hot skillet with olive oil for 4 minutes, flip and baste with lemon butter for 2 minutes.',
    reviews: []
  },
  {
    id: 'prod-fsh-2',
    aliases: ['shop-fsh-2', 'fsh-2', 'jumbo-sea-tiger-prawns-500g'],
    name: 'Jumbo Sea Tiger Prawns (500g)',
    category: 'FISH',
    categoryLabel: 'Wild Seafood',
    price: 420.00,
    originalPrice: 520.00,
    discount: '-19%',
    rating: 5.0,
    reviewsCount: 94,
    inStock: true,
    stockCount: 19,
    sku: 'FSH-PRW-500',
    weight: '500g (Approx 12-15 Pcs)',
    servings: '2 - 3 Persons',
    shelfLife: '2 Days refrigerated',
    origin: 'Coastal Waters (Wild Caught)',
    halalCertified: true,
    badge: 'Chef Favorite',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Succulent, deveined jumbo sea prawns perfect for garlic butter sauté, barbecue skewers, or fragrant curries.',
    highlights: ['Deveined and peeled tail-on', 'Wild sea catch with sweet firm meat', 'Zero chemical glazing or soaking'],
    nutrition: { servingSize: '100g', calories: '99 kcal', protein: '24g', fats: '0.3g', carbs: '0.2g', sodium: '110mg' },
    storageGuide: 'Store at 0°C to 2°C. Cook within 2 days.',
    cookingTips: 'Sauté in garlic and olive oil for 3-4 minutes until opaque pink.',
    reviews: []
  },
  {
    id: 'prod-fsh-3',
    aliases: ['shop-fsh-3', 'fsh-3', 'whole-silver-pomfret-cleaned-600g'],
    name: 'Whole Silver Pomfret (Cleaned 600g)',
    category: 'FISH',
    categoryLabel: 'Wild Seafood',
    price: 350.00,
    originalPrice: 450.00,
    discount: '-22%',
    rating: 4.8,
    reviewsCount: 65,
    inStock: true,
    stockCount: 15,
    sku: 'FSH-PMF-600',
    weight: '600g (2-3 Pcs Cleaned)',
    servings: '2 - 3 Persons',
    shelfLife: '2 Days refrigerated',
    origin: 'Arabian Sea',
    halalCertified: true,
    badge: 'Fresh Catch',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80'],
    description: 'Delicate white meat silver pomfret, scaled and gutted, prime for crispy rava fry, tandoori grill, or coconut curry.',
    highlights: ['Cleaned, scaled and gutted', 'Soft white delicate flakes', 'Express fresh morning arrival'],
    nutrition: { servingSize: '100g', calories: '102 kcal', protein: '19g', fats: '2.5g', carbs: '0g' },
    storageGuide: 'Keep on crushed ice in refrigerator at 0°C to 2°C.',
    cookingTips: 'Coat with turmeric, red chilli paste, lemon juice, and semolina. Shallow fry on medium heat.',
    reviews: []
  },

  // -------------------------------------------------------------
  // VEGETABLES
  // -------------------------------------------------------------
  {
    id: 'prod-veg-1',
    aliases: ['shop-veg-1', 'veg-1', 'organic-vine-red-tomatoes-1kg'],
    name: 'Organic Vine Red Tomatoes (1 kg)',
    category: 'VEGETABLES',
    categoryLabel: 'Farm Produce',
    price: 48.00,
    originalPrice: 60.00,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 135,
    inStock: true,
    stockCount: 45,
    sku: 'VEG-TOM-1000',
    weight: '1 kg (Approx 8-10 Tomatoes)',
    servings: 'Family pack',
    shelfLife: '5-7 Days ambient/chilled',
    origin: 'Hydroponic Organic Farm',
    halalCertified: true,
    badge: 'Farm Fresh',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Freshly harvested vine-ripened red tomatoes rich in lycopene, vitamin C, and natural sweetness. Grown without synthetic pesticides.',
    highlights: ['Harvested at peak vine ripeness', 'Rich in antioxidant Lycopene & Vitamin C', 'Juicy and sweet for salads and curries'],
    nutrition: { servingSize: '100g', calories: '18 kcal', protein: '0.9g', fats: '0.2g', carbs: '3.9g', sodium: '5mg' },
    storageGuide: 'Store at room temperature away from direct sunlight. Refrigerate once fully ripe.',
    cookingTips: 'Perfect for fresh salads, bruschetta, or slow-simmered rich curries.',
    reviews: []
  },
  {
    id: 'prod-veg-2',
    aliases: ['shop-veg-2', 'veg-2', 'crisp-garden-broccoli-head-500g'],
    name: 'Crisp Garden Broccoli Head (500g)',
    category: 'VEGETABLES',
    categoryLabel: 'Farm Produce',
    price: 85.00,
    originalPrice: 110.00,
    discount: '-22%',
    rating: 5.0,
    reviewsCount: 92,
    inStock: true,
    stockCount: 30,
    sku: 'VEG-BRC-500',
    weight: '500g (Fresh Head)',
    servings: '3 - 4 Servings',
    shelfLife: '4-5 Days chilled',
    origin: 'Highland Farms',
    halalCertified: true,
    badge: 'Healthy Choice',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'],
    description: 'Tender florets and crunchy stalks packed with dietary fiber, sulforaphane, and essential antioxidants.',
    highlights: ['Crisp green compact florets', 'Rich in dietary fiber and Vitamin K'],
    nutrition: { servingSize: '100g', calories: '34 kcal', protein: '2.8g', fats: '0.4g', carbs: '6.6g', sodium: '33mg' },
    storageGuide: 'Refrigerate in breathable produce bag.',
    cookingTips: 'Steam for 4 minutes for vibrant color and crunch.',
    reviews: []
  },
  {
    id: 'prod-veg-3',
    aliases: ['shop-veg-3', 'veg-3', 'fresh-farm-carrots-bundle-1kg'],
    name: 'Fresh Farm Carrots Bundle (1 kg)',
    category: 'VEGETABLES',
    categoryLabel: 'Farm Produce',
    price: 45.00,
    originalPrice: 60.00,
    discount: '-25%',
    rating: 4.8,
    reviewsCount: 74,
    inStock: true,
    stockCount: 40,
    sku: 'VEG-CRT-1000',
    weight: '1 kg',
    servings: 'Family pack',
    shelfLife: '7-10 Days refrigerated',
    origin: 'Ooty Hills',
    halalCertified: true,
    badge: 'Farm Direct',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=800&auto=format&fit=crop&q=80'],
    description: 'Crunchy sweet farm carrots freshly pulled and washed, rich in beta-carotene and essential vitamins.',
    highlights: ['Crisp, naturally sweet root harvest', 'High in Vitamin A and dietary fiber'],
    nutrition: { servingSize: '100g', calories: '41 kcal', protein: '0.9g', fats: '0.2g', carbs: '9.6g' },
    storageGuide: 'Refrigerate in crisper drawer.',
    cookingTips: 'Enjoy raw as snacks, grated in salads, or cooked in hearty stews and halwa.',
    reviews: []
  },
  {
    id: 'prod-veg-4',
    aliases: ['shop-veg-4', 'veg-4', 'tricolor-bell-peppers-trio-3pcs'],
    name: 'Tricolor Bell Peppers Trio (3 pcs)',
    category: 'VEGETABLES',
    categoryLabel: 'Farm Produce',
    price: 75.00,
    originalPrice: 95.00,
    discount: '-21%',
    rating: 4.9,
    reviewsCount: 52,
    inStock: true,
    stockCount: 25,
    sku: 'VEG-CAP-3PC',
    weight: 'Approx 450g (3 Pcs)',
    servings: '3-4 Servings',
    shelfLife: '5-7 Days refrigerated',
    origin: 'Greenhouse Cultivation',
    halalCertified: true,
    badge: 'Premium Produce',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80'],
    description: 'Set of vibrant red, yellow, and green bell peppers ideal for stir-fries, fajitas, pizza toppings, and salads.',
    highlights: ['Thick, juicy walls with sweet flavor', 'Loaded with Vitamin C and carotenoids'],
    nutrition: { servingSize: '100g', calories: '26 kcal', protein: '1g', fats: '0.3g', carbs: '6g' },
    storageGuide: 'Keep refrigerated in crisper.',
    cookingTips: 'Sauté on high heat with olive oil or roast over open flame for smoky dips.',
    reviews: []
  },

  // -------------------------------------------------------------
  // BEEF / PRIME MEAT
  // -------------------------------------------------------------
  {
    id: 'prod-bef-1',
    aliases: ['shop-bef-1', 'prod-bf-1', 'bef-1', 'halal-prime-angus-beef-steak-800g'],
    name: 'Halal Prime Angus Beef Steak (800g)',
    category: 'BEEF',
    categoryLabel: 'Prime Halal Meat',
    price: 460.00,
    originalPrice: 580.00,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 164,
    inStock: true,
    stockCount: 15,
    sku: 'BEF-STK-800',
    weight: '800g (2 Thick Steaks)',
    servings: '2 - 3 Persons',
    shelfLife: '3 Days refrigerated',
    origin: 'Pasture Raised (Grass-Fed)',
    halalCertified: true,
    badge: 'Premium Cut',
    image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Grass-fed marbled halal beef cuts with exceptional tenderness and deep flavor. Aged for 21 days for maximum richness.',
    highlights: ['100% Halal Certified Slaughter', 'Natural fine marbling for supreme tenderness', 'No antibiotics or growth hormones'],
    nutrition: { servingSize: '100g', calories: '250 kcal', protein: '26g', fats: '15g', carbs: '0g', sodium: '65mg' },
    storageGuide: 'Keep at 0°C to 4°C. Cook within 3 days or freeze.',
    cookingTips: 'Sear on cast iron skillet for 3 mins each side with rosemary and butter for medium-rare.',
    reviews: []
  },
  {
    id: 'prod-bef-2',
    aliases: ['shop-bef-2', 'prod-bf-2', 'bef-2', 'lean-minced-beef-keema-1kg'],
    name: 'Lean Minced Beef Keema (1 kg)',
    category: 'BEEF',
    categoryLabel: 'Prime Halal Meat',
    price: 340.00,
    originalPrice: 420.00,
    discount: '-19%',
    rating: 5.0,
    reviewsCount: 110,
    inStock: true,
    stockCount: 22,
    sku: 'BEF-MIN-1000',
    weight: '1 kg (Vacuum pack)',
    servings: '4 - 5 Persons',
    shelfLife: '2 Days refrigerated',
    origin: 'Grass-Fed Halal Cattle',
    halalCertified: true,
    badge: 'High Protein',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'],
    description: 'Freshly ground lean beef with less than 10% fat for succulent kebabs, patties, and pasta sauces.',
    highlights: ['Double ground for ultra-fine texture', '90% Lean 10% Fat ratio'],
    nutrition: { servingSize: '100g', calories: '215 kcal', protein: '24g', fats: '12g', carbs: '0g', sodium: '70mg' },
    storageGuide: 'Keep at 0°C to 4°C.',
    cookingTips: 'Great for bolognese, shami kebabs, and stuffed pastries.',
    reviews: []
  },

  // -------------------------------------------------------------
  // GROCERY & PANTRY
  // -------------------------------------------------------------
  {
    id: 'prod-gro-1',
    aliases: ['shop-gro-1', 'gro-1', 'organic-wildflower-honey-jar-500g'],
    name: 'Organic Wildflower Honey Jar (500g)',
    category: 'GROCERY',
    categoryLabel: 'Pantry & Organic',
    price: 240.00,
    originalPrice: 300.00,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 240,
    inStock: true,
    stockCount: 50,
    sku: 'GRO-HNY-500',
    weight: '500g Glass Jar',
    servings: '25 Servings',
    shelfLife: '24 Months',
    origin: 'Himalayan Foothills',
    halalCertified: true,
    badge: 'Organic Certified',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Raw unfiltered mountain honey harvested straight from natural hives with natural pollen and antioxidants.',
    highlights: ['100% Pure, unpasteurized honey', 'No artificial sugar syrups or additives'],
    nutrition: { servingSize: '20g (1 Tbsp)', calories: '64 kcal', protein: '0.1g', fats: '0g', carbs: '17g', sodium: '1mg' },
    storageGuide: 'Store at room temperature.',
    cookingTips: 'Drizzle over warm toast, oatmeal, herbal tea, or salad dressings.',
    reviews: []
  },
  {
    id: 'prod-gro-2',
    aliases: ['shop-gro-2', 'gro-2', 'royal-aged-basmati-rice-5kg-bag'],
    name: 'Royal Aged Basmati Rice (5 kg Bag)',
    category: 'GROCERY',
    categoryLabel: 'Pantry & Grains',
    price: 360.00,
    originalPrice: 450.00,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 175,
    inStock: true,
    stockCount: 35,
    sku: 'GRO-RIC-5000',
    weight: '5 kg Bag',
    servings: '50 Servings',
    shelfLife: '18 Months',
    origin: 'Punjab River Valleys',
    halalCertified: true,
    badge: 'Aged 2 Years',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'],
    description: 'Extra long grain aromatic basmati aged for 2 years for non-sticky fluffy rice, rich aroma, and elongation.',
    highlights: ['Aged 2 years for optimum grain length', 'Signature natural aroma'],
    nutrition: { servingSize: '100g (dry)', calories: '350 kcal', protein: '7.5g', fats: '0.5g', carbs: '78g', sodium: '5mg' },
    storageGuide: 'Store in airtight dry container in cool dark pantry.',
    cookingTips: 'Soak grains in cold water for 30 minutes before boiling in 1:2 ratio water.',
    reviews: []
  },
  {
    id: 'prod-gro-3',
    aliases: ['shop-gro-3', 'gro-3', 'cold-pressed-virgin-olive-oil-1l'],
    name: 'Cold Pressed Virgin Olive Oil (1 Liter)',
    category: 'GROCERY',
    categoryLabel: 'Pantry & Oils',
    price: 280.00,
    originalPrice: 350.00,
    discount: '-20%',
    rating: 4.9,
    reviewsCount: 120,
    inStock: true,
    stockCount: 40,
    sku: 'GRO-OIL-1000',
    weight: '1 Litre Glass Bottle',
    servings: '65 Servings',
    shelfLife: '18 Months',
    origin: 'Mediterranean Orchards',
    halalCertified: true,
    badge: 'Cold Pressed',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'],
    description: 'First cold-pressed extra virgin olive oil with low acidity, golden green hue, and rich peppery herbal finish.',
    highlights: ['Single estate cold extraction', 'Rich in polyphenols and healthy monounsaturated fats'],
    nutrition: { servingSize: '15ml (1 Tbsp)', calories: '120 kcal', fats: '14g', protein: '0g', carbs: '0g' },
    storageGuide: 'Store in cool dry cupboard away from stovetop heat and direct light.',
    cookingTips: 'Ideal for dressings, drizzling on dips, and light pan sautéing.',
    reviews: []
  }
];

// Helper to look up a product by ID or alias
export const getProductById = (rawId) => {
  if (!rawId) return masterProducts[0];
  const normalized = String(rawId).trim().toLowerCase();

  const found = masterProducts.find((p) => {
    if (p.id.toLowerCase() === normalized) return true;
    if (p.aliases && p.aliases.some((a) => a.toLowerCase() === normalized)) return true;
    if (normalized.includes(p.id.toLowerCase())) return true;
    return false;
  });

  if (found) return found;

  const keywordMatch = masterProducts.find((p) => 
    p.name.toLowerCase().includes(normalized) ||
    normalized.includes(p.name.toLowerCase()) ||
    p.category.toLowerCase() === normalized
  );

  return keywordMatch || masterProducts[0];
};

// Helper to get related products
export const getRelatedProducts = (category, excludeId) => {
  const normalizedCategory = category?.toUpperCase();
  const sameCategory = masterProducts.filter(
    (p) => p.category === normalizedCategory && p.id !== excludeId
  );
  if (sameCategory.length >= 3) return sameCategory.slice(0, 4);

  const others = masterProducts.filter((p) => p.id !== excludeId && !sameCategory.includes(p));
  return [...sameCategory, ...others].slice(0, 4);
};
