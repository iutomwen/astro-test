/** @jsxImportSource @builder.io/qwik */
import { component$, useSignal, $ } from "@builder.io/qwik";

// TypeScript interfaces for type safety
export interface SubmenuItem {
  label: string;
  link: string;
  description?: string;
}

export interface NavItem {
  label: string;
  link: string;
  submenu?: SubmenuItem[];
}

export interface MegaMenuProps {
  primaryNav: NavItem[];
}

export const MegaMenu = component$<MegaMenuProps>(({ primaryNav }) => {
  // Qwik signal replaces Alpine.js x-data="{ open: null }"
  const openMenuIndex = useSignal<number | null>(null);

  // Event handlers using Qwik's $ syntax for serialization
  const handleMouseEnter = $((index: number) => {
    openMenuIndex.value = index;
  });

  const handleMouseLeave = $(() => {
    openMenuIndex.value = null;
  });

  return (
    <div class="relative w-full">
      <ul class="flex gap-6 text-black">
        {primaryNav.map((item, index) => (
          <li key={index} class="relative xl:mx-5 lg:mx-2">
            <a
              href={item.link}
              class="hover:text-gray-900 block py-2 font-bold"
              onMouseEnter$={() => handleMouseEnter(index)}
              onMouseLeave$={handleMouseLeave}
            >
              {item.label}
            </a>

            {item.submenu && item.submenu.length > 0 && (
              <div
                class={`absolute top-full bg-white bg-opacity-95 backdrop-blur shadow-lg border-t border-gray-100 z-50 rounded-md transition-all duration-200 ease-out ${
                  openMenuIndex.value === index
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "calc(60vw)",
                }}
                onMouseEnter$={() => handleMouseEnter(index)}
                onMouseLeave$={handleMouseLeave}
              >
                {/* Arrow pointer */}
                <div
                  class="absolute -top-1 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />

                <div class="px-8 py-8">
                  <div class="grid grid-cols-3 gap-8 max-w-6xl">
                    {item.submenu.map((sub, subIndex) => (
                      <a
                        key={subIndex}
                        href={sub.link}
                        class="block p-6 rounded-xl transition-colors hover:border-gray-200 hover:bg-cyan-50"
                      >
                        <div class="font-semibold text-gray-900 text-xl mb-3">
                          {sub.label}
                        </div>
                        {sub.description && (
                          <p class="text-sm text-gray-600 leading-relaxed">
                            {sub.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default MegaMenu;
