require('dotenv').config()

const fs = require('fs')
const path = require('path')
const https = require('https')
const mongoose = require('mongoose')

const connectDB = require('./config/db')
const uploadToCloudinary = require('./utils/uploadToCloudinary')

const User = require('./models/User')
const Seller = require('./models/Seller')
const Category = require('./models/Category')
const Product = require('./models/Product')
const Cart = require('./models/Cart')
const Order = require('./models/Order')
const Payment = require('./models/Payment')

const imagesDir = path.join(__dirname, 'images')

const imageSources = {
  laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80&auto=format&fit=crop',

  headphones:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop',

  keyboard:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80&auto=format&fit=crop',

  mouse:
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80&auto=format&fit=crop',

  backpacks:
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80&auto=format&fit=crop',

  computerMice:
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1200&q=80&auto=format&fit=crop'
}

const downloadImage = (url, filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log(`Image already exists: ${path.basename(filePath)}`)
      return resolve()
    }

    const request = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Shopivo-Seed/1.0',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          Referer: 'https://unsplash.com/'
        }
      },
      response => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume()

          return downloadImage(
            new URL(response.headers.location, url).toString(),
            filePath
          )
            .then(resolve)
            .catch(reject)
        }

        if (response.statusCode !== 200) {
          response.resume()

          return reject(
            new Error(
              `Failed to download ${url}. Status: ${response.statusCode}`
            )
          )
        }

        const file = fs.createWriteStream(filePath)

        response.pipe(file)

        file.on('finish', () => {
          file.close(resolve)
        })

        file.on('error', error => {
          file.close()

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }

          reject(error)
        })
      }
    )

    request.on('error', error => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      reject(error)
    })
  })
}

const prepareImages = async () => {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  console.log('\nDownloading images...\n')

  for (const [name, url] of Object.entries(imageSources)) {
    const filePath = path.join(imagesDir, `${name}.jpg`)

    await downloadImage(url, filePath)

    console.log(`Ready: ${name}.jpg`)
  }
}

const uploadImage = async fileName => {
  const filePath = path.join(imagesDir, fileName)
  const buffer = fs.readFileSync(filePath)

  const result = await uploadToCloudinary(buffer)

  return result.secure_url
}

const uploadImages = async () => {
  console.log('\nUploading images to Cloudinary...\n')

  const imageUrls = {}

  for (const fileName of [
    'laptop.jpg',
    'headphones.jpg',
    'keyboard.jpg',
    'mouse.jpg',
    'backpacks.jpg',
    'computerMice.jpg'
  ]) {
    const key = path.parse(fileName).name

    imageUrls[key] = await uploadImage(fileName)

    console.log(`Uploaded: ${fileName}`)
  }

  return imageUrls
}

const createUsers = async () => {
  const admin = await User.create({
    name: 'Shopivo Admin',
    email: 'admin@shopivo.com',
    password: 'Admin@12345',
    role: 'admin'
  })

  const sellerUsers = await User.create([
    {
      name: 'Ali Raza',
      email: 'ali@techhub.com',
      password: 'Seller@12345',
      role: 'seller'
    },
    {
      name: 'Hamza Khan',
      email: 'hamza@gadgetzone.com',
      password: 'Seller@12345',
      role: 'seller'
    },
    {
      name: 'Usman Ahmed',
      email: 'usman@urbanstore.com',
      password: 'Seller@12345',
      role: 'seller'
    }
  ])

  const buyers = await User.create([
    {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: 'Buyer@12345',
      role: 'buyer'
    },
    {
      name: 'Bilal Shah',
      email: 'bilal@example.com',
      password: 'Buyer@12345',
      role: 'buyer'
    },
    {
      name: 'Saad Malik',
      email: 'saad@example.com',
      password: 'Buyer@12345',
      role: 'buyer'
    },
    {
      name: 'Hassan Ali',
      email: 'hassan@example.com',
      password: 'Buyer@12345',
      role: 'buyer'
    },
    {
      name: 'Usman Tariq',
      email: 'buyer5@example.com',
      password: 'Buyer@12345',
      role: 'buyer'
    }
  ])

  return {
    admin,
    sellerUsers,
    buyers
  }
}

const createSellers = async sellerUsers => {
  const sellers = await Seller.create([
    {
      user: sellerUsers[0]._id,
      storeName: 'TechHub',
      description:
        'Quality laptops, keyboards and computer accessories.',
      phone: '+92 300 1111111',
      address: {
        street: 'Main Boulevard Gulberg',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54660',
        country: 'Pakistan'
      },
      status: 'approved',
      approvedAt: new Date()
    },
    {
      user: sellerUsers[1]._id,
      storeName: 'GadgetZone',
      description:
        'Modern electronics and everyday digital gadgets.',
      phone: '+92 301 2222222',
      address: {
        street: 'Blue Area',
        city: 'Islamabad',
        state: 'Islamabad Capital Territory',
        postalCode: '44000',
        country: 'Pakistan'
      },
      status: 'approved',
      approvedAt: new Date()
    },
    {
      user: sellerUsers[2]._id,
      storeName: 'Urban Store',
      description:
        'Stylish backpacks and accessories for everyday life.',
      phone: '+92 302 3333333',
      address: {
        street: 'University Road',
        city: 'Peshawar',
        state: 'Khyber Pakhtunkhwa',
        postalCode: '25000',
        country: 'Pakistan'
      },
      status: 'pending'
    }
  ])

  for (let i = 0; i < sellers.length; i++) {
    sellerUsers[i].sellerProfile = sellers[i]._id
    await sellerUsers[i].save()
  }

  return sellers
}

const createCategories = async imageUrls => {
  return Category.create([
    {
      name: 'Laptops',
      slug: 'laptops',
      description:
        'Laptops for work, study, development and entertainment.',
      image: imageUrls.laptop
    },
    {
      name: 'Headphones',
      slug: 'headphones',
      description:
        'Wired and wireless headphones for music and everyday use.',
      image: imageUrls.headphones
    },
    {
      name: 'Keyboards',
      slug: 'keyboards',
      description:
        'Mechanical and standard keyboards for productivity and gaming.',
      image: imageUrls.keyboard
    },
    {
      name: 'Mice',
      slug: 'mice',
      description:
        'Computer mice for productivity, gaming and everyday computing.',
      image: imageUrls.mouse
    },
    {
      name: 'Backpacks',
      slug: 'backpacks',
      description:
        'Backpacks suitable for students, professionals and travel.',
      image: imageUrls.backpacks
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description:
        'Useful accessories for computers and everyday technology.',
      image: imageUrls.computerMice
    }
  ])
}

const createProducts = async (sellers, categories, imageUrls) => {
  const [
    laptopCategory,
    headphonesCategory,
    keyboardCategory,
    mouseCategory,
    backpackCategory,
    accessoriesCategory
  ] = categories

  return Product.create([
    {
      seller: sellers[0]._id,
      category: laptopCategory._id,
      name: 'TechHub Pro Laptop 15',
      slug: 'techhub-pro-laptop-15',
      description:
        'A powerful 15-inch laptop designed for development, productivity and everyday professional workloads.',
      images: [imageUrls.laptop],
      price: 1250,
      discount: 10,
      stock: 15,
      sku: 'TH-LAP-001',
      variants: [
        {
          name: 'RAM',
          value: '16GB',
          price: 1250,
          stock: 10,
          sku: 'TH-LAP-001-16'
        },
        {
          name: 'RAM',
          value: '32GB',
          price: 1450,
          stock: 5,
          sku: 'TH-LAP-001-32'
        }
      ],
      specifications: {
        processor: 'Intel Core i7',
        ram: '16GB',
        storage: '512GB SSD',
        display: '15.6 inch Full HD',
        operatingSystem: 'Windows 11'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: laptopCategory._id,
      name: 'TechHub Air Laptop 14',
      slug: 'techhub-air-laptop-14',
      description:
        'A lightweight 14-inch laptop built for students, developers and professionals who need portability.',
      images: [imageUrls.laptop],
      price: 950,
      discount: 5,
      stock: 20,
      sku: 'TH-LAP-002',
      specifications: {
        processor: 'Intel Core i5',
        ram: '16GB',
        storage: '512GB SSD',
        display: '14 inch Full HD',
        weight: '1.4kg'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: keyboardCategory._id,
      name: 'TechHub Mechanical Keyboard',
      slug: 'techhub-mechanical-keyboard',
      description:
        'A compact mechanical keyboard designed for comfortable programming, productivity and gaming.',
      images: [imageUrls.keyboard],
      price: 85,
      discount: 10,
      stock: 35,
      sku: 'TH-KEY-001',
      variants: [
        {
          name: 'Switch',
          value: 'Blue',
          price: 85,
          stock: 20,
          sku: 'TH-KEY-001-BLUE'
        },
        {
          name: 'Switch',
          value: 'Red',
          price: 90,
          stock: 15,
          sku: 'TH-KEY-001-RED'
        }
      ],
      specifications: {
        type: 'Mechanical',
        layout: 'US',
        connection: 'USB',
        backlight: 'RGB'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: mouseCategory._id,
      name: 'TechHub Wireless Mouse',
      slug: 'techhub-wireless-mouse',
      description:
        'A comfortable wireless mouse with precise tracking for office work and everyday computing.',
      images: [imageUrls.mouse],
      price: 35,
      discount: 0,
      stock: 50,
      sku: 'TH-MOU-001',
      specifications: {
        connection: 'Wireless',
        dpi: '1600',
        battery: 'AA',
        compatibility: 'Windows, macOS, Linux'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: accessoriesCategory._id,
      name: 'TechHub Office Mouse',
      slug: 'techhub-office-mouse',
      description:
        'An affordable wired mouse suitable for offices, students and general computer use.',
      images: [imageUrls.computerMice],
      price: 18,
      discount: 0,
      stock: 60,
      sku: 'TH-MOU-002',
      specifications: {
        connection: 'USB',
        dpi: '1200',
        cableLength: '1.5m'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: headphonesCategory._id,
      name: 'GadgetZone Studio Headphones',
      slug: 'gadgetzone-studio-headphones',
      description:
        'Comfortable over-ear headphones designed for music, video calls and long listening sessions.',
      images: [imageUrls.headphones],
      price: 120,
      discount: 15,
      stock: 25,
      sku: 'GZ-HEAD-001',
      specifications: {
        type: 'Over-ear',
        connection: 'Wired',
        microphone: 'Yes',
        frequency: '20Hz-20kHz'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: headphonesCategory._id,
      name: 'GadgetZone Wireless Headphones',
      slug: 'gadgetzone-wireless-headphones',
      description:
        'Wireless headphones offering comfortable everyday listening with a clean and modern design.',
      images: [imageUrls.headphones],
      price: 150,
      discount: 10,
      stock: 18,
      sku: 'GZ-HEAD-002',
      specifications: {
        type: 'Over-ear',
        connection: 'Bluetooth',
        battery: '30 hours',
        microphone: 'Yes'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: mouseCategory._id,
      name: 'GadgetZone Gaming Mouse',
      slug: 'gadgetzone-gaming-mouse',
      description:
        'A responsive gaming mouse with adjustable sensitivity for competitive and casual gaming.',
      images: [imageUrls.computerMice],
      price: 65,
      discount: 5,
      stock: 30,
      sku: 'GZ-MOU-001',
      specifications: {
        connection: 'USB',
        dpi: '6400',
        buttons: '6',
        lighting: 'RGB'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: keyboardCategory._id,
      name: 'GadgetZone Gaming Keyboard',
      slug: 'gadgetzone-gaming-keyboard',
      description:
        'A full-size gaming keyboard designed for fast response and comfortable extended gaming sessions.',
      images: [imageUrls.keyboard],
      price: 110,
      discount: 10,
      stock: 22,
      sku: 'GZ-KEY-001',
      specifications: {
        type: 'Mechanical',
        layout: 'US',
        connection: 'USB',
        lighting: 'RGB'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: accessoriesCategory._id,
      name: 'GadgetZone Compact Mouse',
      slug: 'gadgetzone-compact-mouse',
      description:
        'A compact and lightweight mouse designed for laptops, travel and everyday productivity.',
      images: [imageUrls.mouse],
      price: 25,
      discount: 0,
      stock: 45,
      sku: 'GZ-MOU-002',
      specifications: {
        connection: 'Wireless',
        dpi: '1600',
        weight: '65g'
      },
      status: 'active'
    },
    {
      seller: sellers[2]._id,
      category: backpackCategory._id,
      name: 'Urban Classic Backpack',
      slug: 'urban-classic-backpack',
      description:
        'A practical everyday backpack with dedicated compartments for laptops, books and accessories.',
      images: [imageUrls.backpacks],
      price: 55,
      discount: 10,
      stock: 40,
      sku: 'US-BAG-001',
      specifications: {
        capacity: '25L',
        material: 'Polyester',
        laptopCompartment: '15.6 inch',
        waterResistant: 'Yes'
      },
      status: 'active'
    },
    {
      seller: sellers[2]._id,
      category: backpackCategory._id,
      name: 'Urban Travel Backpack',
      slug: 'urban-travel-backpack',
      description:
        'A spacious travel backpack designed for daily commuting, university and short trips.',
      images: [imageUrls.backpacks],
      price: 75,
      discount: 15,
      stock: 30,
      sku: 'US-BAG-002',
      specifications: {
        capacity: '32L',
        material: 'Nylon',
        laptopCompartment: '17 inch',
        waterResistant: 'Yes'
      },
      status: 'active'
    },
    {
      seller: sellers[2]._id,
      category: accessoriesCategory._id,
      name: 'Urban Everyday Mouse',
      slug: 'urban-everyday-mouse',
      description:
        'A simple computer mouse designed for reliable everyday work and study.',
      images: [imageUrls.mouse],
      price: 22,
      discount: 0,
      stock: 50,
      sku: 'US-MOU-001',
      specifications: {
        connection: 'USB',
        dpi: '1200',
        compatibility: 'Windows, macOS, Linux'
      },
      status: 'active'
    },
    {
      seller: sellers[2]._id,
      category: headphonesCategory._id,
      name: 'Urban Wired Headphones',
      slug: 'urban-wired-headphones',
      description:
        'Affordable wired headphones designed for online classes, calls and everyday entertainment.',
      images: [imageUrls.headphones],
      price: 45,
      discount: 5,
      stock: 35,
      sku: 'US-HEAD-001',
      specifications: {
        type: 'On-ear',
        connection: '3.5mm',
        microphone: 'Yes',
        cableLength: '1.2m'
      },
      status: 'active'
    },
    {
      seller: sellers[2]._id,
      category: keyboardCategory._id,
      name: 'Urban Office Keyboard',
      slug: 'urban-office-keyboard',
      description:
        'A comfortable full-size keyboard designed for office work, studying and everyday typing.',
      images: [imageUrls.keyboard],
      price: 40,
      discount: 0,
      stock: 25,
      sku: 'US-KEY-001',
      specifications: {
        type: 'Membrane',
        layout: 'US',
        connection: 'USB',
        numberPad: 'Yes'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: accessoriesCategory._id,
      name: 'TechHub Basic Mouse',
      slug: 'techhub-basic-mouse',
      description:
        'A reliable budget mouse for everyday computer usage, office work and study.',
      images: [imageUrls.mouse],
      price: 15,
      discount: 0,
      stock: 70,
      sku: 'TH-MOU-003',
      specifications: {
        connection: 'USB',
        dpi: '1000',
        buttons: '3'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: accessoriesCategory._id,
      name: 'GadgetZone Multi Mouse Pack',
      slug: 'gadgetzone-multi-mouse-pack',
      description:
        'A practical multi-mouse pack suitable for offices, computer labs and shared workspaces.',
      images: [imageUrls.computerMice],
      price: 50,
      discount: 5,
      stock: 20,
      sku: 'GZ-MOU-003',
      specifications: {
        quantity: '3',
        connection: 'USB',
        compatibility: 'Windows, macOS, Linux'
      },
      status: 'active'
    },
    {
      seller: sellers[0]._id,
      category: laptopCategory._id,
      name: 'TechHub Developer Laptop',
      slug: 'techhub-developer-laptop',
      description:
        'A high-performance laptop designed for software development, multitasking and demanding professional workloads.',
      images: [imageUrls.laptop],
      price: 1750,
      discount: 8,
      stock: 8,
      sku: 'TH-LAP-003',
      specifications: {
        processor: 'Intel Core i9',
        ram: '32GB',
        storage: '1TB SSD',
        display: '15.6 inch',
        graphics: 'Dedicated GPU'
      },
      status: 'active'
    },
    {
      seller: sellers[1]._id,
      category: headphonesCategory._id,
      name: 'GadgetZone Premium Headphones',
      slug: 'gadgetzone-premium-headphones',
      description:
        'Premium over-ear headphones built for immersive listening and comfortable extended use.',
      images: [imageUrls.headphones],
      price: 220,
      discount: 12,
      stock: 12,
      sku: 'GZ-HEAD-003',
      specifications: {
        type: 'Over-ear',
        connection: 'Bluetooth',
        battery: '40 hours',
        noiseCancellation: 'Yes'
      },
      status: 'active'
    }
  ])
}

const createCarts = async (buyers, products, sellers) => {
  return Cart.create([
    {
      user: buyers[0]._id,
      items: [
        {
          product: products[0]._id,
          seller: sellers[0]._id,
          quantity: 1
        },
        {
          product: products[5]._id,
          seller: sellers[1]._id,
          quantity: 2
        }
      ]
    },
    {
      user: buyers[1]._id,
      items: [
        {
          product: products[2]._id,
          seller: sellers[0]._id,
          quantity: 1
        }
      ]
    },
    {
      user: buyers[2]._id,
      items: [
        {
          product: products[10]._id,
          seller: sellers[2]._id,
          quantity: 1
        }
      ]
    },
    {
      user: buyers[3]._id,
      items: [
        {
          product: products[6]._id,
          seller: sellers[1]._id,
          quantity: 1
        },
        {
          product: products[11]._id,
          seller: sellers[2]._id,
          quantity: 1
        }
      ]
    },
    {
      user: buyers[4]._id,
      items: []
    }
  ])
}

const calculateProductTotal = (product, quantity) => {
  const discountedPrice =
    product.price - product.price * (product.discount / 100)

  return {
    unitPrice: discountedPrice,
    totalPrice: discountedPrice * quantity
  }
}

const createOrders = async (buyers, sellers, products) => {
  const product0 = products[0]
  const product5 = products[5]
  const product2 = products[2]
  const product10 = products[10]
  const product6 = products[6]

  const item1Price = calculateProductTotal(product0, 1)
  const item2Price = calculateProductTotal(product5, 2)
  const item3Price = calculateProductTotal(product2, 1)
  const item4Price = calculateProductTotal(product10, 1)
  const item5Price = calculateProductTotal(product6, 1)

  const order1Subtotal =
    item1Price.totalPrice +
    item2Price.totalPrice

  const order2Subtotal = item3Price.totalPrice

  const order3Subtotal = item4Price.totalPrice

  const order4Subtotal = item5Price.totalPrice

  return Order.create([
    {
      orderNumber: 'SHOPIVO-SEED-001',
      buyer: buyers[0]._id,
      sellerOrders: [
        {
          seller: sellers[0]._id,
          items: [
            {
              product: product0._id,
              seller: sellers[0]._id,
              name: product0.name,
              image: product0.images[0],
              sku: product0.sku,
              quantity: 1,
              unitPrice: item1Price.unitPrice,
              discount: product0.discount,
              totalPrice: item1Price.totalPrice
            }
          ],
          subtotal: item1Price.totalPrice,
          shippingFee: 10,
          total: item1Price.totalPrice + 10,
          status: 'delivered',
          deliveredAt: new Date()
        },
        {
          seller: sellers[1]._id,
          items: [
            {
              product: product5._id,
              seller: sellers[1]._id,
              name: product5.name,
              image: product5.images[0],
              sku: product5.sku,
              quantity: 2,
              unitPrice: item2Price.unitPrice,
              discount: product5.discount,
              totalPrice: item2Price.totalPrice
            }
          ],
          subtotal: item2Price.totalPrice,
          shippingFee: 10,
          total: item2Price.totalPrice + 10,
          status: 'delivered',
          deliveredAt: new Date()
        }
      ],
      shippingAddress: {
        fullName: 'Ahmed Hassan',
        phone: '+92 300 4444444',
        address: 'Model Town',
        city: 'Lahore',
        postalCode: '54700',
        country: 'Pakistan'
      },
      subtotal: order1Subtotal,
      shippingFee: 20,
      total: order1Subtotal + 20,
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      status: 'delivered',
      paidAt: new Date()
    },
    {
      orderNumber: 'SHOPIVO-SEED-002',
      buyer: buyers[1]._id,
      sellerOrders: [
        {
          seller: sellers[0]._id,
          items: [
            {
              product: product2._id,
              seller: sellers[0]._id,
              name: product2.name,
              image: product2.images[0],
              sku: product2.sku,
              quantity: 1,
              unitPrice: item3Price.unitPrice,
              discount: product2.discount,
              totalPrice: item3Price.totalPrice
            }
          ],
          subtotal: order2Subtotal,
          shippingFee: 10,
          total: order2Subtotal + 10,
          status: 'processing'
        }
      ],
      shippingAddress: {
        fullName: 'Bilal Shah',
        phone: '+92 301 5555555',
        address: 'Johar Town',
        city: 'Lahore',
        postalCode: '54782',
        country: 'Pakistan'
      },
      subtotal: order2Subtotal,
      shippingFee: 10,
      total: order2Subtotal + 10,
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      status: 'processing',
      paidAt: new Date()
    },
    {
      orderNumber: 'SHOPIVO-SEED-003',
      buyer: buyers[2]._id,
      sellerOrders: [
        {
          seller: sellers[2]._id,
          items: [
            {
              product: product10._id,
              seller: sellers[2]._id,
              name: product10.name,
              image: product10.images[0],
              sku: product10.sku,
              quantity: 1,
              unitPrice: item4Price.unitPrice,
              discount: product10.discount,
              totalPrice: item4Price.totalPrice
            }
          ],
          subtotal: order3Subtotal,
          shippingFee: 10,
          total: order3Subtotal + 10,
          status: 'shipped'
        }
      ],
      shippingAddress: {
        fullName: 'Saad Malik',
        phone: '+92 302 6666666',
        address: 'Hayatabad',
        city: 'Peshawar',
        postalCode: '25100',
        country: 'Pakistan'
      },
      subtotal: order3Subtotal,
      shippingFee: 10,
      total: order3Subtotal + 10,
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      status: 'shipped',
      paidAt: new Date()
    },
    {
      orderNumber: 'SHOPIVO-SEED-004',
      buyer: buyers[3]._id,
      sellerOrders: [
        {
          seller: sellers[1]._id,
          items: [
            {
              product: product6._id,
              seller: sellers[1]._id,
              name: product6.name,
              image: product6.images[0],
              sku: product6.sku,
              quantity: 1,
              unitPrice: item5Price.unitPrice,
              discount: product6.discount,
              totalPrice: item5Price.totalPrice
            }
          ],
          subtotal: order4Subtotal,
          shippingFee: 10,
          total: order4Subtotal + 10,
          status: 'pending'
        }
      ],
      shippingAddress: {
        fullName: 'Hassan Ali',
        phone: '+92 303 7777777',
        address: 'G-11',
        city: 'Islamabad',
        postalCode: '44000',
        country: 'Pakistan'
      },
      subtotal: order4Subtotal,
      shippingFee: 10,
      total: order4Subtotal + 10,
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      status: 'pending',
      paidAt: new Date()
    }
  ])
}

const clearDatabase = async () => {
  console.log('\nClearing database...\n')

  await Payment.deleteMany({})
  await Order.deleteMany({})
  await Cart.deleteMany({})
  await Product.deleteMany({})
  await Category.deleteMany({})
  await Seller.deleteMany({})
  await User.deleteMany({})

  console.log('Database cleared')
}

const seed = async () => {
  try {
    await connectDB()

    await prepareImages()

    const imageUrls = await uploadImages()

    await clearDatabase()

    const { admin, sellerUsers, buyers } = await createUsers()

    const sellers = await createSellers(sellerUsers)

    const categories = await createCategories(imageUrls)

    const products = await createProducts(
      sellers,
      categories,
      imageUrls
    )

    const carts = await createCarts(
      buyers,
      products,
      sellers
    )

    const orders = await createOrders(
      buyers,
      sellers,
      products
    )

    console.log('\nSeed completed successfully\n')

    console.log('Admin:')
    console.log('Email: admin@shopivo.com')
    console.log('Password: Admin@12345')

    console.log('\nSeller accounts:')
    console.log('ali@techhub.com / Seller@12345')
    console.log('hamza@gadgetzone.com / Seller@12345')
    console.log('usman@urbanstore.com / Seller@12345')

    console.log('\nBuyer accounts:')
    console.log('ahmed@example.com / Buyer@12345')
    console.log('bilal@example.com / Buyer@12345')
    console.log('saad@example.com / Buyer@12345')
    console.log('hassan@example.com / Buyer@12345')
    console.log('buyer5@example.com / Buyer@12345')

    console.log('\nCreated:')
    console.log(`Users: ${1 + sellerUsers.length + buyers.length}`)
    console.log(`Sellers: ${sellers.length}`)
    console.log(`Categories: ${categories.length}`)
    console.log(`Products: ${products.length}`)
    console.log(`Carts: ${carts.length}`)
    console.log(`Orders: ${orders.length}`)
    console.log('Payments: 0')
  } catch (error) {
    console.error('\nSeed failed:')
    console.error(error)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

seed()