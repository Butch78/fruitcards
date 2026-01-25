<script setup lang="ts">
const toast = useToast();

const profile = reactive({
  firstName: "Josef",
  lastName: "Albers",
  email: "josef@subframe.com",
});

const password = reactive({
  current: "",
  new: "",
  confirm: "",
});

const avatarUrl = ref("https://github.com/nuxt.png");

const fileInput = ref<HTMLInputElement | null>(null);
function triggerUpload() {
  fileInput.value?.click();
}
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    avatarUrl.value = URL.createObjectURL(file);
  }
}

async function submitPassword() {
  toast.add({ title: "Password updated" });
}

function confirmDelete() {
  if (confirm("This will permanently delete your account. Continue?")) {
    toast.add({ title: "Account deleted", color: "error" });
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Account">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl mx-auto py-8 2xl:py-24">
        <!-- Profile -->
        <div class="mb-10">
          <h2 class="text-lg font-semibold mb-4">Profile</h2>
          <UCard>
            <div class="flex items-center gap-4 mb-2">
              <UAvatar :src="avatarUrl" size="lg" class="rounded-full" />

              <div class="flex items-center gap-3">
                <UButton
                  icon="i-lucide-upload"
                  label="Upload"
                  color="neutral"
                  variant="soft"
                  @click="triggerUpload"
                />
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                >
              </div>
            </div>
            <p class="text-dimmed text-sm mb-6">
              For best results, upload an image 512×512 or larger.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="First name" name="firstName">
                <UInput v-model="profile.firstName" placeholder="First name" />
              </UFormField>
              <UFormField label="Last name" name="lastName">
                <UInput v-model="profile.lastName" placeholder="Last name" />
              </UFormField>
            </div>
            <div class="mt-4">
              <UFormField label="Email" name="email">
                <UInput
                  v-model="profile.email"
                  type="email"
                  placeholder="you@example.com"
                />
              </UFormField>
            </div>
          </UCard>
        </div>

        <!-- Password -->
        <div class="mb-10">
          <h2 class="text-lg font-semibold mb-4">Password</h2>
          <UCard>
            <UForm :state="password" class="space-y-4" @submit="submitPassword">
              <UFormField label="Current password" name="currentPassword">
                <UInput
                  v-model="password.current"
                  type="password"
                  placeholder="Enter current password"
                />
              </UFormField>

              <UFormField
                label="New password"
                name="newPassword"
                hint="Your password must have at least 8 characters, include one uppercase letter, and one number."
              >
                <UInput
                  v-model="password.new"
                  type="password"
                  placeholder="Enter new password"
                />
              </UFormField>

              <UFormField label="Re-type new password" name="confirmPassword">
                <UInput
                  v-model="password.confirm"
                  type="password"
                  placeholder="Re-type new password"
                />
              </UFormField>

              <div>
                <UButton type="submit" label="Change password" />
              </div>
            </UForm>
          </UCard>
        </div>

        <!-- Danger zone -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Danger zone</h2>
          <UCard>
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="font-semibold text-error mb-1">Delete account</div>
                <div class="text-dimmed text-sm">
                  Permanently remove your account. This action is not
                  reversible.
                </div>
              </div>
              <UButton
                color="error"
                variant="soft"
                label="Delete account"
                @click="confirmDelete"
              />
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
