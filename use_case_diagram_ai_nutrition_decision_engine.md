## Use Case Diagram – AI Nutrition Decision Engine

### Aktor
- **User**: individu rumah tangga yang ingin mengolah bahan yang tersedia menjadi menu bergizi.
- **AI System**: sistem AI yang melakukan analisis bahan dan pengambilan keputusan menu.

---

### Diagram Use Case (Representasi Teks)

```
+-------------------+          +----------------------------------+
|       User        |          |            AI System             |
+-------------------+          +----------------------------------+
        |                                   |
        |  Input bahan makanan              |
        |---------------------------------->| (1) Collect Ingredients
        |                                   |
        |  (foto / suara / teks)            |
        |                                   |
        |                                   |--> Normalize Ingredients
        |                                   |
        |                                   |--> Estimate Portions
        |                                   |
        |                                   |--> Calculate Protein Target
        |                                   |
        |                                   |--> Analyze Protein Gap
        |                                   |
        |                                   |--> Generate Menu Decision
        |                                   |
        |  Lihat hasil menu + penjelasan    |
        |<----------------------------------| (2) Present Menu & Reasoning
        |                                   |
        |  Koreksi bahan (opsional)         |
        |---------------------------------->| (3) Adjust Ingredients
        |                                   |
        |                                   |--> Recalculate Gap & Menu
        |                                   |
```

---

### Daftar Use Case Utama

1. **Collect Ingredients**
   - User memberikan input bahan melalui foto, voice-to-text, atau input manual.
   - Tujuan: mengurangi friction dan meningkatkan aksesibilitas.

2. **Normalize Ingredients**
   - Sistem mengubah input mentah menjadi daftar bahan standar.
   - Non-makanan dan objek ambigu diabaikan.

3. **Estimate Portions**
   - Sistem memberi estimasi porsi kasar (small, medium, large).
   - Tidak menggunakan gram presisi.

4. **Calculate Protein Target**
   - Sistem menghitung target protein berbasis berat badan dan aktivitas.
   - Rule-based, non-medis.

5. **Analyze Protein Gap**
   - Sistem membandingkan potensi protein dari bahan dengan target.
   - Output berupa persentase pemenuhan.

6. **Generate Menu Decision**
   - Sistem memilih menu dengan prioritas menutup gap protein terbesar.
   - Menggunakan constraint bahan tersedia.

7. **Present Menu & Reasoning**
   - Sistem menampilkan menu, estimasi pemenuhan protein, dan alasan keputusan.

8. **Adjust Ingredients (Opsional)**
   - User dapat mengoreksi bahan atau porsi.
   - Sistem menghitung ulang hasil.

---

### Catatan Penting untuk Hackathon
- Tidak ada use case diagnosis kesehatan.
- Tidak ada tracking nutrisi jangka panjang.
- Semua keputusan bersifat estimatif dan transparan.
- Fokus sistem adalah pengambilan keputusan menu, bukan edukasi gizi lengkap.

Diagram ini merepresentasikan scope final yang defensible di depan juri hackathon.