<script setup lang="ts">
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { onMounted, computed } from 'vue';
import { useServicesStore } from '@/stores/services';

const servicesStore = useServicesStore();

// Hardcoded backend base as fallback so images ALWAYS work
const backendBase = 'https://barber-backend-b77j.onrender.com';


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
      <!-- cancel ONLY the TOP padding of section-block locally -->
      <div style="margin-top: calc(-1 * clamp(48px, 5vw, 64px))">
        <!-- semi-transparent glass plate -->
        <div
          class="relative border-zinc-800/70 backdrop-blur-md shadow-[0_-26px_70px_rgba(0,0,0,0.60),0_26px_90px_rgba(0,0,0,0.35)]"
          style="background: rgba(15, 18, 22, 0.58)"
        >
          <!-- 3D lip -->
          <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#C7A47D]/55"></div>
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent"
          ></div>

          <!-- subtle inner glass highlight -->
          <div
            class="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          ></div>

          <div class="p-6 sm:p-8">
            <!-- ✅ HEADER INSIDE GLASS, ABOVE CARDS (VISIBLE) -->
            <div class="section-head">
              <p class="section-kicker">Services</p>
            </div>

            <p v-if="error" class="text-sm text-red-400 text-center">
              {{ error }}
            </p>

            <p v-else-if="loading" class="text-sm text-zinc-200 text-center">Loading services…</p>

            <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <article
                v-for="svc in services"
                :key="svc.serviceID"
                class="border border-zinc-800/80 bg-black/20"
              >
                <!-- Image: poster style + subtle overlay -->
                <div class="relative border-b border-zinc-800/80 bg-black/30">
                  <div class="aspect-[4/3] w-full overflow-hidden">
                    <img
                      v-if="svc.imagePath"
                      :src="getImageUrl(svc.imagePath)"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center">
                      <span class="text-[11px] text-zinc-400 uppercase tracking-wider">
                        No image
                      </span>
                    </div>
                  </div>

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                  ></div>
                  <div
                    class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#C7A47D]/40"
                  ></div>

                  <!-- Small brass label strip (barber vibe) -->
                  <div
                    class="pointer-events-none absolute left-0 top-0 border-r border-b border-zinc-800/80 bg-black/35 px-3 py-2"
                  >
                    <span class="text-[10px] uppercase tracking-[0.22em] text-[#C7A47D]">
                      Service
                    </span>
                  </div>
                </div>

                <!-- Content -->
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

                  <div class="h-px w-full bg-zinc-800/70"></div>

                  <p
                    v-if="svc.isBooked"
                    class="inline-flex items-center gap-2 border border-[#C7A47D]/35 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C7A47D]"
                  >
                    <span class="h-1.5 w-1.5 bg-[#C7A47D]"></span>
                    Not bookable
                  </p>
                </div>
              </article>

              <p
                v-if="services.length === 0"
                class="col-span-full text-center text-sm text-zinc-300/80"
              >
                No services are available yet. Please check back later.
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
  padding: 0;
}

.section-kicker {
  margin: 0 0 10px 0;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(161, 161, 170, 0.9);
}
</style>
