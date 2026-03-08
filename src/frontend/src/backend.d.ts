import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AccessoryPrices {
    pipeCleanerBag: bigint;
    pipeCleanerFramework: bigint;
    scrunchies: bigint;
    earrings: bigint;
    keychain: bigint;
}
export interface CartItem {
    productId: string;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    customerName: string;
    deliveryAddress: string;
    customizationDetails: string;
    productName: string;
    preferredDeliveryDate: string;
    quantity: bigint;
    phoneNumber: string;
    instagramId: string;
}
export interface ContactInfo {
    instagramHandle: string;
    emailAddress: string;
}
export interface backendInterface {
    addToCart(sessionId: string, item: CartItem): Promise<void>;
    clearCart(sessionId: string): Promise<void>;
    getAccessoryPrices(): Promise<AccessoryPrices>;
    getAllOrders(): Promise<Array<Order>>;
    getCart(sessionId: string): Promise<Array<CartItem>>;
    getContactInfo(): Promise<ContactInfo>;
    removeItemFromCart(sessionId: string, productId: string): Promise<void>;
    submitOrder(order: Order): Promise<void>;
    updateAccessoryPrices(earrings: bigint, pipeCleanerFramework: bigint, keychain: bigint, scrunchies: bigint, pipeCleanerBag: bigint): Promise<void>;
    updateContactInfo(instagramHandle: string, emailAddress: string): Promise<void>;
}
