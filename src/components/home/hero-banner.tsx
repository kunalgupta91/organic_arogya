"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";

export function HeroBanner({
  imageUrl,
  title,
  linkUrl,
}: {
  imageUrl: string;
  title: string;
  linkUrl: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="px-4 pt-6 sm:px-6">
        <Link href={linkUrl} className="mx-auto block max-w-7xl overflow-hidden rounded-[2rem]">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[16/7] w-full"
          >
            <Image src={imageUrl} alt={title} fill priority className="object-cover" />
          </motion.div>
        </Link>
      </section>
    </MotionConfig>
  );
}
