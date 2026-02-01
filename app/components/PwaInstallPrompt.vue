<script setup lang="ts">
const { $pwa } = useNuxtApp();

const needRefresh = computed(() => $pwa?.needRefresh ?? false);
const offlineReady = computed(() => $pwa?.offlineReady ?? false);

function updateServiceWorker() {
  $pwa?.updateServiceWorker?.();
}

const installPrompt = ref<Event | null>(null);
const showInstallBanner = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt.value = e;
    showInstallBanner.value = true;
  });
});

async function installApp() {
  if (!installPrompt.value) return;

  const prompt = installPrompt.value as any;
  prompt.prompt();

  const { outcome } = await prompt.userChoice;
  if (outcome === 'accepted') {
    showInstallBanner.value = false;
  }
  installPrompt.value = null;
}

function dismissInstall() {
  showInstallBanner.value = false;
}

function refreshApp() {
  updateServiceWorker();
}
</script>

<template>
  <!-- Install Banner -->
  <div
    v-if="showInstallBanner"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-emerald-600 dark:bg-emerald-700 rounded-lg shadow-lg p-4 z-50"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-white font-semibold">Install Fruit Cards</h3>
        <p class="text-emerald-100 text-sm mt-1">
          Add to your home screen for quick access and offline gym tracking
        </p>
        <div class="flex gap-2 mt-3">
          <UButton
            color="neutral"
            size="sm"
            @click="installApp"
          >
            Install
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="dismissInstall"
          >
            Not now
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Update Available Banner -->
  <div
    v-if="needRefresh"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 dark:bg-blue-700 rounded-lg shadow-lg p-4 z-50"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-white font-semibold">Update Available</h3>
        <p class="text-blue-100 text-sm mt-1">
          A new version is available. Refresh to update.
        </p>
        <div class="flex gap-2 mt-3">
          <UButton
            color="neutral"
            size="sm"
            @click="refreshApp"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Offline Ready Toast -->
  <div
    v-if="offlineReady"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg p-4 z-50"
  >
    <div class="flex items-center gap-3">
      <UIcon name="i-heroicons-wifi" class="w-5 h-5 text-emerald-400" />
      <p class="text-white text-sm">App ready for offline use</p>
    </div>
  </div>
</template>
