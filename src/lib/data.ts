import { Product, Category, Brand, Review } from './types';

const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech essentials', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', productCount: 25 },
  { id: 'cat-2', name: 'Clothing', slug: 'clothing', description: 'Trendy apparel for every occasion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', productCount: 20 },
  { id: 'cat-3', name: 'Home & Living', slug: 'home-living', description: 'Transform your living space', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', productCount: 18 },
  { id: 'cat-4', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear up for adventure', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b2e35?w=400&h=300&fit=crop', productCount: 15 },
  { id: 'cat-5', name: 'Beauty & Health', slug: 'beauty-health', description: 'Premium beauty and wellness products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', productCount: 12 },
  { id: 'cat-6', name: 'Books & Media', slug: 'books-media', description: 'Knowledge and entertainment', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop', productCount: 10 },
  { id: 'cat-7', name: 'Toys & Games', slug: 'toys-games', description: 'Fun for all ages', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop', productCount: 8 },
  { id: 'cat-8', name: 'Automotive', slug: 'automotive', description: 'Car accessories and parts', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop', productCount: 6 },
];

const BRANDS: Brand[] = [
  { id: 'brand-1', name: 'Apple', slug: 'apple', logo: '🍎' },
  { id: 'brand-2', name: 'Samsung', slug: 'samsung', logo: '📱' },
  { id: 'brand-3', name: 'Nike', slug: 'nike', logo: '✓' },
  { id: 'brand-4', name: 'Adidas', slug: 'adidas', logo: '🔺' },
  { id: 'brand-5', name: 'Sony', slug: 'sony', logo: '🎵' },
  { id: 'brand-6', name: 'Dyson', slug: 'dyson', logo: '🌀' },
  { id: 'brand-7', name: 'Bose', slug: 'bose', logo: '🔊' },
  { id: 'brand-8', name: 'North Face', slug: 'north-face', logo: '⛰️' },
  { id: 'brand-9', name: 'Levi\'s', slug: 'levis', logo: '👖' },
  { id: 'brand-10', name: 'Canon', slug: 'canon', logo: '📷' },
];

const PRODUCT_TEMPLATES: Omit<Product, 'id' | 'name' | 'slug' | 'price' | 'originalPrice' | 'discount' | 'rating' | 'reviewCount' | 'stock' | 'featured' | 'bestSeller' | 'isNew' | 'images' | 'category' | 'categorySlug' | 'brand' | 'tags' | 'specifications' | 'createdAt'>[] = [];

function generateProducts(): Product[] {
  const products: Product[] = [];
  const electronicsProducts = [
    { name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, specs: { Display: '6.7" Super Retina XDR', Chip: 'A17 Pro', Storage: '256GB', Camera: '48MP Triple' } },
    { name: 'MacBook Pro 16"', brand: 'Apple', price: 2499, specs: { Display: '16.2" Liquid Retina XDR', Chip: 'M3 Pro', RAM: '18GB', Storage: '512GB SSD' } },
    { name: 'iPad Air M2', brand: 'Apple', price: 599, specs: { Display: '11" Liquid Retina', Chip: 'M2', Storage: '128GB', Camera: '12MP' } },
    { name: 'AirPods Pro 2', brand: 'Apple', price: 249, specs: { Type: 'In-Ear', ANC: 'Active Noise Cancellation', Battery: '6 hours', Connectivity: 'Bluetooth 5.3' } },
    { name: 'Apple Watch Ultra 2', brand: 'Apple', price: 799, specs: { Display: '49mm Always-On', Battery: '36 hours', Water: '100m', GPS: 'Dual-frequency' } },
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 1299, specs: { Display: '6.8" Dynamic AMOLED', Chip: 'Snapdragon 8 Gen 3', Storage: '256GB', Camera: '200MP' } },
    { name: 'Samsung Galaxy Tab S9', brand: 'Samsung', price: 799, specs: { Display: '11" AMOLED', Chip: 'Snapdragon 8 Gen 2', Storage: '128GB', RAM: '8GB' } },
    { name: 'Samsung 55" OLED TV', brand: 'Samsung', price: 1799, specs: { Display: '55" 4K OLED', HDR: 'HDR10+', Refresh: '120Hz', Smart: 'Tizen OS' } },
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 349, specs: { Type: 'Over-Ear', ANC: 'Industry Leading', Battery: '30 hours', Driver: '30mm' } },
    { name: 'Sony Alpha A7 IV', brand: 'Sony', price: 2498, specs: { Sensor: '33MP Full-Frame', ISO: '100-51200', Video: '4K 60fps', Stabilization: '5-axis' } },
    { name: 'Canon EOS R6 Mark II', brand: 'Canon', price: 2499, specs: { Sensor: '24.2MP Full-Frame', ISO: '100-102400', Video: '4K 60fps', AF: 'Dual Pixel CMOS AF II' } },
    { name: 'Bose QuietComfort Ultra', brand: 'Bose', price: 429, specs: { Type: 'Over-Ear', ANC: 'CustomTune', Battery: '24 hours', Spatial: 'Immersive Audio' } },
    { name: 'Dyson V15 Detect', brand: 'Dyson', price: 749, specs: { Power: '230 AW', Battery: '60 minutes', Filtration: 'HEPA', Display: 'LCD Piezo' } },
    { name: 'Dyson Airwrap Multi-Styler', brand: 'Dyson', price: 599, specs: { Attachments: '6', Heat: 'Intelligent', Technology: 'Coanda Effect', Barrel: '1.2 & 1.6 inch' } },
    { name: 'PlayStation 5 Pro', brand: 'Sony', price: 699, specs: { GPU: '16.7 TFLOPS', Storage: '2TB SSD', Ray: 'Advanced RT', Resolution: '8K Support' } },
  ];

  const clothingProducts = [
    { name: 'Nike Air Max 97', brand: 'Nike', price: 175, specs: { Upper: 'Mesh & Synthetic', Sole: 'Air Max Cushioning', Style: 'Retro Runner', Fit: 'True to size' } },
    { name: 'Nike Dri-FIT Sportswear', brand: 'Nike', price: 65, specs: { Material: '100% Polyester', Technology: 'Dri-FIT', Fit: 'Regular', Care: 'Machine Wash' } },
    { name: 'Adidas Ultraboost 23', brand: 'Adidas', price: 190, specs: { Upper: 'Primeknit+', Midsole: 'BOOST', Outsole: 'Continental Rubber', Weight: '310g' } },
    { name: 'Adidas Originals Trefoil Hoodie', brand: 'Adidas', price: 80, specs: { Material: 'French Terry', Fit: 'Regular', Pockets: 'Kangaroo', Hood: 'Adjustable' } },
    { name: 'Levi\'s 501 Original Jeans', brand: 'Levi\'s', price: 69, specs: { Fit: 'Original', Rise: 'Mid', Wash: 'Stonewash', Material: '100% Cotton' } },
    { name: 'Levi\'s Trucker Jacket', brand: 'Levi\'s', price: 89, specs: { Material: 'Denim', Fit: 'Classic', Closure: 'Button', Pockets: '4' } },
    { name: 'North Face Nuptse 1996', brand: 'North Face', price: 330, specs: { Fill: '700-Fill Down', Water: 'DWR', Hood: 'Stowable', Weight: '540g' } },
    { name: 'North Face Resolve 3 Jacket', brand: 'North Face', price: 149, specs: { Material: 'DryVent', Water: 'Waterproof', Breathable: 'Yes', Hood: 'Attached' } },
    { name: 'Nike Air Force 1 \'07', brand: 'Nike', price: 110, specs: { Upper: 'Leather', Sole: 'Air-Sole', Style: 'Classic', Fit: 'True to size' } },
    { name: 'Adidas Samba OG', brand: 'Adidas', price: 100, specs: { Upper: 'Leather & Suede', Sole: 'Gum Rubber', Style: 'Classic', Fit: 'True to size' } },
    { name: 'Nike Tech Fleece Joggers', brand: 'Nike', price: 110, specs: { Material: 'Tech Fleece', Fit: 'Slim', Pockets: 'Zippered', Care: 'Machine Wash' } },
    { name: 'North Face Base Camp Duffel', brand: 'North Face', price: 165, specs: { Capacity: '71L', Material: 'Laminated Mesh', Water: 'Water Resistant', Straps: 'Detachable' } },
  ];

  const homeProducts = [
    { name: 'Smart LED Desk Lamp', brand: 'Dyson', price: 299, specs: { Lumens: '1000+', Color: '2700K-6500K', Smart: 'App Control', USB: 'Type-C Charging' } },
    { name: 'Dyson Pure Hot+Cool', brand: 'Dyson', price: 649, specs: { Type: 'Purifier + Heater + Fan', HEPA: 'H13', Coverage: '800 sq ft', Modes: '4' } },
    { name: 'Nespresso Vertuo Next', brand: 'Dyson', price: 179, specs: { Type: 'Capsule Espresso', Sizes: '5', Centrifusion: 'Yes', Tank: '37oz' } },
    { name: 'Marble Coffee Table', brand: 'Dyson', price: 449, specs: { Material: 'Marble Top', Base: 'Brass', Size: '48" x 24"', Weight: '55 lbs' } },
    { name: 'Ceramic Vase Set', brand: 'Dyson', price: 79, specs: { Pieces: '3', Material: 'Ceramic', Style: 'Minimalist', Sizes: 'S/M/L' } },
    { name: 'Linen Throw Blanket', brand: 'Dyson', price: 89, specs: { Material: '100% Linen', Size: '50" x 70"', Weight: 'Light', Care: 'Machine Wash' } },
    { name: 'Bamboo Shelf Unit', brand: 'Dyson', price: 199, specs: { Material: 'Bamboo', Shelves: '5', Size: '36" x 12" x 72"', Weight: '45 lbs' } },
    { name: 'Aromatherapy Diffuser', brand: 'Dyson', price: 59, specs: { Capacity: '300ml', Timer: '1/3/6 hrs', LED: '7 Colors', Auto: 'Shut-off' } },
  ];

  const sportsProducts = [
    { name: 'Yoga Mat Premium', brand: 'Nike', price: 79, specs: { Thickness: '6mm', Material: 'TPE', Size: '72 x 24 inches', 'Non-Slip': 'Yes' } },
    { name: 'Adjustable Dumbbell Set', brand: 'Nike', price: 349, specs: { Weight: '5-52.5 lbs each', Increments: '2.5 lbs', Pairs: '2', Storage: 'Tray Included' } },
    { name: 'Running Hydration Vest', brand: 'North Face', price: 149, specs: { Capacity: '6L', Water: '2 Soft Flasks', Pockets: '8', Weight: '280g' } },
    { name: 'Climbing Harness Pro', brand: 'North Face', price: 119, specs: { Type: 'Adjustable', Certification: 'CE/UIAA', Weight: '380g', Loops: '5 Gear' } },
    { name: 'Electric Mountain Bike', brand: 'North Face', price: 2499, specs: { Motor: '750W', Range: '50 miles', Suspension: 'Full', Brakes: 'Hydraulic Disc' } },
    { name: 'Camping Tent 4-Person', brand: 'North Face', price: 349, specs: { Capacity: '4 Person', Season: '3-Season', Weight: '7.5 lbs', Setup: 'Quick Pitch' } },
    { name: 'Bluetooth Fitness Tracker', brand: 'Samsung', price: 129, specs: { Display: '1.4 inch AMOLED', Battery: '10 days', Water: '5 ATM', GPS: 'Built-in' } },
    { name: 'Resistance Band Set', brand: 'Nike', price: 39, specs: { Bands: '5', Resistance: '10-50 lbs', Handles: 'Foam', Door: 'Anchor Included' } },
  ];

  const beautyProducts = [
    { name: 'Vitamin C Serum', brand: 'Dyson', price: 45, specs: { Size: '30ml', Concentration: '20%', Type: 'L-Ascorbic', pH: '3.0-3.5' } },
    { name: 'Retinol Night Cream', brand: 'Dyson', price: 55, specs: { Size: '50ml', Retinol: '0.5%', Type: 'Encapsulated', Usage: 'Night' } },
    { name: 'Hyaluronic Acid Moisturizer', brand: 'Dyson', price: 38, specs: { Size: '60ml', HA: 'Multi-weight', SPF: 'None', Usage: 'AM/PM' } },
    { name: 'Professional Hair Dryer', brand: 'Dyson', price: 429, specs: { Wattage: '1600W', Speed: '3', Heat: '4', Weight: '1.8 lbs' } },
    { name: 'Electric Facial Cleansing Brush', brand: 'Dyson', price: 99, specs: { Speeds: '2', Brush: 'Silicone', Waterproof: 'IPX7', Battery: 'USB-C' } },
    { name: 'Luxury Perfume Set', brand: 'Dyson', price: 189, specs: { Bottles: '4', Sizes: '10ml each', Type: 'Eau de Parfum', Packaging: 'Gift Box' } },
  ];

  const bookProducts = [
    { name: 'Atomic Habits', brand: 'Apple', price: 16, specs: { Author: 'James Clear', Pages: '320', Format: 'Hardcover', ISBN: '978-0735211292' } },
    { name: 'The Lean Startup', brand: 'Apple', price: 18, specs: { Author: 'Eric Ries', Pages: '336', Format: 'Hardcover', ISBN: '978-0307887894' } },
    { name: 'Deep Work', brand: 'Apple', price: 15, specs: { Author: 'Cal Newport', Pages: '296', Format: 'Paperback', ISBN: '978-1455586696' } },
    { name: 'Thinking, Fast and Slow', brand: 'Apple', price: 14, specs: { Author: 'Daniel Kahneman', Pages: '499', Format: 'Paperback', ISBN: '978-0374533557' } },
    { name: 'The Design of Everyday Things', brand: 'Apple', price: 17, specs: { Author: 'Don Norman', Pages: '368', Format: 'Hardcover', ISBN: '978-0465050659' } },
    { name: 'Zero to One', brand: 'Apple', price: 16, specs: { Author: 'Peter Thiel', Pages: '224', Format: 'Hardcover', ISBN: '978-0804139298' } },
  ];

  const toyProducts = [
    { name: 'LEGO Architecture Set', brand: 'Apple', price: 79, specs: { Pieces: '597', Age: '12+', Theme: 'Architecture', Scale: '1:200' } },
    { name: 'Strategy Board Game Collection', brand: 'Apple', price: 34, specs: { Players: '2-6', Time: '45-90 min', Age: '10+', Type: 'Strategy' } },
    { name: 'RC Drone Pro', brand: 'Samsung', price: 299, specs: { Range: '4km', Camera: '4K', Flight: '30 min', GPS: 'Yes' } },
    { name: 'Puzzle Cube Set', brand: 'Apple', price: 24, specs: { Pieces: '6 Pack', Difficulty: '3x3 to 7x7', Material: 'Stickerless', Smooth: 'Magnetic' } },
  ];

  const autoProducts = [
    { name: 'Dash Cam 4K', brand: 'Samsung', price: 149, specs: { Resolution: '4K', Viewing: '170°', Storage: 'up to 256GB', Night: 'Enhanced' } },
    { name: 'Car Phone Mount', brand: 'Apple', price: 29, specs: { Type: 'Magnetic', Compatible: 'Universal', Rotation: '360°', Mount: 'Dashboard/Vent' } },
    { name: 'Portable Jump Starter', brand: 'Samsung', price: 89, specs: { Peak: '2000A', Battery: '20000mAh', USB: 'Quick Charge 3.0', LED: 'Emergency' } },
    { name: 'LED Interior Light Kit', brand: 'Samsung', price: 39, specs: { Type: 'RGB LED', App: 'Bluetooth', Modes: '16M Colors', Install: 'Plug & Play' } },
    { name: 'Leather Seat Covers', brand: 'Apple', price: 129, specs: { Material: 'PU Leather', Fit: 'Universal', Set: 'Front + Rear', Color: 'Black' } },
  ];

  const allTemplates = [
    { items: electronicsProducts, category: 'Electronics', categorySlug: 'electronics' },
    { items: clothingProducts, category: 'Clothing', categorySlug: 'clothing' },
    { items: homeProducts, category: 'Home & Living', categorySlug: 'home-living' },
    { items: sportsProducts, category: 'Sports & Outdoors', categorySlug: 'sports-outdoors' },
    { items: beautyProducts, category: 'Beauty & Health', categorySlug: 'beauty-health' },
    { items: bookProducts, category: 'Books & Media', categorySlug: 'books-media' },
    { items: toyProducts, category: 'Toys & Games', categorySlug: 'toys-games' },
    { items: autoProducts, category: 'Automotive', categorySlug: 'automotive' },
  ];

  let id = 1;
  allTemplates.forEach(({ items, category, categorySlug }) => {
    items.forEach((item) => {
      const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 5 : 0;
      const originalPrice = discount > 0 ? Math.round(item.price / (1 - discount / 100)) : item.price;
      const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
      const reviewCount = Math.floor(Math.random() * 500) + 10;
      const stock = Math.floor(Math.random() * 100) + 5;
      const featured = Math.random() > 0.7;
      const bestSeller = Math.random() > 0.75;
      const isNew = Math.random() > 0.8;
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const imageBase = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const images = [
        `https://images.unsplash.com/photo-${1500000000000 + id * 137}?w=600&h=600&fit=crop`,
        `https://images.unsplash.com/photo-${1500000000000 + id * 137 + 1}?w=600&h=600&fit=crop`,
        `https://images.unsplash.com/photo-${1500000000000 + id * 137 + 2}?w=600&h=600&fit=crop`,
      ];

      products.push({
        id: `prod-${id}`,
        name: item.name,
        slug,
        description: `${item.name} delivers exceptional quality and performance. Crafted with premium materials and cutting-edge technology, this product represents the pinnacle of modern design and functionality. Whether you're a professional or an enthusiast, ${item.name} exceeds expectations with its innovative features and reliable construction. Experience the difference that quality makes with every use.`,
        shortDescription: `${item.name} - Premium quality with exceptional performance and modern design.`,
        price: item.price,
        originalPrice,
        discount,
        images,
        category,
        categorySlug,
        brand: item.brand,
        rating,
        reviewCount,
        stock,
        tags: [category.toLowerCase(), item.brand.toLowerCase(), ...(isNew ? ['new'] : []), ...(bestSeller ? ['best-seller'] : [])],
        featured,
        bestSeller,
        isNew,
        specifications: item.specs,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      });
      id++;
    });
  });

  return products;
}

function generateReviews(products: Product[]): Review[] {
  const reviewNames = ['Alex M.', 'Sarah K.', 'James L.', 'Emily R.', 'Michael T.', 'Jessica W.', 'David H.', 'Amanda P.', 'Chris B.', 'Nicole S.', 'Ryan D.', 'Megan F.', 'Tyler J.', 'Rachel G.', 'Brandon V.'];
  const reviewTitles = ['Excellent product!', 'Great value', 'Highly recommend', 'Impressive quality', 'Worth every penny', 'Solid choice', 'Love it', 'Best purchase', 'Very satisfied', 'Outstanding'];
  const reviewComments = [
    'Absolutely love this product! The quality is outstanding and it exceeded my expectations. Would definitely buy again.',
    'Great product for the price. Works exactly as described and the build quality is impressive. Shipping was fast too.',
    'I\'ve been using this for a month now and it\'s been fantastic. The attention to detail is remarkable.',
    'Solid product with great features. The design is sleek and modern. Very happy with my purchase.',
    'This is my second purchase and I\'m just as impressed. Consistent quality and great performance.',
    'Perfect for everyday use. The quality is premium and it looks even better in person than in photos.',
    'Impressive build quality and performance. The features are well thought out and everything works seamlessly.',
    'Great value for money. Comparable products cost much more but don\'t offer any additional benefits.',
    'The product arrived well-packaged and in perfect condition. Setup was easy and it works flawlessly.',
    'Exceeded my expectations in every way. The design is beautiful and the functionality is top-notch.',
  ];

  const reviews: Review[] = [];
  let reviewId = 1;
  products.forEach((product) => {
    const numReviews = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numReviews; i++) {
      reviews.push({
        id: `review-${reviewId++}`,
        productId: product.id,
        userId: `user-${Math.floor(Math.random() * 5) + 1}`,
        userName: reviewNames[Math.floor(Math.random() * reviewNames.length)],
        rating: Math.floor(Math.random() * 2) + 4,
        title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        helpful: Math.floor(Math.random() * 50),
      });
    }
  });
  return reviews;
}

const products = generateProducts();
const reviews = generateReviews(products);

export function getProducts(): Product[] {
  return products;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getBrands(): Brand[] {
  return BRANDS;
}

export function getReviews(): Review[] {
  return reviews;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellerProducts(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}
