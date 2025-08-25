/** @export const DrawerDemo = component$(() => {
  const isDrawerOpen = useSignal(false);
  const drawerWidth = useSignal<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  

  const openDrawer = $(() => {
    isDrawerOpen.value = true;
  });

  const closeDrawer = $(() => {
    isDrawerOpen.value = false;
  });

  const setWidth = $((width: 'sm' | 'md' | 'lg' | 'xl' | 'full') => {
    drawerWidth.value = width;
    isDrawerOpen.value = true;
  });


  @builder.io/qwik */
import { component$, useSignal, $ } from "@builder.io/qwik";
import { Drawer } from "./Drawer";
import { Button } from "./ui/Button";

export const DrawerDemo = component$(() => {
  const isDrawerOpen = useSignal(false);
  const drawerWidth = useSignal<"sm" | "md" | "lg" | "xl" | "full">("md");
  const animationDuration = useSignal(300);
  const openDrawer = $(() => {
    isDrawerOpen.value = true;
  });
  const setDuration = $((duration: number) => {
    animationDuration.value = duration;
    isDrawerOpen.value = true;
  });
  const closeDrawer = $(() => {
    isDrawerOpen.value = false;
  });

  const setWidth = $((width: "sm" | "md" | "lg" | "xl" | "full") => {
    drawerWidth.value = width;
    isDrawerOpen.value = true;
  });

  return (
    <div class="p-8 space-y-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          🗂️ Qwik Drawer Component Demo
        </h1>

        {/* Basic Demo */}
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Usage</h2>
          <p class="text-gray-600 mb-4">
            Click the button below to open a basic drawer with default settings.
          </p>

          <Button onClick$={openDrawer} variant="primary">
            Open Drawer
          </Button>
        </div>

        {/* Animation Speed Controls */}
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Animation Speed
          </h2>
          <p class="text-gray-600 mb-4">Test different animation speeds:</p>

          <div class="flex flex-wrap gap-3 mb-4">
            <Button
              onClick$={() => setDuration(150)}
              variant="secondary"
              size="sm"
            >
              Fast (150ms)
            </Button>
            <Button
              onClick$={() => setDuration(300)}
              variant="secondary"
              size="sm"
            >
              Normal (300ms)
            </Button>
            <Button
              onClick$={() => setDuration(500)}
              variant="secondary"
              size="sm"
            >
              Slow (500ms)
            </Button>
            <Button
              onClick$={() => setDuration(800)}
              variant="secondary"
              size="sm"
            >
              Very Slow (800ms)
            </Button>
          </div>

          <div class="text-sm text-gray-600">
            Current duration:{" "}
            <span class="font-medium">{animationDuration.value}ms</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Width Variants
          </h2>
          <p class="text-gray-600 mb-4">Try different drawer widths:</p>

          <div class="flex flex-wrap gap-3">
            <Button
              onClick$={() => setWidth("sm")}
              variant="secondary"
              size="sm"
            >
              Small (300px)
            </Button>
            <Button
              onClick$={() => setWidth("md")}
              variant="secondary"
              size="sm"
            >
              Medium (400px)
            </Button>
            <Button
              onClick$={() => setWidth("lg")}
              variant="secondary"
              size="sm"
            >
              Large (500px)
            </Button>
            <Button
              onClick$={() => setWidth("xl")}
              variant="secondary"
              size="sm"
            >
              Extra Large (600px)
            </Button>
            <Button
              onClick$={() => setWidth("full")}
              variant="secondary"
              size="sm"
            >
              Full Width
            </Button>
          </div>
        </div>

        {/* Features */}
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">✨ Features</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Smooth slide-in/out animation</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Customizable animation speed</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Backdrop blur effect</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Click outside to close</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Escape key support</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Body scroll lock</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Accessibility features</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Responsive design</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500">✅</span>
                <span class="text-gray-700">Customizable width</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer
        show={isDrawerOpen.value}
        onClose={closeDrawer}
        width={drawerWidth.value}
        animationDuration={animationDuration.value}
      >
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2" id="drawer-title">
              Drawer Content
            </h3>
            <p class="text-gray-600">
              This is the content inside the drawer. You can put any content
              here including forms, navigation menus, or detailed information.
            </p>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">
              Current Settings
            </h4>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <p class="text-sm text-gray-600">
                <strong>Width:</strong> {drawerWidth.value} (
                {drawerWidth.value === "sm"
                  ? "300px"
                  : drawerWidth.value === "md"
                  ? "400px"
                  : drawerWidth.value === "lg"
                  ? "500px"
                  : drawerWidth.value === "xl"
                  ? "600px"
                  : "Full width"}
                )
              </p>
              <p class="text-sm text-gray-600">
                <strong>Animation Duration:</strong> {animationDuration.value}ms
              </p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">
              Navigation Example
            </h4>
            <nav class="space-y-2">
              <a
                href="#"
                class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#"
                class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Projects
              </a>
              <a
                href="#"
                class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Team
              </a>
              <a
                href="#"
                class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Settings
              </a>
            </nav>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Actions</h4>
            <div class="flex gap-3">
              <Button onClick$={closeDrawer} variant="primary" size="sm">
                Close Drawer
              </Button>
              <Button
                onClick$={() => setWidth("lg")}
                variant="secondary"
                size="sm"
              >
                Make Larger
              </Button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">
              Scroll Test
            </h4>
            <div class="space-y-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} class="bg-gray-50 rounded-lg p-4">
                  <h5 class="font-medium text-gray-900">Item {i + 1}</h5>
                  <p class="text-gray-600 text-sm">
                    This is some content to test the scrolling behavior of the
                    drawer. You should be able to scroll through this content
                    while the body remains locked.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
});

export default DrawerDemo;
