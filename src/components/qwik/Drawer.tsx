/** @jsxImportSource @builder.io/qwik */
import {
  component$,
  useSignal,
  useVisibleTask$,
  useTask$,
  $,
  type QwikIntrinsicElements,
  Slot,
  type PropFunction,
} from "@builder.io/qwik";

export interface DrawerProps {
  show: boolean;
  onClose: PropFunction<() => void>;
  children?: any;
  class?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  animationDuration?: number;
}

export interface DrawerProps {
  show: boolean;
  onClose: PropFunction<() => void>;
  children?: any;
  class?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Drawer = component$<DrawerProps>(
  ({
    show,
    onClose,
    children,
    class: className = "",
    width = "md",
    animationDuration = 300,
  }) => {
    const backdropRef = useSignal<HTMLDivElement>();
    const drawerRef = useSignal<HTMLDivElement>();
    const isVisible = useSignal(false);
    const isAnimating = useSignal(false);
    const shouldRender = useSignal(false);

    // Width variants
    const widthClasses = {
      sm: "w-full md:w-[300px]",
      md: "w-full md:w-[400px]",
      lg: "w-full md:w-[500px]",
      xl: "w-full md:w-[600px]",
      full: "w-full",
    };

    // Animation state management
    useTask$(({ track }) => {
      track(() => show);

      if (show) {
        // Opening animation
        shouldRender.value = true;
        isAnimating.value = true;

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          isVisible.value = true;
        });

        // Animation complete
        setTimeout(() => {
          isAnimating.value = false;
        }, animationDuration);
      } else {
        // Closing animation
        isAnimating.value = true;
        isVisible.value = false;

        // Remove from DOM after animation
        setTimeout(() => {
          shouldRender.value = false;
          isAnimating.value = false;
        }, animationDuration);
      }
    });

    // Handle escape key
    const handleKeyDown = $((event: KeyboardEvent) => {
      if (event.key === "Escape" && show) {
        onClose();
      }
    });

    // Handle backdrop click
    const handleBackdropClick = $((event: MouseEvent) => {
      if (event.target === backdropRef.value) {
        onClose();
      }
    });

    // Body scroll lock effect
    useVisibleTask$(({ track, cleanup }) => {
      track(() => show);

      if (show) {
        // Prevent body scroll when drawer is open
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
      } else {
        // Restore body scroll when drawer is closed
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      }

      cleanup(() => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      });
    });

    return (
      <>
        {/* Backdrop */}
        {shouldRender.value && (
          <div
            ref={backdropRef}
            class={`
              fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
              transition-opacity ease-out
              ${isVisible.value ? "opacity-100" : "opacity-0"}
            `}
            style={{
              transitionDuration: `${animationDuration}ms`,
            }}
            onClick$={handleBackdropClick}
            role="button"
            tabIndex={-1}
            aria-label="Close drawer"
          />
        )}

        {/* Drawer */}
        {shouldRender.value && (
          <div
            ref={drawerRef}
            class={`
              fixed top-0 right-0 h-full z-50 bg-white overflow-y-auto shadow-xl
              transition-transform ease-out transform
              ${widthClasses[width]}
              ${isVisible.value ? "translate-x-0" : "translate-x-full"}
              ${className}
            `}
            style={{
              transitionDuration: `${animationDuration}ms`,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Close Button */}
            <button
              onClick$={onClose}
              class="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-700 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close drawer"
              type="button"
            >
              ✕
            </button>

            {/* Content */}
            <div
              class={`
                p-6 pt-14 transition-opacity ease-out
                ${isVisible.value ? "opacity-100" : "opacity-0"}
              `}
              style={{
                transitionDuration: `${animationDuration * 0.5}ms`,
                transitionDelay: isVisible.value
                  ? `${animationDuration * 0.3}ms`
                  : "0ms",
              }}
            >
              <Slot />
            </div>
          </div>
        )}
      </>
    );
  }
);

export default Drawer;
