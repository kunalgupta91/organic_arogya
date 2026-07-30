"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, updateCartItemQuantity } from "@/services/cart-service";

export async function addToCartAction(productId: string, quantity = 1) {
  await addToCart(productId, quantity);
  revalidatePath("/", "layout");
}

export async function updateCartItemAction(productId: string, quantity: number) {
  await updateCartItemQuantity(productId, quantity);
  revalidatePath("/", "layout");
}

export async function removeFromCartAction(productId: string) {
  await removeFromCart(productId);
  revalidatePath("/", "layout");
}
