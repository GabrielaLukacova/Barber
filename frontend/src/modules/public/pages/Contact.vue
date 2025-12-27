<template>
  <section class="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-6">
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-2">Where to find us</h2>
      <p class="text-zinc-600 mb-4">Street 1, Esbjerg</p>
      <div class="aspect-[16/9] bg-zinc-100 rounded-xl"></div>
    </div>
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-2">Contact</h2>
      <p class="text-zinc-600">
        Phone: +45 00 00 00 00<br />
        Email: hello@kimsfrisor.dk
      </p>
      <RouterLink to="/booking" class="btn btn-primary mt-6">Book now</RouterLink>
    </div>
  </section>
</template>
