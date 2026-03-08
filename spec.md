# DESVA – Personalized With Love

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Brand header with DESVA logo (uploaded image: IMG_20260302_225930_965-1.jpg), brand name, and tagline "Personalized With Love"
- Navigation: Shop Now, Explore, Order Through This Link
- Soft premium hero/banner section
- Product catalog shown immediately on home page
- 7 product categories: Bouquets, Polaroids, Polaroid Collections, Magazines, Bookmarks, Customized Cards, Cute Accessories
- Bouquets: Ribbon (Classic ₹89, Premium ₹99), Artificial (Classic ₹89, Premium ₹99), Natural (Classic ₹89, Premium ₹99), Pipe Cleaner (Basic ₹199, Moderate ₹249, Premium ₹299+)
- Polaroids: aesthetic empty polaroid frame mockups (no real photos) – Large Square ₹11, Medium Square ₹9, Rectangle ₹9
- Polaroid Collections: minimal icons – 8 Polaroid Bouquet Set ₹99, 16 Polaroid Set ₹199
- Magazines: Medium (4 pages ₹399, 6 pages ₹499, 8 pages ₹599), Large A4 +₹100 each; note "₹100 Extra For All Large Size magazines"
- Bookmarks: Fully Customized, Starting From ₹49 – minimal illustration style
- Customized Cards: 2 Pages (4 Sides), Starting From ₹249 – soft card mockup
- Cute Accessories: Earrings ₹149, Pipe Cleaner Framework ₹249, Double Side Photo Printed Keychain ₹199, Premium Customized Scrunchies ₹199, Pipe Cleaner Framework Bag ₹349 – editable prices
- Add to Cart functionality (cart state stored in backend)
- Order section with form: Customer Name, Phone Number, Instagram ID, Product Name, Customization Details, Quantity, Delivery Address, Preferred Delivery Date; plus WhatsApp Order Button
- Contact section: Instagram ID, Email Address (editable by admin), message "For any help, feel free to DM us on Instagram."
- About section: "DESVA is a premium handmade customized gift brand creating cute and memorable gifts crafted with love."
- Footer with Instagram icon

### Modify
Nothing – new project.

### Remove
Nothing – new project.

## Implementation Plan
1. Backend (Motoko): store orders (order form submissions), cart items, contact info (Instagram/email editable by admin), and accessory prices (editable)
2. Frontend: header with uploaded logo, nav bar, hero banner, category tabs/filter, product cards per category with Add to Cart, cart state, order form, contact section, about section, footer
3. WhatsApp button links to WhatsApp with pre-filled message
4. Admin-editable prices for Cute Accessories and contact info stored in backend
