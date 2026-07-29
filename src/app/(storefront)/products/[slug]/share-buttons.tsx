import { MessageCircle } from "lucide-react";
import { FacebookIcon, TwitterIcon } from "@/components/icons/social-icons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: TwitterIcon,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Share:</span>
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="border-border text-muted-foreground hover:text-primary-600 rounded-full border p-2"
        >
          <Icon size={14} />
        </a>
      ))}
    </div>
  );
}
