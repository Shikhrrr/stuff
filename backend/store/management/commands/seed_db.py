from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product, ProductImage
from store.models import StoreSettings, HeroSlide

User = get_user_model()

CATEGORIES = [
    {
        "id": "women",
        "label": "Women's Shoes",
        "description": "From ballet flats to bold heels",
        "banner": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        "emoji": "👠"
    },
    {
        "id": "men",
        "label": "Men's Shoes",
        "description": "Classic craftsmanship, modern fit",
        "banner": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "emoji": "👞"
    },
    {
        "id": "kids",
        "label": "Kids' Shoes",
        "description": "Built for little adventurers",
        "banner": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80", # Using the updated kids banner
        "emoji": "👟"
    },
]

PRODUCTS = [
  # WOMEN
  {
    "id": "w1", "name": "Blush Ballet Flats", "category": "women", "price": 1299, "originalPrice": 1799,
    "description": "Ultra-soft ballet flats with a cushioned insole and flexible sole. Perfect for all-day wear. The timeless silhouette pairs effortlessly with any outfit, from casual jeans to elegant dresses.",
    "sizes": [35, 36, 37, 38, 39, 40, 41], "tags": ["trending", "bestseller"], "rating": 4.5, "reviews": 128, "inStock": True,
    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80", "https://images.unsplash.com/photo-1596703852857-b3b7fc10acd8?w=600&q=80"]
  },
  {
    "id": "w2", "name": "Rose Ankle Boots", "category": "women", "price": 2499, "originalPrice": 3299,
    "description": "Elegant ankle boots crafted with premium faux leather. A block heel provides comfort without sacrificing style. Features a side zipper for easy slip-on.",
    "sizes": [35, 36, 37, 38, 39, 40], "tags": ["new"], "rating": 4.7, "reviews": 89, "inStock": True,
    "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80", "https://images.unsplash.com/photo-1602024242516-fbc9d4fda4b6?w=600&q=80"]
  },
  {
    "id": "w3", "name": "Ivory Slip-On Loafers", "category": "women", "price": 1599, "originalPrice": None,
    "description": "Clean, minimal loafers in a soft ivory finish. Slip-on design with a lightly padded footbed for comfort. Pairs beautifully with both formal and casual looks.",
    "sizes": [36, 37, 38, 39, 40, 41], "tags": [], "rating": 4.3, "reviews": 56, "inStock": True,
    "image": "https://images.unsplash.com/photo-1593757147298-e064ed1419e5?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1593757147298-e064ed1419e5?w=600&q=80", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"]
  },
  {
    "id": "w4", "name": "Nude Kitten Heels", "category": "women", "price": 1899, "originalPrice": 2199,
    "description": "Sophisticated kitten heels in a warm nude tone. Low 5cm heel is perfect for extended wear. Pointed toe adds a chic, polished finish.",
    "sizes": [35, 36, 37, 38, 39, 40], "tags": ["trending"], "rating": 4.6, "reviews": 203, "inStock": True,
    "image": "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&q=80"]
  },
  # MEN
  {
    "id": "m1", "name": "Classic White Sneakers", "category": "men", "price": 2199, "originalPrice": 2799,
    "description": "Clean, minimal white leather sneakers — the ultimate wardrobe staple. Padded collar and cushioned insole for all-day comfort. Pairs with literally everything.",
    "sizes": [40, 41, 42, 43, 44, 45], "tags": ["bestseller", "trending"], "rating": 4.8, "reviews": 445, "inStock": True,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80"]
  },
  {
    "id": "m2", "name": "Oxford Brogues", "category": "men", "price": 3299, "originalPrice": None,
    "description": "Premium full-grain leather oxford brogues. Hand-stitched detailing and a durable rubber outsole. Ideal for formal occasions and business settings.",
    "sizes": [40, 41, 42, 43, 44, 45], "tags": ["new"], "rating": 4.7, "reviews": 187, "inStock": True,
    "image": "https://images.unsplash.com/photo-1614253429340-98120bd9d074?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1614253429340-98120bd9d074?w=600&q=80"]
  },
  {
    "id": "m3", "name": "Suede Desert Boots", "category": "men", "price": 2899, "originalPrice": 3499,
    "description": "Soft suede desert boots with a crepe sole. A versatile boot that transitions seamlessly from casual to smart-casual. Available in tan.",
    "sizes": [41, 42, 43, 44, 45], "tags": ["trending"], "rating": 4.5, "reviews": 134, "inStock": True,
    "image": "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=600&q=80"]
  },
  {
    "id": "m4", "name": "Running Trainers", "category": "men", "price": 2599, "originalPrice": 3099,
    "description": "High-performance running trainers with responsive foam midsole. Breathable mesh upper keeps feet cool. Reflective details for low-light safety.",
    "sizes": [40, 41, 42, 43, 44, 45, 46], "tags": ["bestseller"], "rating": 4.6, "reviews": 298, "inStock": True,
    "image": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"]
  },
  # KIDS
  {
    "id": "k1", "name": "Rainbow Velcro Trainers", "category": "kids", "price": 899, "originalPrice": 1199,
    "description": "Fun, colorful velcro trainers that kids can put on themselves. Lightweight EVA sole and breathable upper. Machine washable.",
    "sizes": [24, 25, 26, 27, 28, 29, 30, 31, 32], "tags": ["bestseller"], "rating": 4.7, "reviews": 203, "inStock": True,
    "image": "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&q=80"]
  },
  {
    "id": "k2", "name": "Girls' Mary Janes", "category": "kids", "price": 799, "originalPrice": None,
    "description": "Sweet patent leather Mary Janes with a buckle strap. Classic look for special occasions or school. Non-slip rubber sole for safety.",
    "sizes": [24, 25, 26, 27, 28, 29, 30], "tags": ["new"], "rating": 4.6, "reviews": 91, "inStock": True,
    "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80"]
  },
  {
    "id": "k3", "name": "Boys' Sports Shoes", "category": "kids", "price": 999, "originalPrice": 1299,
    "description": "Durable sports shoes built for active kids. Reinforced toe cap and cushioned midsole. Lace-up with bungee lace system.",
    "sizes": [28, 29, 30, 31, 32, 33, 34], "tags": ["bestseller", "trending"], "rating": 4.5, "reviews": 178, "inStock": True,
    "image": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
    "gallery": ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80"]
  },
]

SLIDES = [
    {
        "title": "Step Into", "highlight": "Elegance", "subtitle": "Curated footwear for every occasion",
        "cta": "Shop Women", "link": "/women", "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=80",
        "accent": "#E8879A", "order": 1
    },
    {
        "title": "Built For", "highlight": "Every Step", "subtitle": "Premium men's footwear, crafted to last",
        "cta": "Shop Men", "link": "/men", "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80",
        "accent": "#C4A882", "order": 2
    },
    {
        "title": "Little Feet,", "highlight": "Big Adventures", "subtitle": "Durable, fun shoes that kids love",
        "cta": "Shop Kids", "link": "/kids", "image": "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1400&q=80",
        "accent": "#A8C5DA", "order": 3
    },
]

class Command(BaseCommand):
    help = 'Seeds the database with initial mock data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Categories...')
        for cat in CATEGORIES:
            Category.objects.update_or_create(
                id=cat['id'],
                defaults={
                    'label': cat['label'],
                    'description': cat['description'],
                    'banner_image': cat['banner'],
                    'emoji': cat['emoji']
                }
            )

        self.stdout.write('Seeding Products...')
        for prod in PRODUCTS:
            cat = Category.objects.get(id=prod['category'])
            p, created = Product.objects.update_or_create(
                id=prod['id'],
                defaults={
                    'category': cat,
                    'name': prod['name'],
                    'price': prod['price'],
                    'original_price': prod['originalPrice'],
                    'description': prod['description'],
                    'sizes': prod['sizes'],
                    'tags': prod['tags'],
                    'rating': prod['rating'],
                    'reviews': prod['reviews'],
                    'in_stock': prod['inStock'],
                    'primary_image_url': prod['image']
                }
            )
            # Gallery
            p.gallery.all().delete()
            for idx, img in enumerate(prod['gallery']):
                ProductImage.objects.create(product=p, image_url=img, order=idx)

        self.stdout.write('Seeding Store Settings...')
        settings = StoreSettings.load()
        settings.name = "ShikharShoes"
        settings.address = "Near Kalyanpur Market\nKalyanpur, Kanpur\nUttar Pradesh - 208017\nIndia"
        settings.email = "hello@shikharshoes.io"
        settings.phone = "+91 98765 43210"
        settings.map_embed_url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.5!2d80.2331!3d26.5123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDMwJzQ0LjMiTiA4MMKwMTMnNTkuMiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
        settings.latitude = 26.5123
        settings.longitude = 80.2331
        settings.save()

        self.stdout.write('Seeding Hero Slides...')
        HeroSlide.objects.all().delete()
        for slide in SLIDES:
            HeroSlide.objects.create(
                title=slide['title'],
                highlight=slide['highlight'],
                subtitle=slide['subtitle'],
                cta=slide['cta'],
                link=slide['link'],
                image_url=slide['image'],
                accent_color=slide['accent'],
                order=slide['order']
            )

        self.stdout.write('Creating Admin User (admin/1234)...')
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser('admin@example.com', '1234', full_name='Admin User')

        # The user requested 'shikhar/1234' for reference too, let's add that.
        if not User.objects.filter(email='shikhar@example.com').exists():
            User.objects.create_superuser('shikhar@example.com', '1234', full_name='Shikhar')

        self.stdout.write(self.style.SUCCESS('Database successfully seeded!'))
