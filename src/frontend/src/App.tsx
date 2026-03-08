import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Loader2, Pencil, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "./backend.d.ts";
import {
  useAccessoryPrices,
  useAddToCart,
  useCart,
  useContactInfo,
  useRemoveFromCart,
  useSubmitOrder,
  useUpdateAccessoryPrices,
  useUpdateContactInfo,
} from "./hooks/useQueries";

// ── Session ID ────────────────────────────────────────────────────────────────
function getSessionId(): string {
  const key = "desva_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const SESSION_ID = getSessionId();

// ── Product type ──────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  icon: string;
  category: string;
  description?: string;
}

// ── Smooth scroll helper ──────────────────────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── Static products ───────────────────────────────────────────────────────────
const BOUQUETS: Product[] = [
  {
    id: "rfb-classic",
    name: "Ribbon Flower Bouquet – Classic Ribbon",
    price: "₹89",
    priceValue: 89,
    icon: "🌸",
    category: "Bouquets",
  },
  {
    id: "rfb-premium",
    name: "Ribbon Flower Bouquet – Premium Ribbon",
    price: "₹99",
    priceValue: 99,
    icon: "🌸",
    category: "Bouquets",
  },
  {
    id: "afb-classic",
    name: "Artificial Flower Bouquet – Classic Ribbon",
    price: "₹89",
    priceValue: 89,
    icon: "🌺",
    category: "Bouquets",
  },
  {
    id: "afb-premium",
    name: "Artificial Flower Bouquet – Premium Ribbon",
    price: "₹99",
    priceValue: 99,
    icon: "🌺",
    category: "Bouquets",
  },
  {
    id: "nfb-classic",
    name: "Natural Flower Bouquet – Classic Ribbon",
    price: "₹89",
    priceValue: 89,
    icon: "🌹",
    category: "Bouquets",
  },
  {
    id: "nfb-premium",
    name: "Natural Flower Bouquet – Premium Ribbon",
    price: "₹99",
    priceValue: 99,
    icon: "🌹",
    category: "Bouquets",
  },
  {
    id: "pcb-basic",
    name: "Pipe Cleaner Bouquet – Basic",
    price: "₹199",
    priceValue: 199,
    icon: "💐",
    category: "Bouquets",
  },
  {
    id: "pcb-moderate",
    name: "Pipe Cleaner Bouquet – Moderate",
    price: "₹249",
    priceValue: 249,
    icon: "💐",
    category: "Bouquets",
  },
  {
    id: "pcb-premium",
    name: "Pipe Cleaner Bouquet – Premium (Fully Customized)",
    price: "₹299+",
    priceValue: 299,
    icon: "💐",
    category: "Bouquets",
    description: "With Name & Design",
  },
];

const POLAROIDS: Product[] = [
  {
    id: "pol-large-sq",
    name: "Large Square Polaroid",
    price: "₹11 / piece",
    priceValue: 11,
    icon: "polaroid",
    category: "Polaroids",
  },
  {
    id: "pol-medium-sq",
    name: "Medium Square Polaroid",
    price: "₹9 / piece",
    priceValue: 9,
    icon: "polaroid",
    category: "Polaroids",
  },
  {
    id: "pol-rect",
    name: "Rectangle Polaroid",
    price: "₹9 / piece",
    priceValue: 9,
    icon: "polaroid",
    category: "Polaroids",
  },
];

const POLAROID_COLLECTIONS: Product[] = [
  {
    id: "polcol-8",
    name: "8 Polaroid Bouquet Set",
    price: "₹99",
    priceValue: 99,
    icon: "📷",
    category: "Polaroid Collections",
  },
  {
    id: "polcol-16",
    name: "16 Polaroid Set",
    price: "₹199",
    priceValue: 199,
    icon: "📸",
    category: "Polaroid Collections",
  },
];

const MAGAZINES: Product[] = [
  {
    id: "mag-m-4",
    name: "Magazine – Medium 4 Pages",
    price: "₹399",
    priceValue: 399,
    icon: "📖",
    category: "Magazines",
  },
  {
    id: "mag-m-6",
    name: "Magazine – Medium 6 Pages",
    price: "₹499",
    priceValue: 499,
    icon: "📖",
    category: "Magazines",
  },
  {
    id: "mag-m-8",
    name: "Magazine – Medium 8 Pages",
    price: "₹599",
    priceValue: 599,
    icon: "📖",
    category: "Magazines",
  },
  {
    id: "mag-l-4",
    name: "Magazine – Large A4 4 Pages",
    price: "₹499",
    priceValue: 499,
    icon: "📋",
    category: "Magazines",
  },
  {
    id: "mag-l-6",
    name: "Magazine – Large A4 6 Pages",
    price: "₹599",
    priceValue: 599,
    icon: "📋",
    category: "Magazines",
  },
  {
    id: "mag-l-8",
    name: "Magazine – Large A4 8 Pages",
    price: "₹699",
    priceValue: 699,
    icon: "📋",
    category: "Magazines",
  },
];

const BOOKMARKS: Product[] = [
  {
    id: "bkm-custom",
    name: "Fully Customized Bookmark",
    price: "Starting From ₹49",
    priceValue: 49,
    icon: "🔖",
    category: "Bookmarks",
  },
];

const CARDS: Product[] = [
  {
    id: "card-custom",
    name: "Customized Card – 2 Pages (4 Sides), Fully Customized",
    price: "Starting From ₹249",
    priceValue: 249,
    icon: "card",
    category: "Customized Cards",
  },
];

const CATEGORIES = [
  "Bouquets",
  "Polaroids",
  "Polaroid Collections",
  "Magazines",
  "Bookmarks",
  "Customized Cards",
  "Cute Accessories",
];

// ── Polaroid dims ─────────────────────────────────────────────────────────────
interface PolaroidDimensions {
  width: string;
  innerWidth: string;
  innerHeight: string;
  label: string;
}

const POLAROID_DIMS: Record<string, PolaroidDimensions> = {
  "pol-large-sq": {
    width: "120px",
    innerWidth: "100px",
    innerHeight: "100px",
    label: "Large Square",
  },
  "pol-medium-sq": {
    width: "96px",
    innerWidth: "76px",
    innerHeight: "76px",
    label: "Med Square",
  },
  "pol-rect": {
    width: "88px",
    innerWidth: "68px",
    innerHeight: "95px",
    label: "Rectangle",
  },
};

function PolaroidVisual({ productId }: { productId: string }) {
  const dims = POLAROID_DIMS[productId] ?? POLAROID_DIMS["pol-medium-sq"];
  return (
    <div className="flex items-center justify-center py-4">
      <div className="polaroid-frame mx-auto" style={{ width: dims.width }}>
        <div
          className="polaroid-inner"
          style={{
            width: dims.innerWidth,
            height: dims.innerHeight,
            minHeight: dims.innerHeight,
          }}
        >
          <span className="text-center leading-tight">{dims.label}</span>
        </div>
      </div>
    </div>
  );
}

function CardVisual() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="card-fold rounded-lg border border-border bg-card shadow-petal p-4 w-28 h-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">💌</div>
          <div className="text-[10px] text-muted-foreground mt-1 font-body">
            4 Sides
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  isAdding?: boolean;
}

function ProductCard({
  product,
  index,
  onAddToCart,
  isAdding,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl shadow-petal border border-border overflow-hidden group cursor-default"
    >
      <div className="bg-petal-pattern bg-petal min-h-[140px] flex items-center justify-center relative overflow-hidden">
        {product.icon === "polaroid" ? (
          <PolaroidVisual productId={product.id} />
        ) : product.icon === "card" ? (
          <CardVisual />
        ) : (
          <motion.div
            className="text-5xl select-none"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          >
            {product.icon}
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <span className="text-rose-gold font-display font-bold text-base">
            {product.price}
          </span>
          <Button
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 h-7 shadow-petal transition-all"
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
            data-ocid={`product.add_to_cart_button.${index}`}
          >
            {isAdding ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({
  children,
  subtitle,
}: { children: React.ReactNode; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-10"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight floral-decoration">
        {children}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground mt-2 font-elegant text-base italic">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-primary opacity-50" />
    </motion.div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("Bouquets");

  // Edit prices modal
  const [editPricesOpen, setEditPricesOpen] = useState(false);
  const [editPricesForm, setEditPricesForm] = useState<Record<string, string>>(
    {},
  );

  // Edit contact modal
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editContactForm, setEditContactForm] = useState({
    instagram: "",
    email: "",
  });

  // Order form
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phoneNumber: "",
    instagramId: "",
    productName: "",
    customizationDetails: "",
    quantity: "1",
    deliveryAddress: "",
    preferredDeliveryDate: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);

  // ── Data queries ───────────────────────────────────────────────────────────
  const { data: accessoryPrices, isLoading: pricesLoading } =
    useAccessoryPrices();
  const { data: contactInfo } = useContactInfo();
  const { data: cartItems = [] } = useCart(SESSION_ID);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const addToCartMutation = useAddToCart(SESSION_ID);
  const removeFromCartMutation = useRemoveFromCart(SESSION_ID);
  const submitOrderMutation = useSubmitOrder();
  const updatePricesMutation = useUpdateAccessoryPrices();
  const updateContactMutation = useUpdateContactInfo();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  // ── Add to cart ────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(
    async (product: Product) => {
      setAddingProducts((prev) => new Set(prev).add(product.id));
      const item: CartItem = {
        productId: product.id,
        productName: product.name,
        price: BigInt(product.priceValue),
        quantity: 1n,
      };
      try {
        await addToCartMutation.mutateAsync(item);
        toast.success(`${product.name} added to cart!`, { duration: 2000 });
      } catch {
        toast.error("Failed to add to cart. Please try again.");
      } finally {
        setAddingProducts((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }
    },
    [addToCartMutation],
  );

  // ── Remove from cart ───────────────────────────────────────────────────────
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      try {
        await removeFromCartMutation.mutateAsync(productId);
        toast.success("Item removed.");
      } catch {
        toast.error("Failed to remove item.");
      }
    },
    [removeFromCartMutation],
  );

  // ── Submit order ───────────────────────────────────────────────────────────
  const handleSubmitOrder = useCallback(async () => {
    if (
      !orderForm.customerName ||
      !orderForm.phoneNumber ||
      !orderForm.productName
    ) {
      toast.error("Please fill in Name, Phone, and Product Name.");
      return;
    }
    setOrderSuccess(false);
    setOrderError(false);
    try {
      await submitOrderMutation.mutateAsync({
        customerName: orderForm.customerName,
        phoneNumber: orderForm.phoneNumber,
        instagramId: orderForm.instagramId,
        productName: orderForm.productName,
        customizationDetails: orderForm.customizationDetails,
        quantity: BigInt(orderForm.quantity || "1"),
        deliveryAddress: orderForm.deliveryAddress,
        preferredDeliveryDate: orderForm.preferredDeliveryDate,
      });
      setOrderSuccess(true);
      toast.success("Order placed! We'll contact you soon 💕");
      setOrderForm({
        customerName: "",
        phoneNumber: "",
        instagramId: "",
        productName: "",
        customizationDetails: "",
        quantity: "1",
        deliveryAddress: "",
        preferredDeliveryDate: "",
      });
    } catch {
      setOrderError(true);
      toast.error("Failed to place order. Please try again or WhatsApp us.");
    }
  }, [orderForm, submitOrderMutation]);

  // ── Save prices ────────────────────────────────────────────────────────────
  const handleSavePrices = useCallback(async () => {
    try {
      await updatePricesMutation.mutateAsync({
        earrings: BigInt(editPricesForm.earrings || "149"),
        pipeCleanerFramework: BigInt(
          editPricesForm.pipeCleanerFramework || "249",
        ),
        keychain: BigInt(editPricesForm.keychain || "199"),
        scrunchies: BigInt(editPricesForm.scrunchies || "199"),
        pipeCleanerBag: BigInt(editPricesForm.pipeCleanerBag || "349"),
      });
      setEditPricesOpen(false);
      toast.success("Prices updated!");
    } catch {
      toast.error("Failed to update prices.");
    }
  }, [editPricesForm, updatePricesMutation]);

  // ── Save contact ───────────────────────────────────────────────────────────
  const handleSaveContact = useCallback(async () => {
    try {
      await updateContactMutation.mutateAsync({
        instagramHandle: editContactForm.instagram,
        emailAddress: editContactForm.email,
      });
      setEditContactOpen(false);
      toast.success("Contact info updated!");
    } catch {
      toast.error("Failed to update contact info.");
    }
  }, [editContactForm, updateContactMutation]);

  // Build accessories array
  const defaultPrices = {
    earrings: 149n,
    pipeCleanerFramework: 249n,
    keychain: 199n,
    scrunchies: 199n,
    pipeCleanerBag: 349n,
  };
  const prices = accessoryPrices ?? defaultPrices;
  const accessoryProducts = [
    {
      id: "acc-earrings",
      name: "Earrings",
      price: `Starting From ₹${Number(prices.earrings)}`,
      priceValue: Number(prices.earrings),
      icon: "💎",
      category: "Cute Accessories",
    },
    {
      id: "acc-pcf",
      name: "Pipe Cleaner Framework",
      price: `₹${Number(prices.pipeCleanerFramework)}`,
      priceValue: Number(prices.pipeCleanerFramework),
      icon: "🌟",
      category: "Cute Accessories",
    },
    {
      id: "acc-keychain",
      name: "Double Side Photo Printed Keychain",
      price: `Starting From ₹${Number(prices.keychain)}`,
      priceValue: Number(prices.keychain),
      icon: "🔑",
      category: "Cute Accessories",
    },
    {
      id: "acc-scrunchies",
      name: "Premium Customized Scrunchies",
      price: `₹${Number(prices.scrunchies)}`,
      priceValue: Number(prices.scrunchies),
      icon: "🎀",
      category: "Cute Accessories",
    },
    {
      id: "acc-pcbag",
      name: "Pipe Cleaner Framework Bag (Trending Model)",
      price: `₹${Number(prices.pipeCleanerBag)}`,
      priceValue: Number(prices.pipeCleanerBag),
      icon: "👜",
      category: "Cute Accessories",
    },
  ];

  const contactDisplay = contactInfo ?? {
    instagramHandle: "@desva.gifts",
    emailAddress: "desva.gifts@gmail.com",
  };

  // Global product index tracker
  let globalIdx = 0;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* ── HEADER ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/uploads/IMG_20260302_225930_965-1.jpg"
              alt="DESVA – Personalized With Love"
              className="h-14 w-auto object-contain rounded-md"
            />
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display font-medium tracking-wide text-sm px-4"
              onClick={() => scrollTo("catalog")}
              data-ocid="nav.shop_now_button"
            >
              Shop Now
            </Button>
            <Button
              variant="ghost"
              className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display font-medium tracking-wide text-sm px-4"
              onClick={() => scrollTo("catalog")}
              data-ocid="nav.explore_button"
            >
              Explore
            </Button>
            <Button
              variant="ghost"
              className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display font-medium tracking-wide text-sm px-4"
              onClick={() => scrollTo("order")}
              data-ocid="nav.order_link"
            >
              Order Through This Link
            </Button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-accent"
            onClick={() => setCartOpen(true)}
            data-ocid="nav.cart_button"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground rounded-full font-bold">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display text-xs whitespace-nowrap px-3 h-7"
            onClick={() => scrollTo("catalog")}
            data-ocid="nav.shop_now_button"
          >
            Shop Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display text-xs whitespace-nowrap px-3 h-7"
            onClick={() => scrollTo("catalog")}
            data-ocid="nav.explore_button"
          >
            Explore
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-foreground hover:text-primary hover:bg-accent font-display text-xs whitespace-nowrap px-3 h-7"
            onClick={() => scrollTo("order")}
            data-ocid="nav.order_link"
          >
            Order Here
          </Button>
        </div>
      </header>

      {/* ── HERO BANNER ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-[5%] text-5xl opacity-20 animate-float-petal">
            🌸
          </div>
          <div className="absolute top-16 right-[8%] text-4xl opacity-15 animate-float-petal [animation-delay:1.2s]">
            🌹
          </div>
          <div className="absolute bottom-10 left-[12%] text-3xl opacity-15 animate-float-petal [animation-delay:0.6s]">
            💮
          </div>
          <div className="absolute bottom-6 right-[15%] text-4xl opacity-20 animate-float-petal [animation-delay:1.8s]">
            🌺
          </div>
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-48 h-48 rounded-full bg-accent/20 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs font-body tracking-[0.35em] uppercase text-primary/80 mb-4">
              ✦ Premium Handmade Gifts ✦
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Handcrafted with love,
              <br />
              <em className="text-primary not-italic">delivered with care</em>
            </h1>
            <p className="font-elegant text-lg md:text-xl text-muted-foreground italic mb-8 max-w-lg mx-auto">
              Every gift tells a story. We craft yours with the warmth it
              deserves.
            </p>
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold tracking-wide px-8 py-3 h-auto shadow-petal-lg text-base transition-all hover:shadow-petal-xl hover:scale-105"
              onClick={() => scrollTo("catalog")}
              data-ocid="hero.shop_now_button"
            >
              Shop Now ✦
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── CATALOG ───────────────────────────────────────────────────────────── */}
      <section id="catalog" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <SectionHeading subtitle="Crafted with love, just for you">
          Our Collection
        </SectionHeading>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto pb-2 mb-8">
            <TabsList className="inline-flex h-auto gap-1.5 bg-muted/60 rounded-full p-1.5 whitespace-nowrap">
              {CATEGORIES.map((cat, i) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full px-4 py-1.5 font-display text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-petal transition-all"
                  data-ocid={`catalog.tab.${i + 1}`}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Bouquets */}
          <TabsContent value="Bouquets">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {BOUQUETS.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Polaroids */}
          <TabsContent value="Polaroids">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {POLAROIDS.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Polaroid Collections */}
          <TabsContent value="Polaroid Collections">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {POLAROID_COLLECTIONS.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Magazines */}
          <TabsContent value="Magazines">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/40 border border-primary/20 rounded-2xl px-5 py-3 mb-6 flex items-center gap-2 max-w-xl mx-auto"
            >
              <span className="text-xl">📝</span>
              <p className="font-display text-sm font-semibold text-foreground">
                ₹100 Extra For All Large Size magazines
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MAGAZINES.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Bookmarks */}
          <TabsContent value="Bookmarks">
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {BOOKMARKS.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Customized Cards */}
          <TabsContent value="Customized Cards">
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {CARDS.map((p) => {
                const idx = ++globalIdx;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={idx}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProducts.has(p.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Cute Accessories */}
          <TabsContent value="Cute Accessories">
            <div className="flex items-center justify-between mb-6">
              <p className="font-elegant italic text-muted-foreground text-sm">
                Premium handmade accessories
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border text-foreground hover:bg-accent text-xs gap-1.5 font-display"
                onClick={() => {
                  setEditPricesForm({
                    earrings: String(Number(prices.earrings)),
                    pipeCleanerFramework: String(
                      Number(prices.pipeCleanerFramework),
                    ),
                    keychain: String(Number(prices.keychain)),
                    scrunchies: String(Number(prices.scrunchies)),
                    pipeCleanerBag: String(Number(prices.pipeCleanerBag)),
                  });
                  setEditPricesOpen(true);
                }}
                data-ocid="product.edit_button"
              >
                <Pencil className="h-3 w-3" />
                Edit Prices
              </Button>
            </div>
            {pricesLoading ? (
              <div
                className="flex items-center justify-center py-16 gap-3 text-muted-foreground"
                data-ocid="product.loading_state"
              >
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="font-elegant italic">
                  Loading accessories...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {accessoryProducts.map((p) => {
                  const idx = ++globalIdx;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-card rounded-2xl shadow-petal border border-border overflow-hidden group"
                    >
                      <div className="bg-petal-pattern bg-petal min-h-[140px] flex items-center justify-center relative overflow-hidden">
                        <motion.div
                          className="text-5xl select-none"
                          animate={{ rotate: [0, 2, -2, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: idx * 0.3,
                          }}
                        >
                          {p.icon}
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                          <span className="text-rose-gold font-display font-bold text-base">
                            {p.price}
                          </span>
                          <Button
                            size="sm"
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 h-7 shadow-petal transition-all"
                            onClick={() => handleAddToCart(p)}
                            disabled={addingProducts.has(p.id)}
                            data-ocid={`product.add_to_cart_button.${idx}`}
                          >
                            {addingProducts.has(p.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Add to Cart"
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-4xl opacity-10">🌸</div>
          <div className="absolute bottom-4 left-4 text-3xl opacity-10">💐</div>
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-body tracking-[0.3em] uppercase text-primary/70 mb-4">
              ✦ Our Story ✦
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-5">
              About DESVA
            </h2>
            <p className="font-elegant text-lg md:text-xl text-foreground/80 italic leading-relaxed">
              "DESVA is a premium handmade customized gift brand creating cute
              and memorable gifts crafted with love."
            </p>
            <div className="mt-6 w-12 h-0.5 bg-primary/40 rounded-full mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ── ORDER SECTION ─────────────────────────────────────────────────────── */}
      <section id="order" className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <SectionHeading subtitle="Fill in the details and we'll take care of the rest">
          Order Through This Link
        </SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-3xl shadow-petal-lg border border-border p-6 md:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="customerName"
                className="font-display text-sm font-medium"
              >
                Customer Name *
              </Label>
              <Input
                id="customerName"
                placeholder="Your full name"
                value={orderForm.customerName}
                onChange={(e) =>
                  setOrderForm((f) => ({ ...f, customerName: e.target.value }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.customer_name_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="phoneNumber"
                className="font-display text-sm font-medium"
              >
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+91 XXXXX XXXXX"
                value={orderForm.phoneNumber}
                onChange={(e) =>
                  setOrderForm((f) => ({ ...f, phoneNumber: e.target.value }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.phone_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="instagramId"
                className="font-display text-sm font-medium"
              >
                Instagram ID
              </Label>
              <Input
                id="instagramId"
                placeholder="@yourhandle"
                value={orderForm.instagramId}
                onChange={(e) =>
                  setOrderForm((f) => ({ ...f, instagramId: e.target.value }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.instagram_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="productName"
                className="font-display text-sm font-medium"
              >
                Product Name *
              </Label>
              <Input
                id="productName"
                placeholder="What would you like to order?"
                value={orderForm.productName}
                onChange={(e) =>
                  setOrderForm((f) => ({ ...f, productName: e.target.value }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.product_name_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="quantity"
                className="font-display text-sm font-medium"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={orderForm.quantity}
                onChange={(e) =>
                  setOrderForm((f) => ({ ...f, quantity: e.target.value }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.quantity_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="deliveryDate"
                className="font-display text-sm font-medium"
              >
                Preferred Delivery Date
              </Label>
              <Input
                id="deliveryDate"
                type="date"
                value={orderForm.preferredDeliveryDate}
                onChange={(e) =>
                  setOrderForm((f) => ({
                    ...f,
                    preferredDeliveryDate: e.target.value,
                  }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary"
                data-ocid="order.date_input"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label
                htmlFor="customizationDetails"
                className="font-display text-sm font-medium"
              >
                Customization Details
              </Label>
              <Textarea
                id="customizationDetails"
                placeholder="Describe your customization (name, colors, design, etc.)"
                rows={3}
                value={orderForm.customizationDetails}
                onChange={(e) =>
                  setOrderForm((f) => ({
                    ...f,
                    customizationDetails: e.target.value,
                  }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary resize-none"
                data-ocid="order.customization_textarea"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label
                htmlFor="deliveryAddress"
                className="font-display text-sm font-medium"
              >
                Delivery Address
              </Label>
              <Textarea
                id="deliveryAddress"
                placeholder="Full delivery address with pincode"
                rows={2}
                value={orderForm.deliveryAddress}
                onChange={(e) =>
                  setOrderForm((f) => ({
                    ...f,
                    deliveryAddress: e.target.value,
                  }))
                }
                className="rounded-xl border-input bg-background focus-visible:ring-primary resize-none"
                data-ocid="order.address_textarea"
              />
            </div>
          </div>

          <AnimatePresence>
            {orderSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700 font-display"
                data-ocid="order.success_state"
              >
                🌸 Order placed successfully! We'll reach out soon.
              </motion.div>
            )}
            {orderError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-center text-sm text-red-700 font-display"
                data-ocid="order.error_state"
              >
                Something went wrong. Please try again or WhatsApp us.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold h-11 shadow-petal transition-all hover:shadow-petal-lg"
              onClick={handleSubmitOrder}
              disabled={submitOrderMutation.isPending}
              data-ocid="order.submit_button"
            >
              {submitOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "✦ Place Order"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 font-display font-semibold h-11 gap-2 transition-all"
              onClick={() =>
                window.open(
                  "https://wa.me/+917012345678?text=Hi+DESVA!+I%27d+like+to+place+an+order",
                  "_blank",
                )
              }
              data-ocid="order.whatsapp_button"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-[#25D366]"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.537 4.054 1.481 5.768L0 24l6.374-1.461A11.933 11.933 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.002-1.37l-.358-.213-3.713.85.882-3.608-.234-.37A9.829 9.829 0 0 1 2.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z" />
              </svg>
              Order on WhatsApp
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-16 px-4 bg-hero-gradient relative overflow-hidden"
        data-ocid="contact.section"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 text-3xl opacity-10">💌</div>
          <div className="absolute bottom-8 right-8 text-3xl opacity-10">
            🌸
          </div>
        </div>
        <div className="max-w-xl mx-auto text-center relative">
          <SectionHeading subtitle="We'd love to hear from you">
            Get In Touch
          </SectionHeading>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-petal border border-border p-8 space-y-5"
          >
            <div className="flex items-center justify-center gap-3">
              <Instagram className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold text-foreground text-lg">
                {contactDisplay.instagramHandle}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">✉️</span>
              <span className="font-elegant text-muted-foreground text-base">
                {contactDisplay.emailAddress}
              </span>
            </div>
            <p className="font-elegant italic text-muted-foreground text-base">
              "For any help, feel free to DM us on Instagram."
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-primary hover:bg-accent font-display text-xs gap-1.5 border border-primary/30"
              onClick={() => {
                setEditContactForm({
                  instagram: contactDisplay.instagramHandle,
                  email: contactDisplay.emailAddress,
                });
                setEditContactOpen(true);
              }}
              data-ocid="contact.edit_button"
            >
              <Pencil className="h-3 w-3" />
              Edit Contact Info
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
          <img
            src="/assets/uploads/IMG_20260302_225930_965-1.jpg"
            alt="DESVA"
            className="h-12 w-auto object-contain rounded opacity-90"
          />
          <p className="font-elegant italic text-muted-foreground text-sm">
            Personalized With Love
          </p>
          <a
            href={`https://www.instagram.com/${contactDisplay.instagramHandle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label="DESVA on Instagram"
            data-ocid="footer.instagram_link"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} DESVA. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 font-body">
              Built with <span className="text-primary">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ── CART SIDEBAR ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card z-50 flex flex-col shadow-petal-xl"
              data-ocid="cart.drawer"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-hero-gradient">
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Your Cart
                  </h2>
                  <p className="font-elegant italic text-xs text-muted-foreground">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent"
                  onClick={() => setCartOpen(false)}
                  data-ocid="cart.close_button"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                    data-ocid="cart.empty_state"
                  >
                    <div className="text-5xl">🛍️</div>
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        Your cart is empty
                      </p>
                      <p className="font-elegant italic text-muted-foreground text-sm mt-1">
                        Add something beautiful!
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-accent font-display text-sm"
                      onClick={() => {
                        setCartOpen(false);
                        scrollTo("catalog");
                      }}
                    >
                      Browse Collection
                    </Button>
                  </div>
                ) : (
                  cartItems.map((item, i) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 bg-background rounded-2xl p-3 border border-border"
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-medium text-sm text-foreground leading-snug line-clamp-2">
                          {item.productName}
                        </p>
                        <p className="text-rose-gold font-display font-bold text-sm mt-1">
                          ₹{Number(item.price)} × {Number(item.quantity)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        onClick={() => handleRemoveFromCart(item.productId)}
                        data-ocid={`cart.remove_button.${i + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="px-5 py-4 border-t border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-medium text-sm text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display font-bold text-lg text-rose-gold">
                      ₹
                      {cartItems.reduce(
                        (sum, item) =>
                          sum + Number(item.price) * Number(item.quantity),
                        0,
                      )}
                    </span>
                  </div>
                  <Button
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold h-11 shadow-petal"
                    onClick={() => {
                      setCartOpen(false);
                      const names = cartItems
                        .map((c) => c.productName)
                        .join(", ");
                      setOrderForm((f) => ({ ...f, productName: names }));
                      setTimeout(() => scrollTo("order"), 100);
                    }}
                    data-ocid="cart.proceed_button"
                  >
                    Proceed to Order ✦
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── EDIT PRICES MODAL ─────────────────────────────────────────────────── */}
      <Dialog open={editPricesOpen} onOpenChange={setEditPricesOpen}>
        <DialogContent className="rounded-2xl max-w-sm bg-card border-border shadow-petal-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-foreground">
              Edit Accessory Prices
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {[
              { key: "earrings", label: "Earrings (₹)" },
              {
                key: "pipeCleanerFramework",
                label: "Pipe Cleaner Framework (₹)",
              },
              { key: "keychain", label: "Keychain (₹)" },
              { key: "scrunchies", label: "Scrunchies (₹)" },
              { key: "pipeCleanerBag", label: "Pipe Cleaner Bag (₹)" },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <Label className="font-display text-xs font-medium text-muted-foreground">
                  {label}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={editPricesForm[key] ?? ""}
                  onChange={(e) =>
                    setEditPricesForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="rounded-xl h-9 border-input focus-visible:ring-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-border font-display text-sm"
              onClick={() => setEditPricesOpen(false)}
              data-ocid="product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full bg-primary text-primary-foreground font-display text-sm shadow-petal"
              onClick={handleSavePrices}
              disabled={updatePricesMutation.isPending}
              data-ocid="product.save_button"
            >
              {updatePricesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Save Prices
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT CONTACT MODAL ────────────────────────────────────────────────── */}
      <Dialog open={editContactOpen} onOpenChange={setEditContactOpen}>
        <DialogContent className="rounded-2xl max-w-sm bg-card border-border shadow-petal-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-foreground">
              Edit Contact Info
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="flex flex-col gap-1">
              <Label className="font-display text-xs font-medium text-muted-foreground">
                Instagram Handle
              </Label>
              <Input
                placeholder="@yourhandle"
                value={editContactForm.instagram}
                onChange={(e) =>
                  setEditContactForm((f) => ({
                    ...f,
                    instagram: e.target.value,
                  }))
                }
                className="rounded-xl border-input focus-visible:ring-primary"
                data-ocid="contact.instagram_input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="font-display text-xs font-medium text-muted-foreground">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={editContactForm.email}
                onChange={(e) =>
                  setEditContactForm((f) => ({ ...f, email: e.target.value }))
                }
                className="rounded-xl border-input focus-visible:ring-primary"
                data-ocid="contact.email_input"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-border font-display text-sm"
              onClick={() => setEditContactOpen(false)}
              data-ocid="contact.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full bg-primary text-primary-foreground font-display text-sm shadow-petal"
              onClick={handleSaveContact}
              disabled={updateContactMutation.isPending}
              data-ocid="contact.save_button"
            >
              {updateContactMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
