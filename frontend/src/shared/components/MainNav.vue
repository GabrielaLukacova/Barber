<template>
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-zinc-200">
    <nav class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="font-semibold tracking-wide text-brand.black">Kim's Frisør</span>
      </div>
      <ul class="hidden md:flex items-center gap-6 text-sm">
        <li>
          <RouterLink class="hover:opacity-80" to="/">Home</RouterLink>
        </li>
        <li>
          <a href="#services" class="hover:opacity-80">Services</a>
        </li>
        <li>
          <a href="#booking" class="hover:opacity-80">Booking</a>
        </li>
        <li>
          <a href="#gallery" class="hover:opacity-80">Gallery</a>
        </li>
        <li>
          <a href="#contact" class="hover:opacity-80">Contact</a>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost text-xs">EN</button>
        <span class="text-zinc-400">|</span>
        <button class="btn btn-ghost text-xs">DA</button>
        <a href="#booking" class="btn btn-primary text-sm">Book now</a>
      </div>
    </nav>
  </header>
</template>
