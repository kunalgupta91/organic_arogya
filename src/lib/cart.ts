import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CART_COOKIE = "cart_session";

/**
 * Read-only cart lookup — safe to call from any Server Component render
 * (Next.js forbids writing cookies outside Server Actions/Route Handlers).
 * Returns null if the visitor has no cart yet; never creates one.
 */
export async function getCart() {
  const session = await auth();
  if (session?.user) {
    return prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  }

  const store = await cookies();
  const sessionToken = store.get(CART_COOKIE)?.value;
  if (!sessionToken) return null;

  return prisma.cart.findUnique({
    where: { sessionToken },
    include: { items: { include: { product: true } } },
  });
}

/**
 * Resolves the current cart, creating one (and setting the guest cookie)
 * if needed. Only callable from Server Actions or Route Handlers — never
 * from a plain page/layout render.
 */
export async function getOrCreateCart() {
  const session = await auth();

  if (session?.user) {
    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
    await mergeGuestCartIfPresent(cart.id, session.user.id);
    return cart;
  }

  const store = await cookies();
  let sessionToken = store.get(CART_COOKIE)?.value;
  if (!sessionToken) {
    sessionToken = nanoid();
    store.set(CART_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });
  }

  return prisma.cart.upsert({
    where: { sessionToken },
    update: {},
    create: { sessionToken },
    include: { items: { include: { product: true } } },
  });
}

async function mergeGuestCartIfPresent(userCartId: string, userId: string) {
  const store = await cookies();
  const guestToken = store.get(CART_COOKIE)?.value;
  if (!guestToken) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionToken: guestToken },
    include: { items: true },
  });
  if (!guestCart || guestCart.userId === userId) return;

  for (const item of guestCart.items) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: userCartId, productId: item.productId } },
      update: { quantity: { increment: item.quantity } },
      create: { cartId: userCartId, productId: item.productId, quantity: item.quantity },
    });
  }
  await prisma.cart.delete({ where: { id: guestCart.id } });
  store.delete(CART_COOKIE);
}
