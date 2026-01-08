import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import router from '../../router';

import MainNav from '../../shared/components/MainNav.vue';
import SiteFooter from '../../shared/components/SiteFooter.vue';
import BookingSection from '../../modules/public/sections/BookingSection.vue';
import OpeningHoursSection from '../../modules/public/sections/OpeningHoursSection.vue';

vi.mock('../../shared/api/barberApi', () => ({
  fetchServices: vi.fn(async () => []),
  fetchBarbers: vi.fn(async () => []),
  fetchAvailability: vi.fn(async () => ({ slots: [], durationMin: 0 })),
  createAppointment: vi.fn(async () => ({})),
}));

function mountWithPinia(component: any) {
  return mount(component, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          stubActions: true,
        }),
      ],
    },
  });
}

describe('integration: mounts core layout/sections', () => {
  it('MainNav mounts', () => {
    const w = mountWithPinia(MainNav);
    expect(w.html().length).toBeGreaterThan(0);
  });

  it('SiteFooter mounts', () => {
    const w = mountWithPinia(SiteFooter);
    expect(w.html().length).toBeGreaterThan(0);
  });

  it('BookingSection mounts', () => {
    const w = mountWithPinia(BookingSection);
    expect(w.html().length).toBeGreaterThan(0);
  });

  it('OpeningHoursSection mounts', () => {
    const w = mountWithPinia(OpeningHoursSection);
    expect(w.html().length).toBeGreaterThan(0);
  });

  it('TimeOffSection mounts', () => {
    const w = mountWithPinia(TimeOffSection);
    expect(w.html().length).toBeGreaterThan(0);
  });
});
