from pathlib import Path

path = Path("src/modules/public/pages/Services.vue")
text = path.read_text()

# Fix import paths
text = text.replace('import { useServicesStore } from "@/stores/services";',
                    'import { useServicesStore } from "@/stores/services";')

text = text.replace('import ServiceCard from "@/components/ServiceCard.vue";',
                    'import ServiceCard from "@/modules/admin/components/ServiceCard.vue";')

# Make sure it loads services onMounted
if "onMounted(()" not in text:
    # Insert load logic into <script setup>
    text = text.replace("<script setup", "<script setup")
    # not needed; we will manually inspect after you run dev

path.write_text(text)
