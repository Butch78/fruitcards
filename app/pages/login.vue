<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { loginWithGithub, isAuthenticated } = await useAuth();

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    navigateTo("/dashboards/one");
  }
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-default">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <div class="text-4xl mb-4">
            <UIcon name="i-lucide-cherry" class="text-primary" />
          </div>
          <h1 class="text-2xl font-bold">Welcome to Fruit Cards</h1>
          <p class="text-muted mt-2">Sign in to manage your personal tracking</p>
        </div>
      </template>

      <div class="space-y-4">
        <div v-if="isAuthenticated" class="text-center">
          <p>You're already signed in!</p>
          <UButton to="/dashboards/one" class="mt-4">Go to Dashboard</UButton>
        </div>
        <UButton
          v-else
          block
          size="lg"
          icon="i-simple-icons-github"
          @click="loginWithGithub"
        >
          Continue with GitHub
        </UButton>
      </div>

      <template #footer>
        <p class="text-center text-sm text-muted">
          By signing in, you agree to our terms of service.
        </p>
      </template>
    </UCard>
  </div>
</template>
