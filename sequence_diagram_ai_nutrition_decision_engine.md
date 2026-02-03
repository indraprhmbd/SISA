## Sequence Diagram – AI Nutrition Decision Engine

Diagram ini menggambarkan **satu flow utama** yang dinilai juri: dari input bahan hingga keputusan menu berbasis protein gap.

---

### Aktor & Komponen
- **User**
- **Frontend (Web/App UI)**
- **Input Processor**
- **Ingredient Normalizer**
- **Nutrition Logic Engine**
- **LLM Menu Composer**

---

### Sequence Diagram (Representasi Teks)

```
User
 |
 | 1. Input bahan (foto / suara / teks)
 v
Frontend
 |
 | 2. Kirim raw input
 v
Input Processor
 |
 |--(2a) Foto → ingredient detection
 |--(2b) Voice → speech-to-text → ingredient extraction
 |--(2c) Text → ingredient parsing
 |
 v
Ingredient Normalizer
 |
 | 3. Normalisasi nama bahan
 | 4. Estimasi porsi (small / medium / large)
 | 5. Hitung confidence score
 |
 v
Frontend
 |
 | 6. Tampilkan daftar bahan + estimasi
 | 7. User koreksi (opsional)
 v
Ingredient Normalizer
 |
 | 8. Update bahan final
 |
 v
Nutrition Logic Engine
 |
 | 9. Hitung target protein (rule-based)
 |10. Hitung estimasi protein dari bahan
 |11. Analisis protein gap
 |
 v
LLM Menu Composer
 |
 |12. Terima constraint + hasil gap
 |13. Susun menu + reasoning (tanpa hitung nutrisi)
 |
 v
Frontend
 |
 |14. Tampilkan menu
 |15. Tampilkan protein fulfillment (% estimasi)
 |16. Tampilkan alasan keputusan
 |
User
```

---

### Penjelasan Setiap Fase

**Fase Input & Aksesibilitas**
- Sistem menerima input dalam berbagai bentuk.
- Tidak ada klaim akurasi tinggi pada tahap ini.

**Fase Normalisasi & Validasi**
- Semua input dikonversi ke struktur bahan yang sama.
- User selalu punya hak koreksi.

**Fase Nutrition Logic (Core Value)**
- Target protein dihitung eksplisit.
- Sistem menentukan seberapa besar gap nutrisi.

**Fase Generasi Menu**
- LLM hanya menyusun menu berdasarkan constraint.
- Tidak mengambil keputusan nutrisi.

**Fase Output & Transparansi**
- Menu disertai penjelasan logika.
- User memahami kenapa menu tersebut dipilih.

---

### Catatan Penting untuk Juri
- Tidak ada loop monitoring jangka panjang.
- Tidak ada diagnosis kesehatan.
- Semua angka bersifat estimasi konservatif.
- Decision-making berada di rule-based engine, bukan di LLM.

Sequence diagram ini merepresentasikan desain sistem yang fokus, defensible, dan sesuai scope hackathon.