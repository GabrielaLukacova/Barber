<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useServicesStore } from '@/stores/services';

const servicesStore = useServicesStore();

function formatPrice(price: number) {
  return `${price} kr`;
}

onMounted(() => {
  servicesStore.loadServices();
});

const services = computed(() => servicesStore.services);
const loading = computed(() => servicesStore.loading);
const error = computed(() => servicesStore.error);
</script>

<template>
  <section
    id="services"
    class="relative z-30 overflow-visible"
    style="margin-top: calc(-1 * var(--services-overlap)); --services-overlap: 15vh"
  >
    <div class="section-block">
      <div style="margin-top: calc(-1 * clamp(48px, 5vw, 64px))">
        <div
          class="relative border-zinc-800/70 backdrop-blur-md shadow-[0_-26px_70px_rgba(0,0,0,0.60),0_26px_90px_rgba(0,0,0,0.35)]"
          style="background: rgba(15, 18, 22, 0.58)"
        >
          <div class="p-6 sm:p-8">
            <div class="section-head">
              <p class="section-kicker">Services</p>
            </div>

            <p v-if="error" class="text-sm text-red-400 text-center">
              {{ error }}
            </p>

            <p v-else-if="loading" class="text-sm text-zinc-200 text-center">
              Loading services…
            </p>

            <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <article
                v-for="svc in services"
                :key="svc.serviceID"
                class="border border-zinc-800/80 bg-black/20"
              >
                <div class="relative border-b border-zinc-800/80 bg-black/30">
                  <div class="aspect-[4/3] w-full overflow-hidden">
                    <img
                      v-if="svc.imagePath"
                      :src="svc.imagePath"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center">
                      <span class="text-[11px] text-zinc-400 uppercase tracking-wider">
                        No image
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-5 space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <h3 class="text-[15px] font-semibold text-zinc-100 leading-snug">
                      {{ svc.name }}
                    </h3>

                    <div class="text-right flex-shrink-0">
                      <div class="text-[15px] font-semibold text-zinc-100 whitespace-nowrap">
                        {{ formatPrice(svc.price) }}
                      </div>
                      <div class="mt-1 text-xs text-zinc-300/80 whitespace-nowrap">
                        {{ svc.duration }} min
                      </div>
                    </div>
                  </div>

                  <p
                    v-if="svc.isBooked"
                    class="inline-flex items-center gap-2 border border-[#C7A47D]/35 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C7A47D]"
                  >
                    Not bookable
                  </p>
                </div>
              </article>

              <p
                v-if="services.length === 0"
                class="col-span-full text-center text-sm text-zinc-300/80"
              >
                No services are available yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-head {
  text-align: center;
  margin: 0 0 24px 0;
}
.section-kicker {
  margin: 0 0 10px 0;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(161, 161, 170, 0.9);
}
</style>