import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";
import { hashPassword } from "../src/utils/password";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
 
async function main() {
  console.log('🌱 Seeding ANC data...')
 
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
          hpht:                       new Date('2026-01-15'),
          hplTaksiran:                new Date('2026-10-22'),
          jarakKehamilanBulan:        36,
          jarakKehamilanInterpretasi: 'Aman',
          jarakKehamilanKeterangan:   'Jarak ≥24 bulan, tidak termasuk faktor risiko 4T',
        },
      },
 
      prePregnancyData: {
        create: {
          beratBadanKg:       55.0,
          tinggiBadanCm:      160.0,
          imt:                21.48,
          imtInterpretasi:    'Normal',
          imtKeterangan:      'IMT 18.5–24.9 — target kenaikan BB 11.5–16 kg',
          targetKenaikanBbMin: 11.5,
          targetKenaikanBbMax: 16.0,
          imunisasiTtStatus:  'T3',
          merokok:            false,
          konsumsiAlkohol:    false,
        },
      },
 
      visits: {
        create: [
          {
            label:               'K2',
            keteranganLabel:     'Kunjungan kedua — idealnya masih di trimester 1, mengikuti jadwal lanjutan setelah K1',
            tanggalKunjungan:    new Date('2026-04-23T09:00:00+07:00'),
            trimester:           'TRIMESTER_2',
            usiaKehamilanMinggu: 14,
            faskes:              'Puskesmas Manyar',
            pemeriksa:           'Bidan Sri Wahyuni',
            kesanKlinis:         'Kehamilan trimester 2 dengan kondisi ibu dan janin dalam batas normal. Tidak ada faktor risiko 4T. Hasil 10T bersih.',
 
            motherExamination: {
              create: {
                beratBadanKg:          58.0,
                beratBadanKeterangan:  'Kenaikan 3.0 kg dari pra-hamil — sesuai target',
                lilaCm:                25.0,
                lilaInterpretasi:      'Normal',
                lilaKeterangan:        'LILA ≥ 23.5 cm = status gizi baik',
                tinggiUteriCm:         14.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tinggiUteriKeterangan:   'TFU ≈ usia kehamilan (cm)',
                tdSistolik:            110,
                tdDiastolik:           70,
                tdInterpretasi:        'Normal',
                tdKeterangan:          'TD < 140/90 mmHg',
                nadi:                  80,
                nadiInterpretasi:      'Normal',
                suhu:                  36.6,
                suhuInterpretasi:      'Normal',
                pernapasan:            18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:         'A',
                rhesus:                'POSITIF',
                konjungtiva:           'Normal (tidak anemis)',
                sklera:                'Normal (tidak ikterik)',
                leher:                 'Normal',
                gigiMulut:             'Normal',
                tht:                   'Normal',
                dadaJantung:           'Normal',
                dadaParu:              'Normal',
                perut:                 'Normal',
                tungkai:               'Normal (tidak edema)',
              },
            },
 
            fetalExamination: {
              create: {
                djjBpm:          145,
                djjInterpretasi: 'Normal',
                djjKeterangan:   'Rentang normal 120–160 bpm',
                jumlahJanin:     1,
                presentasi:      'Belum dapat dinilai',
              },
            },
 
            labExamination: {
              create: {
                hemoglobinGdL:          12.5,
                hemoglobinInterpretasi: 'Normal',
                hemoglobinKeterangan:   'Cut-off ibu hamil ≥ 11 g/dL',
                skriningHiv:            'NON_REACTIVE',
                skriningSifilis:        'NON_REACTIVE',
                skriningHepB:           'NON_REACTIVE',
                gulaDarahMgdL:          95,
                gulaDarahInterpretasi:  'Normal',
                gulaDarahKeterangan:    'Normal < 140 mg/dL',
                proteinUrinMgdL:        0,
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
 
            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Lanjut ANC rutin sesuai jadwal (K3 di trimester 2 lanjut)' },
                { urutan: 2, keterangan: 'Suplementasi tablet tambah darah (Fe) 1 tablet/hari' },
                { urutan: 3, keterangan: 'Edukasi gizi seimbang & tanda bahaya kehamilan' },
                { urutan: 4, keterangan: 'USG rutin di K5 (trimester 3)' },
              ],
            },
          },
        ],
      },
    },
  })
 
  console.log(`✅ Pasien 1 — ${user1.fullName}`)
 
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
          tanggalLahir:     new Date('2000-03-20'),
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
          gravida:      1,
          partus:       0,
          abortus:      0,
          hpht:         new Date('2025-12-10'),
          hplTaksiran:  new Date('2026-09-16'),
        },
      },
 
      prePregnancyData: {
        create: {
          beratBadanKg:        42.0,
          tinggiBadanCm:       155.0,
          imt:                 17.48,
          imtInterpretasi:     'Kurus',
          imtKeterangan:       'IMT < 18.5 — target kenaikan BB 12.5–18 kg',
          targetKenaikanBbMin: 12.5,
          targetKenaikanBbMax: 18.0,
          imunisasiTtStatus:   'T2',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },
 
      visits: {
        create: [
          {
            label:               'K3',
            keteranganLabel:     'Kunjungan ketiga — idealnya di trimester 2',
            tanggalKunjungan:    new Date('2026-04-24T08:30:00+07:00'),
            trimester:           'TRIMESTER_2',
            usiaKehamilanMinggu: 19,
            faskes:              'Puskesmas Sidoarjo Kota',
            pemeriksa:           'Bidan Eka Pratiwi',
            kesanKlinis:         'G1P0A0 hamil 19 minggu dengan KEK (LILA 22 cm) dan anemia ringan (Hb 10.5 g/dL). Tinggi fundus sedikit di bawah usia kehamilan, kemungkinan terkait status gizi.',
 
            motherExamination: {
              create: {
                beratBadanKg:           44.0,
                beratBadanKeterangan:   'Kenaikan 2.0 kg dari pra-hamil — di bawah target ideal',
                lilaCm:                 22.0,
                lilaInterpretasi:       'Kurang Energi Kronis (KEK)',
                lilaKeterangan:         'LILA < 23 cm — KEK',
                tinggiUteriCm:          18.0,
                tinggiUteriInterpretasi: 'Sedikit di bawah usia kehamilan',
                tinggiUteriKeterangan:   'Konsisten dengan status gizi kurang',
                tdSistolik:             100,
                tdDiastolik:            65,
                tdInterpretasi:         'Normal cenderung rendah',
                nadi:                   75,
                nadiInterpretasi:       'Normal',
                suhu:                   36.5,
                suhuInterpretasi:       'Normal',
                pernapasan:             19,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'O',
                rhesus:                 'POSITIF',
                konjungtiva:            'Tidak normal (anemis)',
                sklera:                 'Normal',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal',
              },
            },
 
            fetalExamination: {
              create: {
                djjBpm:          150,
                djjInterpretasi: 'Normal',
                jumlahJanin:     1,
              },
            },
 
            labExamination: {
              create: {
                hemoglobinGdL:           10.5,
                hemoglobinInterpretasi:  'Anemia ringan',
                hemoglobinKeterangan:    'Hb 10.0–10.9 g/dL = anemia ringan pada ibu hamil',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           88,
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
 
            supplementaryFood: {
              create: {
                diberikanMt: true,
                jenisMt:     'MT Lokal',
                keterangan:  'Diberikan karena LILA < 23.5 cm (KEK)',
              },
            },
 
            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Pemberian Makanan Tambahan (MT Lokal) selama minimal 90 hari' },
                { urutan: 2, keterangan: 'Suplementasi Fe 2 tablet/hari (dosis anemia)' },
                { urutan: 3, keterangan: 'Edukasi gizi seimbang dengan tinggi protein hewani' },
                { urutan: 4, keterangan: 'Kontrol Hb ulang dalam 4 minggu' },
                { urutan: 5, keterangan: 'Pantau kenaikan BB ketat tiap kunjungan' },
              ],
            },
          },
        ],
      },
    },
  })
 
  console.log(`✅ Pasien 2 — ${user2.fullName}`)
 
  const user3 = await prisma.user.upsert({
    where: { nik: '3573011223344501' },
    update: {},
    create: {
      nik:      '3573011223344501',
      fullName: 'Ratna Kusuma Wardhani',
      username: 'ratna.kusuma',
      email:    'ratna.kusuma@example.com',
      password: await hashPassword('password123'),
      role:     'USER',
 
      userDetail: {
        create: {
          noRekamMedis:     'RM-ANC-00003',
          jenisKelamin:     'Perempuan',
          tempatLahir:      'Malang',
          tanggalLahir:     new Date('1988-07-10'),
          namaIbuKandung:   'Suciati Wardoyo',
          statusPernikahan: 'Menikah',
          noTelepon:        '081234567803',
          jalan:            'Jl. Ijen Boulevard No. 27',
          rt:               '002',
          rw:               '004',
          kelurahanKode:    '3573021003',
          kecamatanKode:    '357302',
          kotaKabupaten:    'Kota Malang',
          kodeKota:         '3573',
          provinsi:         'Jawa Timur',
          kodeProvinsi:     '35',
          kodePos:          '65112',
          negara:           'Indonesia',
        },
      },
 
      obstetricHistory: {
        create: {
          gravida:                    4,
          partus:                     3,
          abortus:                    0,
          hpht:                       new Date('2025-11-05'),
          hplTaksiran:                new Date('2026-08-12'),
          jarakKehamilanBulan:        48,
          jarakKehamilanInterpretasi: 'Aman',
        },
      },
 
      prePregnancyData: {
        create: {
          beratBadanKg:        68.0,
          tinggiBadanCm:       158.0,
          imt:                 27.24,
          imtInterpretasi:     'Gemuk',
          imtKeterangan:       'IMT 25.0–29.9 — target kenaikan BB 7–11.5 kg',
          targetKenaikanBbMin: 7.0,
          targetKenaikanBbMax: 11.5,
          imunisasiTtStatus:   'T5',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },
 
      medicalHistories: {
        create: [
          {
            kategori:  'penyakit_keluarga',
            nama:      'Hipertensi (ibu kandung)',
          },
          {
            kategori:   'komplikasi_kehamilan',
            nama:       'Hipertensi gestasional',
            kodeIcd10:  'O13',
            keterangan: 'Hipertensi yang muncul setelah usia kehamilan 20 minggu',
          },
        ],
      },
 
      visits: {
        create: [
          {
            label:               'K4',
            keteranganLabel:     'Kunjungan keempat — idealnya di trimester 3 awal',
            tanggalKunjungan:    new Date('2026-04-25T10:00:00+07:00'),
            trimester:           'TRIMESTER_3',
            usiaKehamilanMinggu: 25,
            faskes:              'RSUD Saiful Anwar Malang',
            pemeriksa:           'dr. Anggi Permatasari, Sp.OG',
            kesanKlinis:         'G4P3A0 hamil 25 minggu dengan hipertensi gestasional (TD 145/95) disertai proteinuria (+1) — curiga preeklampsia. Faktor risiko 4T: terlalu tua dan terlalu sering. Edema pretibial ringan.',
 
            motherExamination: {
              create: {
                beratBadanKg:           73.0,
                beratBadanKeterangan:   'Kenaikan 5.0 kg dari pra-hamil',
                lilaCm:                 26.0,
                lilaInterpretasi:       'Normal',
                tinggiUteriCm:          25.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tdSistolik:             145,
                tdDiastolik:            95,
                tdInterpretasi:         'Hipertensi',
                tdKeterangan:           'TD ≥ 140/90 mmHg pada kehamilan > 20 minggu — hipertensi gestasional',
                nadi:                   88,
                nadiInterpretasi:       'Normal',
                suhu:                   36.8,
                suhuInterpretasi:       'Normal',
                pernapasan:             20,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'B',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal',
                sklera:                 'Normal',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Tidak normal — edema pretibial ringan (+)',
              },
            },
 
            fetalExamination: {
              create: {
                djjBpm:                  138,
                djjInterpretasi:         'Normal',
                jumlahJanin:             1,
                presentasi:              'Presentasi Kepala',
                kepalaThPap:             'Belum masuk panggul',
                taksiranBeratJaninGram:  800,
                taksiranBeratKeterangan: 'Sesuai usia kehamilan 25 minggu',
              },
            },
 
            labExamination: {
              create: {
                hemoglobinGdL:           11.0,
                hemoglobinInterpretasi:  'Normal (batas bawah)',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           110,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         30,
                proteinUrinInterpretasi: 'Positif (+1)',
                proteinUrinKeterangan:   'Proteinuria — bersamaan dengan hipertensi mengarah ke preeklampsia',
              },
            },
 
            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    true,
                terlaluRapat:  false,
                terlaluSering: true,
                keterangan:    'Memenuhi 2 dari 4 kriteria 4T',
              },
            },
 
            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Rujuk ke SpOG untuk evaluasi preeklampsia' },
                { urutan: 2, keterangan: 'Pemeriksaan lanjutan: protein urin 24 jam, fungsi ginjal (ureum/kreatinin), SGOT/SGPT, trombosit' },
                { urutan: 3, keterangan: 'Bed rest miring kiri' },
                { urutan: 4, keterangan: 'Pertimbangkan pemberian antihipertensi (metildopa/nifedipin) sesuai indikasi' },
                { urutan: 5, keterangan: 'Diet rendah garam, tinggi protein' },
                { urutan: 6, keterangan: 'ANC lebih sering — kontrol per 1–2 minggu' },
                { urutan: 7, keterangan: 'Edukasi tanda bahaya preeklampsia berat' },
                { urutan: 8, keterangan: 'Persalinan direncanakan di RS rujukan dengan fasilitas NICU' },
              ],
            },
          },
        ],
      },
    },
  })
 
  console.log(`✅ Pasien 3 — ${user3.fullName}`)
 
  const user4 = await prisma.user.upsert({
    where: { nik: '3525055667788901' },
    update: {},
    create: {
      nik:      '3525055667788901',
      fullName: 'Putri Ayu Lestari',
      username: 'putri.ayu',
      email:    'putri.ayu@example.com',
      password: await hashPassword('password123'),
      role:     'USER',
 
      userDetail: {
        create: {
          noRekamMedis:     'RM-ANC-00004',
          jenisKelamin:     'Perempuan',
          tempatLahir:      'Gresik',
          tanggalLahir:     new Date('2007-09-05'),
          namaIbuKandung:   'Endang Suryani',
          statusPernikahan: 'Menikah',
          noTelepon:        '081234567804',
          jalan:            'Jl. Veteran Gg. Mawar No. 3',
          rt:               '004',
          rw:               '001',
          kelurahanKode:    '3525012001',
          kecamatanKode:    '352501',
          kotaKabupaten:    'Kab. Gresik',
          kodeKota:         '3525',
          provinsi:         'Jawa Timur',
          kodeProvinsi:     '35',
          kodePos:          '61121',
          negara:           'Indonesia',
        },
      },
 
      obstetricHistory: {
        create: {
          gravida:     1,
          partus:      0,
          abortus:     0,
          hpht:        new Date('2026-02-01'),
          hplTaksiran: new Date('2026-11-08'),
        },
      },
 
      prePregnancyData: {
        create: {
          beratBadanKg:        48.0,
          tinggiBadanCm:       152.0,
          imt:                 20.78,
          imtInterpretasi:     'Normal',
          imtKeterangan:       'IMT 18.5–24.9 — target kenaikan BB 11.5–16 kg',
          targetKenaikanBbMin: 11.5,
          targetKenaikanBbMax: 16.0,
          imunisasiTtStatus:   'T0',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },
 
      visits: {
        create: [
          {
            label:               'K1M',
            keteranganLabel:     'Kunjungan pertama (murni) — kunjungan pertama dilakukan di trimester 1 (≤12 minggu), wajib oleh dokter dengan USG',
            tanggalKunjungan:    new Date('2026-04-22T14:00:00+07:00'),
            trimester:           'TRIMESTER_1',
            usiaKehamilanMinggu: 11,
            faskes:              'Puskesmas Manyar Gresik',
            pemeriksa:           'dr. Rini Kartika (Dokter Umum) + Bidan Lia',
            kesanKlinis:         'G1P0A0 hamil 11 minggu, primigravida usia 18 tahun (terlalu muda). LILA borderline berisiko KEK. Belum pernah imunisasi TT (T0). Hb batas bawah normal.',
 
            motherExamination: {
              create: {
                beratBadanKg:           49.0,
                beratBadanKeterangan:   'Kenaikan 1.0 kg dari pra-hamil — sesuai trimester 1',
                lilaCm:                 23.2,
                lilaInterpretasi:       'Risiko Kurang Energi Kronis (KEK)',
                lilaKeterangan:         'LILA 23 – <23.5 cm — zona berisiko KEK, perlu intervensi gizi dini',
                tinggiUteriCm:          null,
                tinggiUteriKeterangan:  'Belum dapat diperiksa — uterus masih di bawah simfisis pubis (trimester 1)',
                tdSistolik:             105,
                tdDiastolik:            68,
                tdInterpretasi:         'Normal',
                nadi:                   82,
                nadiInterpretasi:       'Normal',
                suhu:                   36.7,
                suhuInterpretasi:       'Normal',
                pernapasan:             18,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'A',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal',
                sklera:                 'Normal',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal',
              },
            },
 
            fetalExamination: {
              create: {
                djjBpm:               null,
                djjKeterangan:        'Belum rutin diperiksa — auskultasi DJJ umumnya mulai usia kehamilan 12 minggu (Doppler)',
                jumlahJanin:          1,
                usgGestationalSacCm:  4.2,
                usgCrownRumpLengthCm: 4.5,
                usgLetakJanin:        'Intrauteri',
                usgKeterangan:        'USG oleh dokter sesuai protokol K1M',
              },
            },
 
            labExamination: {
              create: {
                hemoglobinGdL:           11.2,
                hemoglobinInterpretasi:  'Normal (batas bawah)',
                hemoglobinKeterangan:    'Tepat di atas cut-off anemia (≥11)',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           92,
                gulaDarahInterpretasi:   'Normal',
                proteinUrinMgdL:         0,
                proteinUrinInterpretasi: 'Negatif',
              },
            },
 
            fourTMonitoring: {
              create: {
                terlaluMuda:   true,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
                keterangan:    'Memenuhi 1 kriteria 4T — terlalu muda (18 tahun)',
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
                { urutan: 1, keterangan: 'Mulai imunisasi TT — dijadwalkan TT1' },
                { urutan: 2, keterangan: 'Suplementasi Fe profilaksis 1 tablet/hari' },
                { urutan: 3, keterangan: 'Konseling gizi intensif untuk cegah KEK berkembang' },
                { urutan: 4, keterangan: 'Wajib mengikuti kelas ibu hamil' },
                { urutan: 5, keterangan: 'Edukasi tanda bahaya kehamilan, IMD, ASI eksklusif' },
                { urutan: 6, keterangan: 'Dukungan psikososial — kehamilan remaja' },
                { urutan: 7, keterangan: 'Kontrol K2 di trimester 1 (4 minggu lagi)' },
              ],
            },
          },
        ],
      },
    },
  })
 
  console.log(`✅ Pasien 4 — ${user4.fullName}`)
 
  const user5 = await prisma.user.upsert({
    where: { nik: '3576099887766501' },
    update: {},
    create: {
      nik:      '3576099887766501',
      fullName: 'Maya Anggraeni Saputri',
      username: 'maya.anggraeni',
      email:    'maya.anggraeni@example.com',
      password: await hashPassword('password123'),
      role:     'USER',
 
      userDetail: {
        create: {
          noRekamMedis:     'RM-ANC-00005',
          jenisKelamin:     'Perempuan',
          tempatLahir:      'Mojokerto',
          tanggalLahir:     new Date('1992-12-25'),
          namaIbuKandung:   'Hartini Saputri',
          statusPernikahan: 'Menikah',
          noTelepon:        '081234567805',
          jalan:            'Jl. Gajah Mada No. 88',
          rt:               '005',
          rw:               '003',
          kelurahanKode:    '3576011005',
          kecamatanKode:    '357601',
          kotaKabupaten:    'Kota Mojokerto',
          kodeKota:         '3576',
          provinsi:         'Jawa Timur',
          kodeProvinsi:     '35',
          kodePos:          '61314',
          negara:           'Indonesia',
        },
      },
 
      obstetricHistory: {
        create: {
          gravida:                    3,
          partus:                     1,
          abortus:                    1,
          hpht:                       new Date('2025-10-20'),
          hplTaksiran:                new Date('2026-07-27'),
          jarakKehamilanBulan:        60,
          jarakKehamilanInterpretasi: 'Aman',
        },
      },
 
      prePregnancyData: {
        create: {
          beratBadanKg:        78.0,
          tinggiBadanCm:       162.0,
          imt:                 29.72,
          imtInterpretasi:     'Gemuk (borderline obesitas)',
          imtKeterangan:       'IMT 25.0–29.9 — target kenaikan BB 7–11.5 kg — sangat dekat batas obesitas (≥30)',
          targetKenaikanBbMin: 7.0,
          targetKenaikanBbMax: 11.5,
          imunisasiTtStatus:   'T4',
          merokok:             false,
          konsumsiAlkohol:     false,
        },
      },
 
      medicalHistories: {
        create: [
          {
            kategori: 'penyakit_keluarga',
            nama:     'Diabetes Mellitus tipe 2 (ayah kandung)',
          },
        ],
      },
 
      visits: {
        create: [
          {
            label:               'K5',
            keteranganLabel:     'Kunjungan kelima — trimester 3, kembali wajib oleh dokter dengan USG untuk evaluasi menjelang persalinan',
            tanggalKunjungan:    new Date('2026-04-25T11:30:00+07:00'),
            trimester:           'TRIMESTER_3',
            usiaKehamilanMinggu: 27,
            faskes:              'RSUD Prof. Dr. Soekandar Mojokerto',
            pemeriksa:           'dr. Bagus Wicaksono, Sp.OG',
            kesanKlinis:         'G3P1A1 hamil 27 minggu dengan riwayat 1× abortus. IMT pra-hamil borderline obesitas. GDS 165 mg/dL — curiga Diabetes Mellitus Gestasional. TD pre-hipertensi 130/85. Riwayat keluarga DM (ayah).',
 
            motherExamination: {
              create: {
                beratBadanKg:           85.0,
                beratBadanKeterangan:   'Kenaikan 7.0 kg dari pra-hamil — mendekati batas atas target (11.5 kg)',
                lilaCm:                 28.0,
                lilaInterpretasi:       'Normal',
                tinggiUteriCm:          27.0,
                tinggiUteriInterpretasi: 'Sesuai usia kehamilan',
                tdSistolik:             130,
                tdDiastolik:            85,
                tdInterpretasi:         'Pre-hipertensi',
                tdKeterangan:           'Belum mencapai kriteria hipertensi (<140/90), tapi perlu monitor ketat',
                nadi:                   90,
                nadiInterpretasi:       'Normal (batas atas)',
                suhu:                   36.9,
                suhuInterpretasi:       'Normal',
                pernapasan:             19,
                pernapasanInterpretasi: 'Normal',
                golonganDarah:          'AB',
                rhesus:                 'POSITIF',
                konjungtiva:            'Normal',
                sklera:                 'Normal',
                leher:                  'Normal',
                gigiMulut:              'Normal',
                tht:                    'Normal',
                dadaJantung:            'Normal',
                dadaParu:               'Normal',
                perut:                  'Normal',
                tungkai:                'Normal',
              },
            },
 
            fetalExamination: {
              create: {
                djjBpm:                  142,
                djjInterpretasi:         'Normal',
                jumlahJanin:             1,
                presentasi:              'Presentasi Kepala',
                kepalaThPap:             'Belum masuk panggul',
                taksiranBeratJaninGram:  1100,
                taksiranBeratKeterangan: 'Sesuai usia kehamilan 27 minggu',
              },
            },
 
            labExamination: {
              create: {
                hemoglobinGdL:           11.8,
                hemoglobinInterpretasi:  'Normal',
                skriningHiv:             'NON_REACTIVE',
                skriningSifilis:         'NON_REACTIVE',
                skriningHepB:            'NON_REACTIVE',
                gulaDarahMgdL:           165,
                gulaDarahInterpretasi:   'Tinggi — curiga Diabetes Gestasional',
                gulaDarahKeterangan:     'GDS ≥ 140 mg/dL pada ibu hamil indikasi pemeriksaan OGTT konfirmasi',
                proteinUrinMgdL:         15,
                proteinUrinInterpretasi: 'Trace',
                proteinUrinKeterangan:   'Belum signifikan tapi perlu pantau (terutama bersama TD borderline)',
              },
            },
 
            fourTMonitoring: {
              create: {
                terlaluMuda:   false,
                terlaluTua:    false,
                terlaluRapat:  false,
                terlaluSering: false,
                keterangan:    'Tidak memenuhi kriteria 4T, namun ada risiko metabolik lain',
              },
            },
 
            followUpPlans: {
              create: [
                { urutan: 1, keterangan: 'Rujuk untuk pemeriksaan OGTT (Tes Toleransi Glukosa Oral) — konfirmasi GDM' },
                { urutan: 2, keterangan: 'Konsultasi internis/SpPD endokrin jika OGTT positif' },
                { urutan: 3, keterangan: 'Konsultasi gizi: diet diabetes kehamilan (DM-G)' },
                { urutan: 4, keterangan: 'Pantau gerak janin harian' },
                { urutan: 5, keterangan: 'Pantau TD ketat — minimal tiap 2 minggu' },
                { urutan: 6, keterangan: 'USG biometri janin dan estimasi cairan ketuban' },
                { urutan: 7, keterangan: 'Edukasi tanda bahaya: preeklampsia & makrosomia' },
                { urutan: 8, keterangan: 'Persalinan direncanakan di RS dengan fasilitas perinatologi' },
              ],
            },
          },
        ],
      },
    },
  })
 
  console.log(`✅ Pasien 5 — ${user5.fullName}`)
 
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
 
