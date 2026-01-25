import { ref, onUnmounted } from 'vue';

export function useHorizontalDragScroll() {
  const container = ref<HTMLElement | null>(null);
  const isDragging = ref(false);
  let startX = 0;
  let scrollLeft = 0;

  function onDragStart(e: MouseEvent) {
    if (!container.value) return;
    isDragging.value = true;
    startX = e.pageX - container.value.offsetLeft;
    scrollLeft = container.value.scrollLeft;
    document.body.style.userSelect = 'none';
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging.value || !container.value) return;
    const x = e.pageX - container.value.offsetLeft;
    const walk = (x - startX) * 1;
    container.value.scrollLeft = scrollLeft - walk;
  }

  function onDragEnd() {
    isDragging.value = false;
    document.body.style.userSelect = '';
  }

  function onTouchStart(e: TouchEvent) {
    if (!container.value || !e.touches[0]) return;
    isDragging.value = true;
    startX = e.touches[0].pageX - container.value.offsetLeft;
    scrollLeft = container.value.scrollLeft;
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging.value || !container.value || !e.touches[0]) return;
    const x = e.touches[0].pageX - container.value.offsetLeft;
    const walk = (x - startX) * 1;
    container.value.scrollLeft = scrollLeft - walk;
  }

  // Clean up user-select on unmount
  onUnmounted(() => {
    document.body.style.userSelect = '';
  });

  return {
    container,
    onDragStart,
    onDragMove,
    onDragEnd,
    onTouchStart,
    onTouchMove,
  };
}
