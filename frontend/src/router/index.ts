import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth';

// Public: single-page home
const Home = () => import('@/modules/public/pages/Home.vue');

// Auth
const AdminLogin = () => import('@/modules/auth/pages/AdminLogin.vue');

// Admin layout
const AdminLayout = () => import('@/modules/admin/layout/AdminLayout.vue');

// Admin pages
const AdminDashboard = () => import('@/modules/admin/pages/Dashboard.vue');
const AdminAppointments = () => import('@/modules/admin/pages/Appointments.vue');
const AdminServices = () => import('@/modules/admin/pages/Services.vue');
const AdminGallery = () => import('@/modules/admin/pages/AdminGallery.vue');
const AdminHours = () => import('@/modules/admin/pages/OpeningHours.vue');
const AdminTimeOff = () => import('@/modules/admin/pages/TimeOff.vue');
const AdminBarberShop = () => import('@/modules/admin/pages/BarberShop.vue');

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home, name: 'home' },

  { path: '/admin/login', component: AdminLogin, name: 'admin-login' },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'appointments', name: 'admin-appointments', component: AdminAppointments },
      { path: 'services', name: 'admin-services', component: AdminServices },
      { path: 'gallery', name: 'admin-gallery', component: AdminGallery },
      { path: 'shop', name: 'admin-shop', component: AdminBarberShop },
      { path: 'hours', name: 'admin-hours', component: AdminHours },
      { path: 'timeoff', name: 'admin-timeoff', component: AdminTimeOff },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      return next({
        name: 'admin-login',
        query: { redirect: to.fullPath },
      });
    }
  }
  next();
});

export default router;