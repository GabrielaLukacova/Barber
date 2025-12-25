<script setup lang="ts">
import BookingWizard from '@/modules/public/components/BookingWizard.vue';
</script>

<template>
  <section id="booking" class="section-block">
    <div class="section-head">
      <p class="section-kicker">Booking</p>
    </div>

    <BookingWizard />
  </section>
</template>

<style scoped>
.section-head{
  text-align: center;
  margin: 0 0 24px 0;   /* only vertical spacing */
  padding: 0;           /* no extra section padding */
}

.section-kicker{
  margin: 0 0 10px 0;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(161,161,170,0.9);
}

.booking-title{
  margin: 0;
  font-weight: 700;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: rgba(250,250,250,0.98);
}
</style>

