"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    onClick?: () => void;
    isActive?: boolean;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-4 z-50 w-full px-4 sm:px-6 lg:px-8", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "blur(12px)",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)"
          : "0 4px 20px rgba(0, 0, 0, 0.2)",
        width: visible ? "65%" : "100%",
        y: visible ? 10 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 35,
      }}
      style={{
        minWidth: "750px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-[#051424]/90 border border-white/10 px-6 py-2.5 lg:flex backdrop-blur-md shadow-2xl",
        visible && "bg-[#051424]/95 border-amber-400/30",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
            if (onItemClick) onItemClick();
          }}
          className={cn(
            "relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
            item.isActive
              ? "text-[#F3BA2F] font-extrabold"
              : "text-[#D4E4FA]/80 hover:text-white"
          )}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-white/10 border border-white/10"
            />
          )}
          <span className="relative z-20 flex items-center gap-1.5">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "blur(10px)",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)"
          : "none",
        width: visible ? "95%" : "100%",
        paddingRight: visible ? "16px" : "12px",
        paddingLeft: visible ? "16px" : "12px",
        borderRadius: visible ? "1.5rem" : "9999px",
        y: visible ? 10 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 35,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-[#051424]/90 border border-white/10 px-4 py-2.5 lg:hidden rounded-full backdrop-blur-md shadow-2xl",
        visible && "bg-[#051424]/95 border-amber-400/30",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl bg-[#051424] border border-white/15 px-6 py-6 shadow-2xl backdrop-blur-xl",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-white cursor-pointer w-6 h-6 hover:text-[#F3BA2F]" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-white cursor-pointer w-6 h-6 hover:text-[#F3BA2F]" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2.5 px-2 py-1 font-bold text-white group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#F3BA2F]/10 border border-[#F3BA2F]/30 flex items-center justify-center text-[#F3BA2F] group-hover:scale-105 transition-transform">
        <span className="font-mono text-sm font-extrabold">⚡</span>
      </div>
      <span className="font-extrabold text-lg tracking-tight text-[#F3BA2F] text-glow">AutoDeposit</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-xl text-xs font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-md active:scale-95";

  const variantStyles = {
    primary:
      "bg-[#F3BA2F] text-[#0B0F17] hover:shadow-[0_0_15px_rgba(243,186,47,0.4)]",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
    dark: "bg-[#080B12] text-white border border-white/10 hover:border-white/20",
    gradient:
      "bg-gradient-to-r from-[#F3BA2F] to-[#f7be33] text-[#0B0F17] hover:shadow-[0_0_20px_rgba(243,186,47,0.5)]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
