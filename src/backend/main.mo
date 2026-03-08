import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type Order = {
    customerName : Text;
    phoneNumber : Text;
    instagramId : Text;
    productName : Text;
    customizationDetails : Text;
    quantity : Nat;
    deliveryAddress : Text;
    preferredDeliveryDate : Text;
  };

  type CartItem = {
    productId : Text;
    productName : Text;
    price : Nat;
    quantity : Nat;
  };

  type ContactInfo = {
    instagramHandle : Text;
    emailAddress : Text;
  };

  type AccessoryPrices = {
    earrings : Nat;
    pipeCleanerFramework : Nat;
    keychain : Nat;
    scrunchies : Nat;
    pipeCleanerBag : Nat;
  };

  let allOrders = List.empty<Order>();
  let carts = Map.empty<Text, List.List<CartItem>>();
  var contactInfo : ContactInfo = {
    instagramHandle = "";
    emailAddress = "";
  };
  var accessoryPrices : AccessoryPrices = {
    earrings = 0;
    pipeCleanerFramework = 0;
    keychain = 0;
    scrunchies = 0;
    pipeCleanerBag = 0;
  };

  // Orders
  public shared ({ caller }) func submitOrder(order : Order) : async () {
    allOrders.add(order);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    allOrders.toArray();
  };

  // Cart
  public shared ({ caller }) func addToCart(sessionId : Text, item : CartItem) : async () {
    let cart = switch (carts.get(sessionId)) {
      case (null) { List.empty<CartItem>() };
      case (?existingCart) { existingCart };
    };
    cart.add(item);
    carts.add(sessionId, cart);
  };

  public query ({ caller }) func getCart(sessionId : Text) : async [CartItem] {
    switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("No cart found for this session") };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func clearCart(sessionId : Text) : async () {
    carts.remove(sessionId);
  };

  public shared ({ caller }) func removeItemFromCart(sessionId : Text, productId : Text) : async () {
    switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("No cart found for this session") };
      case (?cart) {
        let filteredCart = cart.filter(func(item) { item.productId != productId });
        carts.add(sessionId, filteredCart);
      };
    };
  };

  // Contact Info
  public shared ({ caller }) func updateContactInfo(instagramHandle : Text, emailAddress : Text) : async () {
    contactInfo := {
      instagramHandle;
      emailAddress;
    };
  };

  public query ({ caller }) func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  // Accessory Prices
  public shared ({ caller }) func updateAccessoryPrices(
    earrings : Nat,
    pipeCleanerFramework : Nat,
    keychain : Nat,
    scrunchies : Nat,
    pipeCleanerBag : Nat,
  ) : async () {
    accessoryPrices := {
      earrings;
      pipeCleanerFramework;
      keychain;
      scrunchies;
      pipeCleanerBag;
    };
  };

  public query ({ caller }) func getAccessoryPrices() : async AccessoryPrices {
    accessoryPrices;
  };
};
