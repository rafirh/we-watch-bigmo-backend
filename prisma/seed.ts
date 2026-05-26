import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";
import { hashPassword } from "../src/utils/password";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding ANC data...')

  // ─────────────────────────────────────────────────────────────────────────
  // USER 1 — Kunjungan sampai Trimester 3 (belum lengkap / on-going)
  // HPHT: 1 Sep 2025 → HPL: 8 Jun 2026
  // K1M (T1, 10 minggu) → K2 (T1, 13 minggu) → K3 (T2, 22 minggu)
  // Saat ini ~34 minggu → masih menunggu K4–K6
  // ─────────────────────────────────────────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { nik: '3578012345678901' },
    update: {},
    create: {
      nik:      '3578012345678901',
      fullName: 'Siti Nurhaliza Putri',
      username: 'siti.nurhaliza',
      email:    'siti.nurhaliza@example.com',
      password: await hashPassword('password123'),
      role:     'USER',

      userDetail: {
        create: {
          noRekamMedis:     'RM-ANC-00001',
          jenisKelamin:     'Perempuan',
          tempatLahir:      'Surabaya',
          tanggalLahir:     new Date('1995-05-15'),
          namaIbuKandung:   'Halimah Ismail',
          statusPernikahan: 'Menikah',
          noTelepon:        '081234567801',
          jalan:            'Jl. Manyar Kertoarjo V No. 12',
          rt:               '003',
          rw:               '005',
          kelurahanKode:    '3578031007',
          kecamatanKode:    '357803',
          kotaKabupaten:    'Kota Surabaya',
          kodeKota:         '3578',
          provinsi:         'Jawa Timur',
          kodeProvinsi:     '35',
          kodePos:          '60285',
          negara:           'Indonesia',
        },
      },

      obstetricHistory: {
        create: {
          gravida:                    2,
          partus:                     1,
          abortus:                    0,
          hpht:                       new Date('2025-09-01'),
          hplTaksiran:                new Date('2026-06-08'),
          jarakKehamilanBulan:        36,
          jarakKehamilanInterpretasi: 'Aman',
          jarakKehamilanKeterangan:   'Jarak ≥24 bulan, tidak termasuk faktor risiko 4T',
        },
      },

      prePregnancyData: {
        create: {
          beratBadanKg:        55.0,
          tinggiBadanCm:       160.0,
          imt:                 21.48,
          imtInterpretasi:     'Normal',
          imtKeterangan:       'IMT 18.5–24.9 — target kenaikan BB 11.5–16 kg',
          targetKenaikanBbMin: 11.5,
          targetKenaikanBbMax: 16.0,
          imunisasiTtStatus:   'T3',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },

      visits: {
        create: [
          // ── K1M: Trimester 1, usia kehamilan 10 minggu (3 Nov 2025) ──
          {
            label:               'K1M',
            keteranganLabel:     'Kunjungan pertama (murni) — dilakukan di trimester 1 (≤12 minggu), wajib oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2025-11-03T09:00:00+07:00'),
            trimester:           'TRIMESTER_1',
            usiaKehamilanMinggu: 10,
            faskes:              'Puskesmas Manyar Surabaya',
            pemeriksa:           'dr. Hendra Kusuma + Bidan Sri Wahyuni',
            kesanKlinis:         'G2P1A0 hamil 10 minggu. Kondisi ibu baik, tidak ada faktor risiko 4T. LILA normal, Hb batas bawah normal. USG konfirmasi intrauteri, sesuai usia kehamilan.',

            motherExamination: {
              create: {
                beratBadanKg:           56.2,
                beratBadanKeterangan:   'Kenaikan 1.2 kg dari pra-hamil — sesuai trimester 1',
                lilaCm:                 25.5,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          null,
                tinggiUteriKeterangan:  'Belum dapat diperiksa — uterus masih di bawah simfisis pubis (trimester 1)',
                tdSistolik:             110,
                tdDiastolik:            70,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   80,
                nadiInterpretasi:       'Normal',
                suhu:                   36.6,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'A',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:               null,
                djjKeterangan:        'Belum rutin diperiksa — auskultasi DJJ umumnya mulai usia kehamilan 12 minggu (Doppler)',
                jumlahJanin:          1,
                usgGestationalSacCm:  3.5,
                usgCrownRumpLengthCm: 3.3,
                usgLetakJanin:        'Intrauteri',
                usgKeterangan:        'USG oleh dokter sesuai protokol K1M — sesuai usia kehamilan 10 minggu',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.3,
                hemoglobinInterpretasi:  'Normal (batas bawah)',
                hemoglobinKeterangan:    'Tepat di atas cut-off anemia (≥11 g/dL)',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           92,
                gulaDarahInterpretasi:   'Normal',
                gulaDarahKeterangan:     'Normal < 140 mg/dL',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
                proteinUrinKeterangan:   'Tidak ada proteinuria',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            otherCondition: {
              create: {
                disabilitas:       false,
                ikutKelasIbuHamil: true,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Suplementasi tablet tambah darah (Fe) 1 tablet/hari + asam folat' },
                { urutan: 2, keterangan: 'Edukasi tanda bahaya kehamilan trimester 1 (perdarahan, hiperemesis)' },
                { urutan: 3, keterangan: 'Jadwalkan K2 di trimester 1 akhir (usia kehamilan 13 minggu)' },
                { urutan: 4, keterangan: 'Lanjut kelas ibu hamil' },
              ],
            },
          },

          // ── K2: Trimester 1 akhir, usia kehamilan 13 minggu (24 Nov 2025) ──
          {
            label:               'K2',
            keteranganLabel:     'Kunjungan kedua — idealnya di trimester 1, mengikuti jadwal lanjutan setelah K1M',
            tanggalKunjungan:    new Date('2025-11-24T09:30:00+07:00'),
            trimester:           'TRIMESTER_1',
            usiaKehamilanMinggu: 13,
            faskes:              'Puskesmas Manyar Surabaya',
            pemeriksa:           'Bidan Sri Wahyuni',
            kesanKlinis:         'G2P1A0 hamil 13 minggu. Trimester 1 berjalan baik. Mual-mual sudah berkurang. Tidak ada keluhan berarti. Kenaikan BB sesuai target.',

            motherExamination: {
              create: {
                beratBadanKg:           57.0,
                beratBadanKeterangan:   'Kenaikan 2.0 kg dari pra-hamil — sesuai target trimester 1',
                lilaCm:                 25.5,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          null,
                tinggiUteriKeterangan:  'TFU mulai teraba di atas simfisis, namun belum diukur secara formal',
                tdSistolik:             112,
                tdDiastolik:            72,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   82,
                nadiInterpretasi:       'Normal',
                suhu:                   36.5,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'A',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:          156,
                djjInterpretasi: 'Normal',
                djjKeterangan:   'Rentang normal 120–160 bpm — mulai terdeteksi dengan Doppler',
                jumlahJanin:     1,
                presentasi:      'Belum dapat dinilai',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.5,
                hemoglobinInterpretasi:  'Normal',
                hemoglobinKeterangan:    'Meningkat dari K1M — respon baik terhadap suplementasi Fe',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           90,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut suplementasi Fe 1 tablet/hari' },
                { urutan: 2, keterangan: 'Jadwalkan K3 di trimester 2 (sekitar usia kehamilan 22 minggu)' },
                { urutan: 3, keterangan: 'Edukasi gerakan janin dan nutrisi trimester 2' },
              ],
            },
          },

          // ── K3: Trimester 2, usia kehamilan 22 minggu (19 Jan 2026) ──
          {
            label:               'K3',
            keteranganLabel:     'Kunjungan ketiga — idealnya di trimester 2',
            tanggalKunjungan:    new Date('2026-01-19T10:00:00+07:00'),
            trimester:           'TRIMESTER_2',
            usiaKehamilanMinggu: 22,
            faskes:              'Puskesmas Manyar Surabaya',
            pemeriksa:           'Bidan Sri Wahyuni',
            kesanKlinis:         'G2P1A0 hamil 22 minggu. Kondisi ibu dan janin dalam batas normal. DJJ baik. TFU sesuai usia kehamilan. Tidak ada keluhan signifikan.',

            motherExamination: {
              create: {
                beratBadanKg:           59.5,
                beratBadanKeterangan:   'Kenaikan 4.5 kg dari pra-hamil — sesuai target trimester 2',
                lilaCm:                 25.5,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          22.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tinggiUteriKeterangan:   'TFU ≈ usia kehamilan dalam cm (22 cm pada 22 minggu)',
                tdSistolik:             110,
                tdDiastolik:            70,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   84,
                nadiInterpretasi:       'Normal',
                suhu:                   36.7,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'A',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:          148,
                djjInterpretasi: 'Normal',
                djjKeterangan:   'Rentang normal 120–160 bpm',
                jumlahJanin:     1,
                presentasi:      'Belum dapat dinilai (mobilitas janin tinggi)',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           12.0,
                hemoglobinInterpretasi:  'Normal',
                hemoglobinKeterangan:    'Hb baik — suplementasi Fe efektif',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           94,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut suplementasi Fe 1 tablet/hari' },
                { urutan: 2, keterangan: 'Jadwalkan K4 di trimester 3 (sekitar usia kehamilan 28 minggu) — wajib dengan dokter dan USG' },
                { urutan: 3, keterangan: 'Edukasi tanda bahaya trimester 2–3: preeklampsia, gerakan janin berkurang' },
                { urutan: 4, keterangan: 'Mulai persiapan rencana persalinan' },
              ],
            },
          },
        ],
      },
    },
  })

  console.log(`✅ Pasien 1 — ${user1.fullName} (K1M, K2, K3 — on-going trimester 3)`)

  // ─────────────────────────────────────────────────────────────────────────
  // USER 2 — Kunjungan LENGKAP (K1M → K2 → K3 → K4 → K5 → K6)
  // HPHT: 10 Jun 2025 → HPL: 17 Mar 2026
  // Sudah menyelesaikan seluruh kunjungan ANC dan melahirkan
  // ─────────────────────────────────────────────────────────────────────────
  const user2 = await prisma.user.upsert({
    where: { nik: '3515098765432101' },
    update: {},
    create: {
      nik:      '3515098765432101',
      fullName: 'Dewi Lestari Handayani',
      username: 'dewi.lestari',
      email:    'dewi.lestari@example.com',
      password: await hashPassword('password123'),
      role:     'USER',

      userDetail: {
        create: {
          noRekamMedis:     'RM-ANC-00002',
          jenisKelamin:     'Perempuan',
          tempatLahir:      'Sidoarjo',
          tanggalLahir:     new Date('1993-03-20'),
          namaIbuKandung:   'Sumiati',
          statusPernikahan: 'Menikah',
          noTelepon:        '081234567802',
          jalan:            'Jl. Pahlawan Gg. 4 No. 8',
          rt:               '001',
          rw:               '002',
          kelurahanKode:    '3515032004',
          kecamatanKode:    '351503',
          kotaKabupaten:    'Kab. Sidoarjo',
          kodeKota:         '3515',
          provinsi:         'Jawa Timur',
          kodeProvinsi:     '35',
          kodePos:          '61252',
          negara:           'Indonesia',
        },
      },

      obstetricHistory: {
        create: {
          gravida:                    2,
          partus:                     1,
          abortus:                    0,
          hpht:                       new Date('2025-06-10'),
          hplTaksiran:                new Date('2026-03-17'),
          jarakKehamilanBulan:        30,
          jarakKehamilanInterpretasi: 'Aman',
          jarakKehamilanKeterangan:   'Jarak ≥24 bulan, tidak termasuk faktor risiko 4T',
        },
      },

      prePregnancyData: {
        create: {
          beratBadanKg:        58.0,
          tinggiBadanCm:       158.0,
          imt:                 23.24,
          imtInterpretasi:     'Normal',
          imtKeterangan:       'IMT 18.5–24.9 — target kenaikan BB 11.5–16 kg',
          targetKenaikanBbMin: 11.5,
          targetKenaikanBbMax: 16.0,
          imunisasiTtStatus:   'T4',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },

      visits: {
        create: [
          // ── K1M: Trimester 1, usia kehamilan 9 minggu (11 Agu 2025) ──
          {
            label:               'K1M',
            keteranganLabel:     'Kunjungan pertama (murni) — dilakukan di trimester 1 (≤12 minggu), wajib oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2025-08-11T08:00:00+07:00'),
            trimester:           'TRIMESTER_1',
            usiaKehamilanMinggu: 9,
            faskes:              'Puskesmas Sidoarjo Kota',
            pemeriksa:           'dr. Rina Damayanti + Bidan Eka Pratiwi',
            kesanKlinis:         'G2P1A0 hamil 9 minggu. Kondisi ibu baik, status gizi normal, tidak ada faktor risiko. USG konfirmasi intrauteri dan viabilitas janin.',

            motherExamination: {
              create: {
                beratBadanKg:           58.5,
                beratBadanKeterangan:   'Kenaikan 0.5 kg dari pra-hamil — normal untuk trimester 1 awal',
                lilaCm:                 27.0,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          null,
                tinggiUteriKeterangan:  'Belum dapat diperiksa — uterus masih di bawah simfisis pubis',
                tdSistolik:             115,
                tdDiastolik:            75,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   80,
                nadiInterpretasi:       'Normal',
                suhu:                   36.6,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:               null,
                djjKeterangan:        'Belum rutin diperiksa — auskultasi DJJ umumnya mulai usia kehamilan 12 minggu (Doppler)',
                jumlahJanin:          1,
                usgGestationalSacCm:  2.8,
                usgCrownRumpLengthCm: 2.3,
                usgLetakJanin:        'Intrauteri',
                usgKeterangan:        'USG oleh dokter sesuai protokol K1M — janin viable, sesuai usia kehamilan 9 minggu',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           12.0,
                hemoglobinInterpretasi:  'Normal',
                hemoglobinKeterangan:    'Di atas cut-off anemia ibu hamil (≥11 g/dL)',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           89,
                gulaDarahInterpretasi:   'Normal',
                gulaDarahKeterangan:     'Normal < 140 mg/dL',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
                proteinUrinKeterangan:   'Tidak ada proteinuria',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            otherCondition: {
              create: {
                disabilitas:       false,
                ikutKelasIbuHamil: true,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Suplementasi tablet tambah darah (Fe) 1 tablet/hari + asam folat' },
                { urutan: 2, keterangan: 'Edukasi tanda bahaya kehamilan trimester 1' },
                { urutan: 3, keterangan: 'Jadwalkan K2 di trimester 1 (usia kehamilan 12–13 minggu)' },
                { urutan: 4, keterangan: 'Ikut kelas ibu hamil' },
              ],
            },
          },

          // ── K2: Trimester 1, usia kehamilan 13 minggu (8 Sep 2025) ──
          {
            label:               'K2',
            keteranganLabel:     'Kunjungan kedua — idealnya masih di trimester 1, mengikuti jadwal lanjutan setelah K1M',
            tanggalKunjungan:    new Date('2025-09-08T09:00:00+07:00'),
            trimester:           'TRIMESTER_1',
            usiaKehamilanMinggu: 13,
            faskes:              'Puskesmas Sidoarjo Kota',
            pemeriksa:           'Bidan Eka Pratiwi',
            kesanKlinis:         'G2P1A0 hamil 13 minggu. Memasuki trimester 2. Kondisi baik, mual berkurang. Nafsu makan membaik. Kenaikan BB sesuai.',

            motherExamination: {
              create: {
                beratBadanKg:           59.5,
                beratBadanKeterangan:   'Kenaikan 1.5 kg dari pra-hamil — normal untuk akhir trimester 1',
                lilaCm:                 27.0,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          null,
                tinggiUteriKeterangan:  'TFU mulai teraba namun belum diukur formal',
                tdSistolik:             110,
                tdDiastolik:            70,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   78,
                nadiInterpretasi:       'Normal',
                suhu:                   36.5,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:          152,
                djjInterpretasi: 'Normal',
                djjKeterangan:   'Rentang normal 120–160 bpm — pertama kali terdeteksi dengan Doppler',
                jumlahJanin:     1,
                presentasi:      'Belum dapat dinilai',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           12.2,
                hemoglobinInterpretasi:  'Normal',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           91,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut suplementasi Fe 1 tablet/hari' },
                { urutan: 2, keterangan: 'Jadwalkan K3 di trimester 2 (usia kehamilan 22 minggu)' },
                { urutan: 3, keterangan: 'Edukasi nutrisi trimester 2 dan pola aktivitas' },
              ],
            },
          },

          // ── K3: Trimester 2, usia kehamilan 22 minggu (10 Nov 2025) ──
          {
            label:               'K3',
            keteranganLabel:     'Kunjungan ketiga — idealnya di trimester 2',
            tanggalKunjungan:    new Date('2025-11-10T08:30:00+07:00'),
            trimester:           'TRIMESTER_2',
            usiaKehamilanMinggu: 22,
            faskes:              'Puskesmas Sidoarjo Kota',
            pemeriksa:           'Bidan Eka Pratiwi',
            kesanKlinis:         'G2P1A0 hamil 22 minggu. Trimester 2 berjalan baik. TFU sesuai usia kehamilan. Ibu aktif dan kondisi janin normal. Tidak ada keluhan.',

            motherExamination: {
              create: {
                beratBadanKg:           63.0,
                beratBadanKeterangan:   'Kenaikan 5.0 kg dari pra-hamil — sesuai target trimester 2',
                lilaCm:                 27.0,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          22.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tinggiUteriKeterangan:   'TFU ≈ usia kehamilan dalam cm',
                tdSistolik:             112,
                tdDiastolik:            72,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   82,
                nadiInterpretasi:       'Normal',
                suhu:                   36.6,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:          144,
                djjInterpretasi: 'Normal',
                djjKeterangan:   'Rentang normal 120–160 bpm',
                jumlahJanin:     1,
                presentasi:      'Belum dapat dinilai (mobilitas janin tinggi)',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.8,
                hemoglobinInterpretasi:  'Normal',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           95,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut suplementasi Fe 1 tablet/hari' },
                { urutan: 2, keterangan: 'Jadwalkan K4 di trimester 3 (usia kehamilan 28 minggu) — wajib dokter dengan USG' },
                { urutan: 3, keterangan: 'Edukasi tanda bahaya trimester 3 dan persiapan persalinan' },
              ],
            },
          },

          // ── K4: Trimester 3 awal, usia kehamilan 28 minggu (22 Des 2025) ──
          {
            label:               'K4',
            keteranganLabel:     'Kunjungan keempat — idealnya di trimester 3 awal, wajib oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2025-12-22T09:00:00+07:00'),
            trimester:           'TRIMESTER_3',
            usiaKehamilanMinggu: 28,
            faskes:              'Klinik Pratama Bunda Sidoarjo',
            pemeriksa:           'dr. Andhika Prasetyo, Sp.OG',
            kesanKlinis:         'G2P1A0 hamil 28 minggu. Memasuki trimester 3. Kondisi ibu dan janin baik. TFU sesuai. Presentasi kepala belum engage. USG biometri janin normal.',

            motherExamination: {
              create: {
                beratBadanKg:           65.5,
                beratBadanKeterangan:   'Kenaikan 7.5 kg dari pra-hamil — sesuai target trimester 3',
                lilaCm:                 27.0,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          28.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tinggiUteriKeterangan:   'TFU ≈ usia kehamilan dalam cm',
                tdSistolik:             118,
                tdDiastolik:            76,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   84,
                nadiInterpretasi:       'Normal',
                suhu:                   36.7,
                suhuInterpretasi:       'Normal',
                pernapasan:             19,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal (tidak edema)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:                  140,
                djjInterpretasi:         'Normal',
                djjKeterangan:           'Rentang normal 120–160 bpm',
                jumlahJanin:             1,
                presentasi:              'Presentasi Kepala',
                kepalaThPap:             'Belum masuk panggul',
                taksiranBeratJaninGram:  1100,
                taksiranBeratKeterangan: 'Sesuai usia kehamilan 28 minggu (USG biometri)',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.5,
                hemoglobinInterpretasi:  'Normal',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           98,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut suplementasi Fe 1 tablet/hari' },
                { urutan: 2, keterangan: 'Pantau gerak janin harian (minimal 10 gerakan/12 jam)' },
                { urutan: 3, keterangan: 'Jadwalkan K5 (usia kehamilan 34–36 minggu) — wajib dokter + USG evaluasi' },
                { urutan: 4, keterangan: 'Mulai diskusi rencana persalinan: normal atau SC, tempat bersalin' },
                { urutan: 5, keterangan: 'Edukasi tanda-tanda persalinan dan kapan harus ke RS' },
              ],
            },
          },

          // ── K5: Trimester 3 lanjut, usia kehamilan 34 minggu (26 Jan 2026) ──
          {
            label:               'K5',
            keteranganLabel:     'Kunjungan kelima — trimester 3, evaluasi menjelang persalinan oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2026-01-26T10:00:00+07:00'),
            trimester:           'TRIMESTER_3',
            usiaKehamilanMinggu: 34,
            faskes:              'Klinik Pratama Bunda Sidoarjo',
            pemeriksa:           'dr. Andhika Prasetyo, Sp.OG',
            kesanKlinis:         'G2P1A0 hamil 34 minggu. Presentasi kepala sudah mengarah masuk panggul. Kondisi ibu dan janin sangat baik. USG taksiran BB janin sesuai. Siap menuju persalinan.',

            motherExamination: {
              create: {
                beratBadanKg:           69.0,
                beratBadanKeterangan:   'Kenaikan 11.0 kg dari pra-hamil — dalam target ideal (11.5–16 kg)',
                lilaCm:                 27.0,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          33.0,
                tinggiUteriInterpretasi: 'Sedikit di bawah usia kehamilan',
                tinggiUteriKeterangan:   'TFU 33 cm pada 34 minggu — masih dalam batas normal (±2 cm)',
                tdSistolik:             120,
                tdDiastolik:            78,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   86,
                nadiInterpretasi:       'Normal',
                suhu:                   36.8,
                suhuInterpretasi:       'Normal',
                pernapasan:             19,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal — edema minimal fisiologis (+)',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:                  138,
                djjInterpretasi:         'Normal',
                djjKeterangan:           'Rentang normal 120–160 bpm',
                jumlahJanin:             1,
                presentasi:              'Presentasi Kepala',
                kepalaThPap:             'Mulai masuk panggul (engagement awal)',
                taksiranBeratJaninGram:  2350,
                taksiranBeratKeterangan: 'Sesuai usia kehamilan 34 minggu (USG biometri)',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.2,
                hemoglobinInterpretasi:  'Normal (batas bawah)',
                hemoglobinKeterangan:    'Sedikit menurun — hemodilusi trimester 3, masih dalam batas normal',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           102,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut Fe 1 tablet/hari hingga persalinan' },
                { urutan: 2, keterangan: 'Pantau gerak janin harian' },
                { urutan: 3, keterangan: 'Jadwalkan K6 (usia kehamilan 38 minggu) — evaluasi akhir pra-persalinan' },
                { urutan: 4, keterangan: 'Finalisasi rencana persalinan — persalinan normal di klinik atau RS' },
                { urutan: 5, keterangan: 'Edukasi IMD, ASI eksklusif, dan perawatan bayi baru lahir' },
              ],
            },
          },

          // ── K6: Trimester 3 akhir, usia kehamilan 38 minggu (23 Feb 2026) ──
          {
            label:               'K6',
            keteranganLabel:     'Kunjungan keenam — evaluasi akhir pra-persalinan, wajib oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2026-02-23T09:30:00+07:00'),
            trimester:           'TRIMESTER_3',
            usiaKehamilanMinggu: 38,
            faskes:              'RSUD Sidoarjo',
            pemeriksa:           'dr. Andhika Prasetyo, Sp.OG',
            kesanKlinis:         'G2P1A0 hamil 38 minggu aterm. Presentasi kepala sudah fully engaged. Kondisi ibu prima, janin sehat. Siap persalinan pervaginam. Tidak ada indikasi SC. Persalinan spontan berlangsung 2 hari kemudian (25 Feb 2026), lahir bayi perempuan 3.200 gram, AS 8/9.',

            motherExamination: {
              create: {
                beratBadanKg:           72.0,
                beratBadanKeterangan:   'Kenaikan 14.0 kg dari pra-hamil — dalam target ideal (11.5–16 kg)',
                lilaCm:                 27.5,
                lilaInterpretasi:       'Normal',
                lilaKeterangan:         'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:          36.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan aterm',
                tinggiUteriKeterangan:   'TFU 36 cm pada 38 minggu — normal (kepala sudah turun)',
                tdSistolik:             118,
                tdDiastolik:            76,
                tdInterpretasi:         'Normal',
                tdKeterangan:           'TD < 140/90 mmHg',
                nadi:                   84,
                nadiInterpretasi:       'Normal',
                suhu:                   36.7,
                suhuInterpretasi:       'Normal',
                pernapasan:             20,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal (tidak anemis)',
                sklera:                 'Normal (tidak ikterik)',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal — edema fisiologis minimal',
              },
            },

            fetalExamination: {
              create: {
                djjBpm:                  136,
                djjInterpretasi:         'Normal',
                djjKeterangan:           'Rentang normal 120–160 bpm',
                jumlahJanin:             1,
                presentasi:              'Presentasi Kepala',
                kepalaThPap:             'Sudah masuk panggul (fully engaged)',
                taksiranBeratJaninGram:  3200,
                taksiranBeratKeterangan: 'Sesuai usia kehamilan 38 minggu (USG biometri) — terkonfirmasi dengan BB lahir 3.200 gram',
              },
            },

            labExamination: {
              create: {
                hemoglobinGdL:           11.0,
                hemoglobinInterpretasi:  'Normal (batas bawah)',
                hemoglobinKeterangan:    'Hemodilusi trimester 3 — masih di atas cut-off anemia',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           98,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
                proteinUrinKeterangan:   'Tidak ada tanda preeklampsia',
              },
            },

            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
              },
            },

            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Rencanakan persalinan pervaginam di RSUD Sidoarjo' },
                { urutan: 2, keterangan: 'Edukasi tanda-tanda inpartu: kontraksi teratur, lendir darah, ketuban pecah' },
                { urutan: 3, keterangan: 'Segera ke IGD jika ketuban pecah atau gerakan janin berkurang' },
                { urutan: 4, keterangan: 'Edukasi IMD segera setelah lahir dan ASI eksklusif 6 bulan' },
                { urutan: 5, keterangan: 'Pastikan pendampingan suami/keluarga saat persalinan' },
                { urutan: 6, keterangan: 'Kunjungan nifas terjadwal: 6 jam, 6 hari, 2 minggu, 6 minggu post-partum' },
              ],
            },
          },
        ],
      },
    },
  })

  console.log(`✅ Pasien 2 — ${user2.fullName} (K1M → K2 → K3 → K4 → K5 → K6 — LENGKAP)`)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@anc.com' },
    update: {},
    create: {
      nik:      '0000000000000000',
      fullName: 'Administrator',
      username: 'admin',
      email:    'admin@anc.com',
      password: await hashPassword('admin123'),
      role:     'ADMIN',
    },
  })

  console.log(`✅ Admin — ${admin.fullName}`)

  const nurses = [
    {
      nik: '3578124501980001',
      fullName: 'Siti Aminah',
      username: 'siti.aminah',
      email: 'siti.aminah@anc.com',
    },
    {
      nik: '3578124601990002',
      fullName: 'Budi Santoso',
      username: 'budi.santoso',
      email: 'budi.santoso@anc.com',
    },
  ]

  for (const nurse of nurses) {
    const created = await prisma.user.upsert({
      where: { email: nurse.email },
      update: {},
      create: {
        ...nurse,
        password: await hashPassword('nurse123'),
        role: 'NURSE',
      },
    })

    console.log(`✅ Nurse — ${created.fullName}`)
  }
  console.log('\n🎉 Seeding selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
