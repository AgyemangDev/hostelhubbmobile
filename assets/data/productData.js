// src/data/productsData.js
export const products = [
  // Electronics & Gadgets
  {
    id: 1,
    name: "MacBook Pro 16-inch M4",
    category: "Electronics & Gadgets",
    description: "Apple's most powerful laptop with M4 chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life. Perfect for creative professionals and power users.",
    price: 2499,
    mainImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 142,
    reviews: [
      { reviewerName: "Sarah Chen", rating: 5, comment: "Incredible performance and build quality. The M4 chip handles everything I throw at it." },
      { reviewerName: "Mike Johnson", rating: 5, comment: "Best laptop I've ever owned. Display is stunning and battery life is amazing." },
      { reviewerName: "Emily Rodriguez", rating: 4, comment: "Expensive but worth it for professional video editing work." }
    ],
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    category: "Electronics & Gadgets",
    description: "The latest iPhone with A18 Pro chip, advanced camera system with 5x telephoto zoom, and titanium design. Available in Natural Titanium, Blue Titanium, White Titanium, and Black Titanium.",
    price: 1199,
    mainImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1695048071775-b5dc46348c18?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592286349480-9c4fce6f3d5e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 523,
    reviews: [
      { reviewerName: "Alex Kim", rating: 5, comment: "Camera quality is unmatched. The titanium build feels premium." },
      { reviewerName: "Jessica Taylor", rating: 5, comment: "Lightning fast performance and the battery lasts all day." },
      { reviewerName: "David Park", rating: 4, comment: "Great phone but very expensive. Camera system is incredible though." }
    ],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Electronics & Gadgets",
    description: "Industry-leading noise canceling wireless headphones with exceptional sound quality, 30-hour battery life, and crystal-clear call quality.",
    price: 399,
    mainImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 89,
    reviews: [
      { reviewerName: "Rachel Wong", rating: 5, comment: "Best noise canceling headphones I've ever used. Sound quality is incredible." },
      { reviewerName: "Tom Anderson", rating: 4, comment: "Great for travel and work. Comfortable to wear for hours." }
    ],
  },

  // Apparel & Fashion
  {
    id: 4,
    name: "Nike Air Jordan 4 Retro",
    category: "Apparel & Fashion",
    description: "Classic basketball sneakers with premium leather upper, visible Air-Sole unit, and iconic Jordan design. A streetwear essential that never goes out of style.",
    price: 210,
    mainImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 267,
    reviews: [
      { reviewerName: "Marcus Thompson", rating: 5, comment: "Perfect fit and classic style. Goes with everything." },
      { reviewerName: "Lisa Chen", rating: 5, comment: "Love these shoes! Comfortable and stylish." },
      { reviewerName: "Jason Lee", rating: 4, comment: "Quality is great but runs a bit small. Size up half a size." }
    ],
  },
  {
    id: 5,
    name: "Supreme Box Logo Hoodie",
    category: "Apparel & Fashion",
    description: "Iconic streetwear hoodie from Supreme featuring the classic box logo. Made from premium cotton fleece with a comfortable fit. Limited edition colorway.",
    price: 168,
    mainImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799139834-6b8f844fef02?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 156,
    reviews: [
      { reviewerName: "Tyler Johnson", rating: 5, comment: "Perfect quality and fit. Classic Supreme piece." },
      { reviewerName: "Ashley Kim", rating: 5, comment: "Love the oversized fit and soft material." }
    ],
  },
  {
    id: 6,
    name: "Levi's 501 Original Jeans",
    category: "Apparel & Fashion",
    description: "The original straight fit jean. Crafted with premium denim and classic 5-pocket styling. A timeless wardrobe staple that gets better with every wear.",
    price: 89,
    mainImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 324,
    reviews: [
      { reviewerName: "Emma Wilson", rating: 5, comment: "Perfect classic jeans. Great fit and quality denim." },
      { reviewerName: "Ryan Martinez", rating: 4, comment: "Good quality but takes time to break in. Worth the wait." }
    ],
  },

  // Health & Fitness
  {
    id: 7,
    name: "Theragun PRO Plus",
    category: "Health & Fitness",
    description: "Professional-grade percussive therapy device with smart app integration, 6 attachments, and up to 2.5 hours battery life. Perfect for muscle recovery and pain relief.",
    price: 599,
    mainImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594737626072-90dc274bc2c4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 78,
    reviews: [
      { reviewerName: "fitness_coach_sarah", rating: 5, comment: "Game changer for recovery. Use it daily on my clients." },
      { reviewerName: "Mark Stevens", rating: 5, comment: "Expensive but worth every penny. Helps with chronic back pain." }
    ],
  },
  {
    id: 8,
    name: "Peloton Bike+",
    category: "Health & Fitness",
    description: "Smart exercise bike with rotating 23.8\" HD touchscreen, auto-follow resistance, and access to thousands of live and on-demand classes.",
    price: 2495,
    mainImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593476087123-36d1de271f08?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 45,
    reviews: [
      { reviewerName: "Jennifer Adams", rating: 5, comment: "Best investment for home fitness. Instructors are amazing!" },
      { reviewerName: "Chris Miller", rating: 4, comment: "Great bike but monthly subscription is pricey." }
    ],
  },

  // Hostel & Lifestyle Essentials
  {
    id: 9,
    name: "Dyson V15 Detect",
    category: "Hostel & Lifestyle Essentials",
    description: "Powerful cordless vacuum with laser dust detection, intelligent suction, and up to 60 minutes run time. Perfect for deep cleaning any space.",
    price: 749,
    mainImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 67,
    reviews: [
      { reviewerName: "Hannah Taylor", rating: 5, comment: "Amazing suction power and the laser feature is so cool!" },
      { reviewerName: "Robert Kim", rating: 4, comment: "Expensive but worth it. Makes cleaning so much easier." }
    ],
  },
  {
    id: 10,
    name: "Ninja Foodi Personal Blender",
    category: "Hostel & Lifestyle Essentials",
    description: "Compact personal blender perfect for smoothies, protein shakes, and single-serve portions. BPA-free cups and dishwasher-safe parts.",
    price: 79,
    mainImage: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585515656142-8a77a59bc135?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"
    ],
    orderedCount: 234,
    reviews: [
      { reviewerName: "Maria Rodriguez", rating: 5, comment: "Perfect for my dorm room! Makes great smoothies." },
      { reviewerName: "Jake Wilson", rating: 4, comment: "Good value for money. Easy to clean and store." }
    ],
  }
];