<template>
  <footer class="border-t border-zinc-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
      <div>
        <div class="font-semibold mb-2">Kim's Frisør</div>
        <p class="text-zinc-600">Modern cuts with vintage soul.</p>
      </div>
      <div>
        <div class="font-semibold mb-2">Opening Hours</div>
        <p class="text-zinc-600">Mon–Fri 09:00–18:00<br />Sat 09:00–14:00</p>
      </div>
      <div>
        <div class="font-semibold mb-2">Contact</div>
        <p class="text-zinc-600">+45 00 00 00 00<br />Street 1, Esbjerg</p>
      </div>
    </div>
    <div class="text-center text-xs text-zinc-500 py-4 border-t border-zinc-100">
      © {{ new Date().getFullYear() }} Kim's Frisør. All rights reserved.
    </div>
  </footer>
</template>