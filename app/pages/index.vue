<script setup lang="ts">
const { isAuthenticated, loginWithGithub } = await useAuth();
</script>

<template>
  <div>
    <UPageHero
      title="Your Personal Tracking Hub"
      description="Track transactions, manage events, capture learnings, and nurture relationships. All in one beautiful, secure app."
      :links="isAuthenticated ? [{
        label: 'Go to Dashboard',
        to: '/dashboards/one',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }] : [{
        label: 'Get Started',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        click: loginWithGithub
      }, {
        label: 'Learn More',
        to: '#features',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    />

    <UPageSection
      id="features"
      title="Everything you need to stay organized"
      description="A unified platform to track the things that matter most in your personal and professional life."
      :features="[{
        icon: 'i-lucide-wallet',
        title: 'Transactions',
        description: 'Track income and expenses with categories, recurring transactions, and insightful analytics.'
      }, {
        icon: 'i-lucide-calendar',
        title: 'Events',
        description: 'Never miss an important date. Manage events with reminders and keep your schedule organized.'
      }, {
        icon: 'i-lucide-book-open',
        title: 'Learnings',
        description: 'Capture knowledge as you go. Save notes, articles, and insights with tags for easy retrieval.'
      }, {
        icon: 'i-lucide-users',
        title: 'CRM',
        description: 'Build meaningful relationships. Track contacts, interactions, and never forget a connection.'
      }, {
        icon: 'i-lucide-shield-check',
        title: 'Secure by Design',
        description: 'Your data is protected with modern authentication and encrypted at rest on Cloudflare.'
      }, {
        icon: 'i-lucide-zap',
        title: 'Lightning Fast',
        description: 'Deployed on the edge for instant response times, no matter where you are in the world.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to get organized?"
        description="Start tracking your life today. Sign in with GitHub to get started."
        variant="subtle"
        :links="isAuthenticated ? [{
          label: 'Go to Dashboard',
          to: '/dashboards/one',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'neutral'
        }] : [{
          label: 'Sign in with GitHub',
          icon: 'i-simple-icons-github',
          color: 'neutral',
          click: loginWithGithub
        }]"
      />
    </UPageSection>
  </div>
</template>
