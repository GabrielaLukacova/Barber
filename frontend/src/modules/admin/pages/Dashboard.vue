<template>
  <div class="admin-page">
    <header>
      <h1 class="admin-title">Dashboard</h1>
      <p class="admin-subtitle">Quick access to the most important admin tools.</p>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink :to="{ name: 'admin-appointments' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">event</span>
          <h2 class="dash-card__title">Appointments</h2>
        </div>
        <p class="dash-card__desc">View and manage upcoming bookings.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-services' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">content_cut</span>
          <h2 class="dash-card__title">Services</h2>
        </div>
        <p class="dash-card__desc">Edit haircut types, durations, and prices.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-gallery' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">photo_library</span>
          <h2 class="dash-card__title">Gallery</h2>
        </div>
        <p class="dash-card__desc">Upload, reorder, and delete portfolio images.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-shop' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">store</span>
          <h2 class="dash-card__title">Barber Shop</h2>
        </div>
        <p class="dash-card__desc">Edit shop details shown on the website.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-hours' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">schedule</span>
          <h2 class="dash-card__title">Opening Hours</h2>
        </div>
        <p class="dash-card__desc">Set open/closed days and working hours.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-timeoff' }" class="dash-card">
        <div class="dash-card__top">
          <span class="material-icons-outlined dash-card__icon">beach_access</span>
          <h2 class="dash-card__title">Time Off</h2>
        </div>
        <p class="dash-card__desc">Manage periods when booking is disabled.</p>
        <div class="dash-card__cta">Open</div>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
/* admin dashboard cards */
.dash-card {
  display: block;
  text-decoration: none;
  background: #fff;
  border: 1px solid var(--admin-border);
  border-radius: 1rem;
  padding: 1.1rem 1.1rem;
  box-shadow: 0 8px 30px rgba(16, 24, 40, 0.06);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
  color: inherit;
}

.dash-card:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--admin-accent) 55%, var(--admin-border));
  box-shadow: 0 14px 38px rgba(16, 24, 40, 0.1);
}

.dash-card__top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dash-card__icon {
  font-size: 18px;
  color: var(--admin-accent);
}

.dash-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #000;
}

.dash-card__desc {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: #3f3f46;
  line-height: 1.35rem;
}

.dash-card__cta {
  margin-top: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--admin-accent);
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>