<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Fruit Cards'
const description = 'Your personal tracking app for transactions, events, learnings, and contacts. Stay organized and in control.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const bannerVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    bannerVisible.value = true;
  }, 10000);
});

function hideBanner() {
  bannerVisible.value = false;
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <DiscountBanner class="z-50 max-w-4xl px-4 rounded-full mt-3 scale-110 top mx-auto" :visible="bannerVisible"
      @close="hideBanner" />

    <PwaInstallPrompt />
  </UApp>
</template>
