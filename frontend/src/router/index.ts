import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');
const Services = () => import('../pages/Services.vue');
const Booking = () => import('../pages/Booking.vue');
const Gallery = () => import('../pages/Gallery.vue');
const Contact = () => import('../pages/Contact.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/services', component: Services, name: 'services' },
    { path: '/booking', component: Booking, name: 'booking' },
    { path: '/gallery', component: Gallery, name: 'gallery' },
    { path: '/contact', component: Contact, name: 'contact' },
  ],
  scrollBehavior() { return { top: 0 }; },
});

export default router;