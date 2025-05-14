
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, X } from "lucide-react" // Added X for close button in Sheet

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button" // Added buttonVariants
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet" // Added SheetClose
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem" // 256px
const SIDEBAR_WIDTH_MOBILE = "18rem" // 288px
const SIDEBAR_WIDTH_ICON = "3.5rem" // 56px (increased for better touch/icon display)
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(() => {
      if (typeof window !== 'undefined') {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split("=")[1];
        if (cookieValue) {
          return cookieValue === 'true';
        }
      }
      return defaultOpen;
    });

    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((current) => !current)
        : setOpen((current) => !current)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={100}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon", // Default to icon collapsible for desktop
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile, open } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground z-50", // Added z-50
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }
    
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground flex flex-col" // Ensure flex column
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE, // Use mobile width variable
              } as React.CSSProperties
            }
            side={side}
          >
            {children}
             {/* Removed the explicit close button from here as SidebarHeader might contain one, or it can be part of Sheet's own close */}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group peer hidden md:flex flex-col text-sidebar-foreground z-50", // Ensure flex column, added z-50
          variant === "sidebar" && "bg-sidebar",
          className
        )}
        data-state={state}
        data-collapsible={collapsible} // Use collapsible directly
        data-variant={variant}
        data-side={side}
        style={{ width: open ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)', transition: 'width 0.2s ease-in-out' }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, isMobile, openMobile } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)} // Standardized size
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {isMobile && openMobile ? <X /> : <PanelLeft />} {/* Show X when mobile sidebar is open */}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> // Changed to main for semantic reasons, can be div
>(({ className, ...props }, ref) => {
  // const { open, isMobile } = useSidebar(); // No longer needed for margin calculation
  return (
    <main // Changed to main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background", // Removed transition-[margin-left] and conditional margins
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <div className={cn("p-2", state === "collapsed" && "px-1 py-2")}>
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-9 w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          state === "collapsed" && "hidden", // Hide text input when collapsed
          className
        )}
        placeholder={state === "expanded" ? "Search..." : ""}
        {...props}
      />
      {state === "collapsed" && (
         <Button variant="ghost" size="icon" className="w-full h-9">
            <PanelLeft className="h-5 w-5" /> {/* Placeholder for a search icon if needed */}
         </Button>
      )}
    </div>
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex items-center justify-between", className)} // Removed default padding
      {...props}
    >
      {children}
      {isMobile && (
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetClose>
      )}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto", className)} // Removed default padding, mt-auto to push to bottom
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "bg-sidebar-border",
        state === "expanded" ? "mx-2 w-auto" : "mx-auto w-[calc(100%-1rem)] my-1",
        className
      )}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2", // Added p-2 for consistent padding
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col", className)} // Removed default padding
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  const { state } = useSidebar();

  if (state === "collapsed") return null; // Don't render label if collapsed

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { state } = useSidebar();
  if (state === "collapsed") return null; // Don't render action if collapsed

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-2 top-1 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} // Adjusted gap
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:py-2 group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:w-10 group-data-[state=collapsed]:mx-auto [&>span:last-child]:truncate group-data-[state=collapsed]:[&>span:last-child]:hidden [&>svg]:size-5 [&>svg]:shrink-0 group-data-[state=collapsed]:[&>svg]:size-5",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-transparent border border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: { // Size variants for expanded state primarily
        default: "h-10", // Adjusted height for better spacing
        sm: "h-8 text-xs",
        lg: "h-12 text-base", // Adjusted for larger items
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement, // Changed to HTMLButtonElement for semantic correctness unless asChild is used with Link
  React.ComponentProps<"button"> & { // Changed from "a" to "button"
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children, // Explicitly include children
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button" // Was 'a', changed to 'button'
    const { isMobile, state } = useSidebar()

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size} // Use prop size for expanded state styling
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size, className }))} // Pass className here
        {...props}
      >
        {children}
      </Comp>
    )

    if (!tooltip || (typeof tooltip === 'object' && !tooltip.children)) { // Check if tooltip has content
      return buttonContent
    }

    const tooltipProps = typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip open={(state === "collapsed" && !isMobile && !!tooltipProps.children) ? undefined : false}>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        {state === "collapsed" && !isMobile && tooltipProps.children && (
            <TooltipContent
                side="right"
                align="center"
                className="ml-1" // Add a small margin
                {...tooltipProps} // Spread the rest of tooltip props
            />
        )}
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"


const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1.5 top-1/2 -translate-y-1/2 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-xs font-medium tabular-nums text-sidebar-primary-foreground bg-sidebar-primary select-none pointer-events-none",
        "peer-data-[active=true]/menu-button:text-sidebar-primary-foreground peer-data-[active=true]/menu-button:bg-sidebar-primary",
         // Positioning based on parent button's size can be tricky, this is a general approach
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"


const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = true, ...props }, ref) => { // Default showIcon to true
  const { state } = useSidebar();
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-10 flex gap-3 px-2 items-center", 
        state === "collapsed" && "justify-center w-10 mx-auto",
      className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-5 rounded-md bg-sidebar-accent" // Adjusted size and color
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {state === "expanded" && (
        <Skeleton
          className="h-4 flex-1 max-w-[--skeleton-width] bg-sidebar-accent" // Adjusted color
          data-sidebar="menu-skeleton-text"
          style={
            {
              "--skeleton-width": width,
            } as React.CSSProperties
          }
        />
      )}
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  if (state === "collapsed") return null;
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "ml-[calc(var(--sidebar-menu-button-padding-x,theme(spacing.2))_+_theme(spacing.5))] mr-2 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-sidebar-border pl-3 py-1",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} data-sidebar="menu-sub-item" {...props} />) // Added data attribute
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement, // Changed to button
  React.ComponentProps<"button"> & { // Changed from "a"
    asChild?: boolean
    size?: "sm" | "default" // Consistent with Button
    isActive?: boolean
  }
>(({ asChild = false, size = "default", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button" // Changed to button

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        buttonVariants({variant: "ghost", size}), // Use buttonVariants for consistency
        "w-full justify-start h-8 gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground",
        "data-[active=true]:text-sidebar-primary data-[active=true]:font-medium data-[active=true]:bg-sidebar-accent",
        "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/60 data-[active=true]:[&>svg]:text-sidebar-primary",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  // SidebarRail, // Removed as it's not fully implemented/used in this context
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

