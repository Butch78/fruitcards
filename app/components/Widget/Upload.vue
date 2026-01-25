<template>
  <UCard
    :ui="{ header: 'p-4', body: 'p-6', footer: 'p-4' }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">Add a writer</h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          aria-label="Close"
          @click="open = false"
        />
      </div>
    </template>

    <UForm
      id="add-writer-form"
      :state="state"
      :validate="validate"
      class="grid grid-cols-12 gap-6"
      @submit="onSubmit"
    >
      <!-- Left: avatar / upload -->
      <div class="col-span-12 md:col-span-4">
        <div class="flex flex-col items-center gap-3">
          <div class="relative">
            <UAvatar :src="preview || undefined" alt="Avatar" size="xl" />
            <UButton
              class="absolute -bottom-1 -right-1 rounded-full"
              size="xs"
              color="primary"
              icon="i-lucide-plus"
              aria-label="Add Image"
              variant="solid"
              @click="pickFile"
            />
          </div>
          <div class="text-center">
            <div class="text-sm text-default">Upload Image</div>
            <div class="text-xs text-muted">Max file size: 1MB</div>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            label="Add Image"
            @click="pickFile"
          />
          <input
            ref="fileEl"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          />
        </div>
      </div>

      <!-- Right: form fields -->
      <div class="col-span-12 md:col-span-8 space-y-4">
        <UFormField label="Author name" name="name" required>
          <UInput v-model="state.name" placeholder="James Brown" />
        </UFormField>

        <UFormField label="Title" name="title" hint="What’s their role?">
          <UInput v-model="state.title" placeholder="Marketing Manager" />
        </UFormField>
      </div>
    </UForm>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancel"
          @click="open = false"
        />
        <UButton
          type="submit"
          form="add-writer-form"
          label="Save Changes"
          :loading="saving"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui";
type FormState = {
  name: string;
  title: string;
};

const open = ref(false);
const saving = ref(false);
const state = reactive<FormState>({ name: "", title: "" });

const fileEl = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const preview = ref<string | null>(null);
const MAX = 1024 * 1024; // 1MB

function pickFile() {
  fileEl.value?.click();
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  if (f.size > MAX) {
    useToast().add({
      title: "Image too large",
      description: "Please select an image under 1MB.",
      color: "error",
    });
    (e.target as HTMLInputElement).value = "";
    return;
  }
  file.value = f;
  const reader = new FileReader();
  reader.onload = () => (preview.value = reader.result as string);
  reader.readAsDataURL(f);
}

function validate(current: FormState): FormError[] {
  const errors: FormError[] = [];
  if (!current.name?.trim())
    errors.push({ name: "name", message: "Author name is required" });
  if (file.value && file.value.size > MAX)
    errors.push({ name: "image", message: "Image must be less than 1MB" });
  return errors;
}

async function onSubmit() {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 700));
  useToast().add({ title: "Saved", description: "Writer added successfully." });
  saving.value = false;
  open.value = false;
  // Reset form (optional)
  state.name = "";
  state.title = "";
  file.value = null;
  preview.value = null;
}
</script>
