// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DATA from './products.json';
import ModeSwitch from './ModeSwitch';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CloudRain,
  Mic,
  Lock,
  AlertTriangle,
  Undo2,
  Plus,
  Minus,
  Download,
  CheckCircle2,
  Circle,
  Radio,
  FileText,
  X,
  Printer,
} from 'lucide-react';

/* ================= translations (UI text only) ================= */
const TR = {
  en: {
    tab1: 'Daily Cash Flow',
    tab2: 'Business Growth',
    tab3: 'Projections & Buffer',
    privacy: 'Offline-first storage. Data stays 100% on this device.',
    backup: 'Backup',
    sample: 'Load sample',
    clear: 'Clear all',
    confirmClear: 'Delete all records on this device?',
    sellTitle: 'Tap each sale (+RM)',
    sellHint: "One tap adds the price to today's total sales.",
    otherRm: 'Other RM',
    addSale: 'Add sale',
    undoSale: 'Undo last sale',
    p0: 'Single Fruit',
    p1: 'Mix 2 Fruits',
    p2: 'Special Blend',
    p3: 'Add-on / Extra',
    costTitle: 'Tap each cost (-RM)',
    costHint: 'Record stock and stall costs as you pay them.',
    c0: 'Fruit Stock',
    c1: 'Ice & Cups',
    c2: 'Stall Fee',
    addCost: 'Add cost',
    undoCost: 'Undo last cost',
    simBadge: 'Simulation Mode / Demo (no real e-wallet link)',
    simBtn: 'Simulate QR sale',
    voiceBtn: 'Voice Quick-Log',
    plBtn: 'Export P&L Statement',
    listening: 'Listening...',
    vNoSupport:
      'Voice recognition is not supported in this browser. Try Chrome.',
    vErr: 'Could not hear clearly. Please try again.',
    vHeard: 'Heard "{raw}". Added {items} = RM {amt}.',
    vNone:
      'Heard "{raw}" but found no drink or amount. Try "2 mix", "1 special" or "RM 8".',
    simMsg:
      'Simulated QR payment: +RM {a}. Demo only, not a real e-wallet link.',
    todayTitle: "Today's numbers (RM)",
    totalSales: 'Total sales',
    ingr: 'Ingredients (fruits, ice, cups...)',
    rent: 'Stall rental today',
    snapTitle: 'End-of-day snapshot',
    snapSales: 'Total daily sales',
    snapCosts: 'Ingredient and stall costs',
    snapNet: 'Untung Bersih (net profit)',
    saved: 'Saved automatically on this device.',
    alertTitle: 'Supplier price alerts',
    alertHint:
      'Add what you pay each time you buy. We compare with your last purchase of the same item.',
    itemPh: 'Item, e.g. Fresh Fruits (30kg)',
    pricePh: 'Price RM',
    add: 'Add',
    needItem: 'Enter an item name and a price above 0.',
    noSpikes:
      'Add the same item at least twice to see price changes over time.',
    spikeAdvice:
      'Price is up {p}% since your last purchase. Check other suppliers, ask for a bulk price, or adjust your selling price.',
    to: 'to',
    extraTitle: 'What to do with extra cash',
    extraHint: 'Last 30 days profit, minus your monthly fixed costs.',
    logFirst: 'Log some sales first to calculate.',
    needFixed: 'Enter your monthly fixed costs (Projections tab) to see this.',
    notCover:
      'Profit of RM {a} does not cover your fixed costs of RM {b} yet. Focus on costs first.',
    extraThis: 'Extra cash this month:',
    toBuf: 'RM {a} to your rainy-day buffer first (still RM {b} short).',
    stockLine:
      "Up to RM {a} to buy stock in bulk, only if the supplier's unit price is really lower.",
    parkLine: 'RM {a} in an easy-withdrawal account (see Projections tab).',
    rule: 'A simple rule of thumb, not financial advice.',
    readyTitle: 'Estimated readiness checklist for SME grants / TEKUN',
    readyHint:
      'An estimate from your own records. It is not an approval, and the real rules are set by each lender or agency.',
    progress: 'Checklist progress',
    progVal: '{a} of {b} ({c}%)',
    ck1: 'Logged sales on at least 20 of the last 30 days',
    ck2: 'Average daily profit is above zero',
    ck3: 'Costs recorded on at least 80% of logged days',
    ck4: 'Cash buffer covers at least 7 days of fixed costs',
    m1: 'Business is registered (e.g. SSM)',
    m2: "Has a bank or e-wallet account in the business owner's name",
    myNums: 'My numbers',
    fixedLbl: 'Fixed costs per month even if closed (RM)',
    fixedPh: 'Living, loans, phone',
    cashLbl: 'Cash saved as buffer (RM)',
    daysOpen: 'Days open per week',
    projTitle: 'Cash projection',
    d30: '30 days',
    m12: '12 months',
    wetLbl: 'Rainy day / slow season',
    rainyLbl: 'Rainy days you cannot open each month: {n} days',
    dropLbl: 'Sales drop in slow months (Nov to Feb): {n}%',
    noProj:
      'Log some days of sales and costs first. The projection uses your own records (or tap Load sample).',
    normal: 'Normal weeks',
    scen: 'Rainy / slow scenario',
    lowest: 'Lowest cash',
    lowestWet: 'Lowest cash (worst of both lines)',
    endCash: 'Cash at the end',
    endCashWet: 'Cash at the end (scenario)',
    basis:
      'Based on your average of the last {n} logged days: sales RM {s}, costs RM {c} a day. Rainy days and the slow-season drop are your own assumptions, not forecasts.',
    chartAria: 'Projected cash',
    bufTitle: 'Rainy-day buffer',
    bufNeedFixed:
      'Enter your monthly fixed costs above to calculate buffer needs.',
    closeLbl: 'Closed days to survive: {n} days',
    bufNeeded: 'Buffer needed',
    bufStill: 'Still to save',
    bufPerDay: 'Set aside per day (90 days)',
    bufMsg:
      'Set aside RM {a} a day for 90 days to cover {n} closed days of fixed costs.',
    bufOk: 'Your buffer already covers {n} closed days.',
    keepTitle: 'Where to keep your buffer',
    keepHint:
      'Easy-withdrawal options only, shown for RM {a}. Rates come from our product list and can change.',
    perYear: '{r}% a year (about RM {m} a month)',
    anytime: 'Withdraw anytime',
    oneDay: 'Money back in about 1 business day',
    pidm: 'PIDM protected',
    noPidm: 'Not PIDM protected',
    demoRate: 'demo rate, not yet verified',
    notAdvice:
      "Not financial advice. Check the provider's current rate and terms before depositing.",
    plTitle: 'Statement of Profit and Loss',
    plBiz: 'Business name',
    plOwner: 'Owner / prepared by',
    plPeriod: 'Period',
    plDays: '{n} days with records',
    plNoRec: 'No records yet',
    plPrepared: 'Date prepared',
    plRev: 'Revenue (sales)',
    plCogs: 'Less: Cost of goods sold (ingredients)',
    plGross: 'Gross profit',
    plOpex: 'Less: Operating expenses',
    plRentLine: 'Stall rental',
    plNet: 'Net profit (Untung Bersih)',
    plMargin: 'Net profit margin',
    plAvg: 'Average daily sales',
    plNotes: 'Notes',
    plNote1:
      'Prepared on a cash basis from daily records entered by the business owner in FinScope.',
    plNote2:
      'This statement is self-reported. It has not been audited, reviewed or verified by FinScope or any third party, and is not an official accounts document.',
    plNote3: 'All amounts are in Malaysian Ringgit (RM).',
    plSignOwner: 'Owner signature',
    plSignDate: 'Date',
    plPrint: 'Print / Save as PDF',
    close: 'Close',
    unaudited: 'Self-reported, unaudited',
    lang: 'Language',
  },
  ms: {
    tab1: 'Aliran Tunai Harian',
    tab2: 'Pertumbuhan Perniagaan',
    tab3: 'Unjuran & Simpanan',
    privacy: 'Storan luar talian dahulu. Data kekal 100% pada peranti ini.',
    backup: 'Sandaran',
    sample: 'Muat contoh',
    clear: 'Padam semua',
    confirmClear: 'Padam semua rekod pada peranti ini?',
    sellTitle: 'Ketik setiap jualan (+RM)',
    sellHint: 'Satu ketikan menambah harga ke jumlah jualan hari ini.',
    otherRm: 'RM lain',
    addSale: 'Tambah jualan',
    undoSale: 'Buat asal jualan terakhir',
    p0: 'Buah Tunggal',
    p1: 'Campuran 2 Buah',
    p2: 'Campuran Istimewa',
    p3: 'Tambahan',
    costTitle: 'Ketik setiap kos (-RM)',
    costHint: 'Rekod kos stok dan gerai semasa anda membayar.',
    c0: 'Stok Buah',
    c1: 'Ais & Cawan',
    c2: 'Yuran Gerai',
    addCost: 'Tambah kos',
    undoCost: 'Buat asal kos terakhir',
    simBadge: 'Mod Simulasi / Demo (tiada sambungan e-dompet sebenar)',
    simBtn: 'Simulasi jualan QR',
    voiceBtn: 'Log Pantas Suara',
    plBtn: 'Eksport Penyata Untung Rugi',
    listening: 'Mendengar...',
    vNoSupport:
      'Pengecaman suara tidak disokong dalam pelayar ini. Cuba Chrome.',
    vErr: 'Tidak dapat mendengar dengan jelas. Sila cuba lagi.',
    vHeard: 'Didengar "{raw}". Ditambah {items} = RM {amt}.',
    vNone:
      'Didengar "{raw}" tetapi tiada minuman atau jumlah ditemui. Cuba "2 campur", "1 istimewa" atau "RM 8".',
    simMsg:
      'Bayaran QR simulasi: +RM {a}. Demo sahaja, bukan sambungan e-dompet sebenar.',
    todayTitle: 'Nombor hari ini (RM)',
    totalSales: 'Jumlah jualan',
    ingr: 'Bahan (buah, ais, cawan...)',
    rent: 'Sewa gerai hari ini',
    snapTitle: 'Ringkasan hujung hari',
    snapSales: 'Jumlah jualan harian',
    snapCosts: 'Kos bahan dan gerai',
    snapNet: 'Untung Bersih (keuntungan bersih)',
    saved: 'Disimpan secara automatik pada peranti ini.',
    alertTitle: 'Amaran harga pembekal',
    alertHint:
      'Tambah harga yang anda bayar setiap kali membeli. Kami bandingkan dengan pembelian terakhir item yang sama.',
    itemPh: 'Item, cth. Buah Segar (30kg)',
    pricePh: 'Harga RM',
    add: 'Tambah',
    needItem: 'Masukkan nama item dan harga melebihi 0.',
    noSpikes:
      'Tambah item yang sama sekurang-kurangnya dua kali untuk melihat perubahan harga.',
    spikeAdvice:
      'Harga naik {p}% sejak pembelian terakhir anda. Semak pembekal lain, minta harga borong, atau laraskan harga jualan anda.',
    to: 'kepada',
    extraTitle: 'Apa nak buat dengan wang lebihan',
    extraHint: 'Keuntungan 30 hari lepas, tolak kos tetap bulanan anda.',
    logFirst: 'Log beberapa jualan dahulu untuk mengira.',
    needFixed:
      'Masukkan kos tetap bulanan anda (tab Unjuran) untuk melihat ini.',
    notCover:
      'Keuntungan RM {a} belum menampung kos tetap RM {b}. Fokus pada kos dahulu.',
    extraThis: 'Wang lebihan bulan ini:',
    toBuf: 'RM {a} ke simpanan hari hujan anda dahulu (masih kurang RM {b}).',
    stockLine:
      'Sehingga RM {a} untuk membeli stok secara borong, hanya jika harga seunit pembekal benar-benar lebih rendah.',
    parkLine: 'RM {a} dalam akaun yang mudah dikeluarkan (lihat tab Unjuran).',
    rule: 'Petua mudah, bukan nasihat kewangan.',
    readyTitle: 'Senarai semak kesediaan anggaran untuk geran PKS / TEKUN',
    readyHint:
      'Anggaran daripada rekod anda sendiri. Ia bukan kelulusan, dan syarat sebenar ditetapkan oleh setiap pemberi pinjaman atau agensi.',
    progress: 'Kemajuan senarai semak',
    progVal: '{a} daripada {b} ({c}%)',
    ck1: 'Merekod jualan sekurang-kurangnya 20 daripada 30 hari lepas',
    ck2: 'Purata keuntungan harian melebihi sifar',
    ck3: 'Kos direkod pada sekurang-kurangnya 80% hari yang dilog',
    ck4: 'Simpanan tunai menampung sekurang-kurangnya 7 hari kos tetap',
    m1: 'Perniagaan berdaftar (cth. SSM)',
    m2: 'Mempunyai akaun bank atau e-dompet atas nama pemilik perniagaan',
    myNums: 'Nombor saya',
    fixedLbl: 'Kos tetap sebulan walaupun tutup (RM)',
    fixedPh: 'Sara hidup, pinjaman, telefon',
    cashLbl: 'Tunai disimpan sebagai simpanan (RM)',
    daysOpen: 'Hari buka seminggu',
    projTitle: 'Unjuran tunai',
    d30: '30 hari',
    m12: '12 bulan',
    wetLbl: 'Hari hujan / musim perlahan',
    rainyLbl: 'Hari hujan anda tidak boleh buka setiap bulan: {n} hari',
    dropLbl: 'Penurunan jualan pada bulan perlahan (Nov hingga Feb): {n}%',
    noProj:
      'Log beberapa hari jualan dan kos dahulu. Unjuran menggunakan rekod anda sendiri (atau tekan Muat contoh).',
    normal: 'Minggu biasa',
    scen: 'Senario hujan / perlahan',
    lowest: 'Tunai terendah',
    lowestWet: 'Tunai terendah (yang paling teruk antara dua garisan)',
    endCash: 'Tunai di penghujung',
    endCashWet: 'Tunai di penghujung (senario)',
    basis:
      'Berdasarkan purata {n} hari log terakhir anda: jualan RM {s}, kos RM {c} sehari. Hari hujan dan penurunan musim perlahan ialah andaian anda sendiri, bukan ramalan.',
    chartAria: 'Unjuran tunai',
    bufTitle: 'Simpanan hari hujan',
    bufNeedFixed:
      'Masukkan kos tetap bulanan anda di atas untuk mengira keperluan simpanan.',
    closeLbl: 'Hari tutup yang perlu ditampung: {n} hari',
    bufNeeded: 'Simpanan diperlukan',
    bufStill: 'Masih perlu disimpan',
    bufPerDay: 'Diketepikan sehari (90 hari)',
    bufMsg:
      'Ketepikan RM {a} sehari selama 90 hari untuk menampung {n} hari tutup kos tetap.',
    bufOk: 'Simpanan anda sudah menampung {n} hari tutup.',
    keepTitle: 'Di mana untuk simpan simpanan anda',
    keepHint:
      'Pilihan mudah keluarkan sahaja, ditunjukkan untuk RM {a}. Kadar datang daripada senarai produk kami dan boleh berubah.',
    perYear: '{r}% setahun (kira-kira RM {m} sebulan)',
    anytime: 'Boleh tarik bila-bila masa',
    oneDay: 'Wang kembali dalam kira-kira 1 hari bekerja',
    pidm: 'Dilindungi PIDM',
    noPidm: 'Tidak dilindungi PIDM',
    demoRate: 'kadar demo, belum disahkan',
    notAdvice:
      'Bukan nasihat kewangan. Semak kadar dan terma semasa pembekal sebelum membuat deposit.',
    plTitle: 'Penyata Untung Rugi',
    plBiz: 'Nama perniagaan',
    plOwner: 'Pemilik / disediakan oleh',
    plPeriod: 'Tempoh',
    plDays: '{n} hari dengan rekod',
    plNoRec: 'Tiada rekod lagi',
    plPrepared: 'Tarikh disediakan',
    plRev: 'Hasil (jualan)',
    plCogs: 'Tolak: Kos jualan (bahan)',
    plGross: 'Untung kasar',
    plOpex: 'Tolak: Perbelanjaan operasi',
    plRentLine: 'Sewa gerai',
    plNet: 'Untung bersih (Untung Bersih)',
    plMargin: 'Margin untung bersih',
    plAvg: 'Purata jualan harian',
    plNotes: 'Nota',
    plNote1:
      'Disediakan atas asas tunai daripada rekod harian yang dimasukkan oleh pemilik perniagaan dalam FinScope.',
    plNote2:
      'Penyata ini dilaporkan sendiri. Ia belum diaudit, disemak atau disahkan oleh FinScope atau mana-mana pihak ketiga, dan bukan dokumen akaun rasmi.',
    plNote3: 'Semua jumlah dalam Ringgit Malaysia (RM).',
    plSignOwner: 'Tandatangan pemilik',
    plSignDate: 'Tarikh',
    plPrint: 'Cetak / Simpan sebagai PDF',
    close: 'Tutup',
    unaudited: 'Dilaporkan sendiri, tidak diaudit',
    lang: 'Bahasa',
  },
  zh: {
    tab1: '每日现金流',
    tab2: '业务增长',
    tab3: '预测与缓冲金',
    privacy: '离线优先存储。数据 100% 保存在本设备上。',
    backup: '备份',
    sample: '载入示例',
    clear: '全部清除',
    confirmClear: '删除本设备上的所有记录？',
    sellTitle: '点击每笔销售 (+RM)',
    sellHint: '点一下即可把价格加入今日销售总额。',
    otherRm: '其他金额 RM',
    addSale: '添加销售',
    undoSale: '撤销上一笔销售',
    p0: '单一水果',
    p1: '混合两种水果',
    p2: '特调果汁',
    p3: '加料',
    costTitle: '点击每笔成本 (-RM)',
    costHint: '付款时记录进货和摊位成本。',
    c0: '水果进货',
    c1: '冰块和杯子',
    c2: '摊位费',
    addCost: '添加成本',
    undoCost: '撤销上一笔成本',
    simBadge: '模拟模式 / 演示（未连接真实电子钱包）',
    simBtn: '模拟二维码销售',
    voiceBtn: '语音快速记录',
    plBtn: '导出损益表',
    listening: '正在聆听…',
    vNoSupport: '此浏览器不支持语音识别，请使用 Chrome。',
    vErr: '没有听清楚，请再试一次。',
    vHeard: '听到“{raw}”。已添加 {items} = RM {amt}。',
    vNone:
      '听到“{raw}”，但没有找到饮品或金额。请试试“2 混合”、“1 特调”或“RM 8”。',
    simMsg: '模拟二维码付款：+RM {a}。仅为演示，不是真实的电子钱包连接。',
    todayTitle: '今日数字 (RM)',
    totalSales: '销售总额',
    ingr: '原料（水果、冰、杯子…）',
    rent: '今日摊位租金',
    snapTitle: '当日结算',
    snapSales: '当日销售总额',
    snapCosts: '原料和摊位成本',
    snapNet: 'Untung Bersih（净利润）',
    saved: '已自动保存在本设备上。',
    alertTitle: '供应商价格提醒',
    alertHint: '每次进货时输入你付的价格，我们会与上次购买同一物品的价格比较。',
    itemPh: '物品，例如：新鲜水果（30公斤）',
    pricePh: '价格 RM',
    add: '添加',
    needItem: '请输入物品名称和大于 0 的价格。',
    noSpikes: '同一物品至少添加两次，才能看到价格变化。',
    spikeAdvice:
      '价格比上次购买上涨了 {p}%。可以比较其他供应商、询问批发价，或调整售价。',
    to: '至',
    extraTitle: '多余现金怎么用',
    extraHint: '最近 30 天利润，减去每月固定开销。',
    logFirst: '请先记录一些销售再计算。',
    needFixed: '请在“预测与缓冲金”页输入每月固定开销。',
    notCover: '利润 RM {a} 还不够支付固定开销 RM {b}。请先控制成本。',
    extraThis: '本月多余现金：',
    toBuf: '先存 RM {a} 到雨天缓冲金（还差 RM {b}）。',
    stockLine: '最多 RM {a} 用于批量进货，前提是供应商的单价确实更低。',
    parkLine: 'RM {a} 存入可随时取款的账户（见“预测与缓冲金”页）。',
    rule: '简单经验法则，不是财务建议。',
    readyTitle: '中小企业补助 / TEKUN 申请准备度估算清单',
    readyHint:
      '根据你自己的记录得出的估算。这不是批准，实际条件由各贷款机构或机构自行决定。',
    progress: '清单进度',
    progVal: '{b} 项中已完成 {a} 项（{c}%）',
    ck1: '最近 30 天中至少 20 天有销售记录',
    ck2: '平均每日利润大于零',
    ck3: '至少 80% 的记录日有成本记录',
    ck4: '现金缓冲金至少能覆盖 7 天固定开销',
    m1: '业务已注册（例如 SSM）',
    m2: '拥有以业主名义开设的银行或电子钱包账户',
    myNums: '我的数字',
    fixedLbl: '即使休业也要付的每月固定开销 (RM)',
    fixedPh: '生活费、贷款、电话',
    cashLbl: '已存的缓冲现金 (RM)',
    daysOpen: '每周营业天数',
    projTitle: '现金预测',
    d30: '30 天',
    m12: '12 个月',
    wetLbl: '雨天 / 淡季',
    rainyLbl: '每月因下雨无法营业的天数：{n} 天',
    dropLbl: '淡季（11 月至 2 月）销售下降：{n}%',
    noProj:
      '请先记录几天的销售和成本。预测使用你自己的记录（或点“载入示例”）。',
    normal: '正常周',
    scen: '雨天 / 淡季情景',
    lowest: '最低现金',
    lowestWet: '最低现金（两条线中较低者）',
    endCash: '期末现金',
    endCashWet: '期末现金（情景）',
    basis:
      '根据你最近 {n} 个记录日的平均值：每天销售 RM {s}，成本 RM {c}。雨天和淡季下降幅度是你自己的假设，不是预测。',
    chartAria: '预测现金',
    bufTitle: '雨天缓冲金',
    bufNeedFixed: '请在上方输入每月固定开销以计算所需缓冲金。',
    closeLbl: '需要撑过的休业天数：{n} 天',
    bufNeeded: '所需缓冲金',
    bufStill: '还需储蓄',
    bufPerDay: '每天存入（90 天）',
    bufMsg: '连续 90 天每天存 RM {a}，可覆盖 {n} 个休业日的固定开销。',
    bufOk: '你的缓冲金已能覆盖 {n} 个休业日。',
    keepTitle: '缓冲金放在哪里',
    keepHint:
      '仅列出可随时取款的选项，以 RM {a} 计算。利率来自我们的产品清单，可能会变动。',
    perYear: '年利率 {r}%（每月约 RM {m}）',
    anytime: '随时可提取',
    oneDay: '约 1 个工作日到账',
    pidm: '受 PIDM 保障',
    noPidm: '不受 PIDM 保障',
    demoRate: '示范利率，尚未核实',
    notAdvice: '这不是财务建议。存款前请核对机构当前利率和条款。',
    plTitle: '损益表',
    plBiz: '业务名称',
    plOwner: '业主 / 编制人',
    plPeriod: '期间',
    plDays: '有记录的天数：{n}',
    plNoRec: '暂无记录',
    plPrepared: '编制日期',
    plRev: '收入（销售）',
    plCogs: '减：销货成本（原料）',
    plGross: '毛利',
    plOpex: '减：营业费用',
    plRentLine: '摊位租金',
    plNet: '净利润 (Untung Bersih)',
    plMargin: '净利润率',
    plAvg: '日均销售额',
    plNotes: '附注',
    plNote1: '根据业主在 FinScope 中输入的每日记录，按现金收付制编制。',
    plNote2:
      '本报表为自行申报，未经 FinScope 或任何第三方审计、审阅或核实，也不是正式的会计文件。',
    plNote3: '所有金额以马来西亚令吉（RM）计。',
    plSignOwner: '业主签名',
    plSignDate: '日期',
    plPrint: '打印 / 另存为 PDF',
    close: '关闭',
    unaudited: '自行申报，未经审计',
    lang: '语言',
  },
};
const tr = (lang, k, v) => {
  let s = (TR[lang] && TR[lang][k]) ?? TR.en[k] ?? k;
  if (v) for (const x in v) s = s.split(`{${x}}`).join(v[x]);
  return s;
};
const VOICE_LANG = { en: 'en-MY', ms: 'ms-MY', zh: 'zh-CN' };

/* ================= helpers & constants ================= */
const KEY = 'finscope.vendor.v1';
const fmt = (n) =>
  (n || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const dkey = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);
const ago = (n) => dkey(new Date(Date.now() - n * 864e5));
const dmy = (s) => (s ? s.split('-').reverse().join('/') : '');
const MN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const SLOW = [10, 11, 0, 1]; // Nov-Feb
const BLANK = { sales: 0, ingr: 0, rent: 0, taps: [], costs: [] };
const EMPTY = {
  days: {},
  buys: [],
  fixed: 0,
  cash: 0,
  opWeek: 6,
  closeDays: 14,
  ssm: false,
  acct: false,
  biz: '',
  owner: '',
};
/* price, emoji. Names come from the translation table (p0..p3). */
const PRESETS = [
  [6, '🍊'],
  [8, '🍹'],
  [10, '🥑'],
  [2, '🍧'],
];
/* amount, emoji, field it adds to. Names come from c0..c2. */
const COSTS = [
  [100, '🍎', 'ingr'],
  [30, '🧊', 'ingr'],
  [20, '🎪', 'rent'],
];

/* ================= voice parsing ================= */
/*PV-START*/
const NUMW = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  lapan: 8,
  sembilan: 9,
  sepuluh: 10,
};
const ZHN = {
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
};
const FRUITS = [
  'watermelon',
  'pineapple',
  'oranges?',
  'bananas?',
  'apples?',
  'mango',
  'papaya',
  'guava',
  'lemon',
  'carrot',
  'epal',
  'oren',
  'pisang',
  'tembikai',
  'nanas',
  'mangga',
  'betik',
  'jambu',
  '苹果',
  '橙',
  '香蕉',
  '西瓜',
  '菠萝',
  '凤梨',
  '芒果',
  '木瓜',
  '番石榴',
  '柠檬',
  '红萝卜',
];
const MIXW = ['mixed', 'mixes', 'mix', 'makes', 'campur', '混合', '参参'];
const SPECW = [
  'special',
  'spesial',
  'istimewa',
  'avocado',
  'alpukat',
  '特调',
  '特制',
  '特别',
  '牛油果',
];
const ADDW = ['add.?on', 'extra', 'tambah', '加料'];
const rxOf = (l, f = '') => new RegExp(l.join('|'), f);
const parseVoice = (raw) => {
  let s = raw
    .toLowerCase()
    .replace(
      new RegExp(`\\b(${Object.keys(NUMW).join('|')})\\b`, 'g'),
      (m) => NUMW[m]
    )
    .replace(/[一二两三四五六七八九十]/g, (c) => ZHN[c]);
  /* explicit money amounts: "RM 8", "15 ringgit" */
  let amt = 0;
  s = s.replace(
    /(?:rm|myr)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:ringgit|rm|myr|dollars?|bucks?|块|令吉|元)/g,
    (m, a, b) => {
      amt += Number(a || b);
      return ' ';
    }
  );
  /* "2 fruits" / "dua buah" means a mix of fruits, not a quantity */
  s = s.replace(/\d+\s*(?:fruits?|buah|种水果|种)/g, ' mix ');
  const fr = rxOf(FRUITS, 'g'),
    mx = rxOf(MIXW),
    sp = rxOf(SPECW),
    ad = rxOf(ADDW);
  const nums = [...s.matchAll(/\d+/g)].map((m) => m.index);
  const segs = [];
  if (!nums.length) segs.push([1, s]);
  else {
    if (nums[0] > 0) segs.push([1, s.slice(0, nums[0])]);
    nums.forEach((i, k) => {
      const q = Number(s.slice(i).match(/\d+/)[0]);
      segs.push([q, s.slice(i, nums[k + 1] ?? s.length)]);
    });
  }
  const parts = [];
  let total = 0;
  segs.forEach(([q0, seg]) => {
    const q = Math.min(99, Math.max(1, q0));
    const fruits = new Set(
      (seg.match(fr) || []).map((x) => x.replace(/s$/, ''))
    );
    let idx = -1;
    if (sp.test(seg)) idx = 2;
    else if (ad.test(seg)) idx = 3;
    else if (mx.test(seg) || fruits.size >= 2) idx = 1;
    else if (fruits.size === 1) idx = 0;
    if (idx < 0) return;
    parts.push([q, idx]);
    total += q * PRESETS[idx][0];
  });
  if (parts.length) return { amt: total, parts };
  if (amt > 0) return { amt, parts: [] };
  const n = s.match(/\d+(?:\.\d+)?/);
  return n ? { amt: Number(n[0]), parts: [] } : null;
};
/*PV-END*/

/* ================= sample data ================= */
const sample = () => {
  const days = {},
    buys = [];
  for (let i = 13; i >= 0; i--) {
    const s = 420 + ((i * 57) % 180) + (i % 7 === 0 ? 150 : 0);
    days[ago(i)] = {
      sales: s,
      ingr: Math.round(s * 0.38),
      rent: 30,
      taps: [],
      costs: [],
    };
  }
  [
    [13, 85.0],
    [6, 92.0],
    [0, 98.0],
  ].forEach(([i, p], k) =>
    buys.push({
      id: k,
      item: 'Fresh Fruits / Orange (30kg)',
      price: p,
      d: ago(i),
    })
  );
  [
    [10, 22.0],
    [2, 25.5],
  ].forEach(([i, p], k) =>
    buys.push({
      id: 10 + k,
      item: 'Plastic Cups & Straws (500s)',
      price: p,
      d: ago(i),
    })
  );
  return { ...EMPTY, days, buys, fixed: 1800, cash: 800 };
};

const eff = (p, a) => {
  if (p.tenorRates) return p.tenorRates[0][1];
  let lo = 0,
    sum = 0;
  for (const [hi, r] of p.tiers) {
    const h = hi ?? Infinity;
    sum += Math.max(0, Math.min(a, h) - lo) * r;
    lo = h;
  }
  return sum / a;
};

/* ================= UI pieces (same sizes as Phase 1) ================= */
const Glass = ({ className = '', children }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-[#0B1726]/80 p-4 backdrop-blur sm:p-5 ${className}`}
  >
    {children}
  </div>
);
const Sec = ({ title, hint, children }) => (
  <Glass>
    <h3 className="font-semibold text-white">{title}</h3>
    {hint && <p className="mb-3 mt-0.5 text-xs text-slate-400">{hint}</p>}
    <div className={hint ? '' : 'mt-3'}>{children}</div>
  </Glass>
);
const Inp = (p) => (
  <input
    {...p}
    className={`w-full rounded-lg border border-white/10 bg-[#040812] px-3 py-2 text-white outline-none focus:border-cyan-300 ${
      p.className || ''
    }`}
  />
);
const Big = ({ label, value, color = 'text-cyan-200' }) => (
  <div className="rounded-xl bg-[#040812] p-3">
    <div className="text-xs text-slate-400">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </div>
);
const Btn = ({ className = '', ...p }) => (
  <button
    {...p}
    className={`flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5 ${className}`}
  />
);
const Cta = ({ className = '', ...p }) => (
  <button
    {...p}
    className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 px-3 py-2.5 text-sm font-bold text-[#040812] hover:brightness-110 ${className}`}
  />
);
const num = (f) => (e) => f(Math.max(0, Number(e.target.value) || 0));

/* ================= main component ================= */
export default function VendorApp({
  currentMode = 'vendor',
  onSwitchMode,
  lang = 'en',
  onLang,
}) {
  const t = (k, v) => tr(lang, k, v);
  const [data, setData] = useState(() => {
    try {
      return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
    } catch {
      return EMPTY;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState('');
  const [buy, setBuy] = useState({ item: '', price: '' });
  const [wet, setWet] = useState(false);
  const [rainy, setRainy] = useState(6);
  const [drop, setDrop] = useState(30);
  const [view, setView] = useState('30');
  const [showPL, setShowPL] = useState(false);

  useEffect(() => {
    setMsg('');
  }, [tab]);

  const today = dkey();
  const td = { ...BLANK, ...(data.days[today] || {}) };
  const set = (x) => setData((d) => ({ ...d, ...x }));

  const patchDay = (x) =>
    setData((d) => ({
      ...d,
      days: {
        ...d.days,
        [today]: { ...BLANK, ...(d.days[today] || {}), ...x },
      },
    }));
  const add = (amt) =>
    setData((d) => {
      const x = { ...BLANK, ...(d.days[today] || {}) };
      return {
        ...d,
        days: {
          ...d.days,
          [today]: {
            ...x,
            sales: +(x.sales + amt).toFixed(2),
            taps: [...x.taps, amt],
          },
        },
      };
    });
  const undo = () =>
    setData((d) => {
      const x = { ...BLANK, ...(d.days[today] || {}) };
      if (!x.taps.length) return d;
      const last = x.taps[x.taps.length - 1];
      return {
        ...d,
        days: {
          ...d.days,
          [today]: {
            ...x,
            sales: Math.max(0, +(x.sales - last).toFixed(2)),
            taps: x.taps.slice(0, -1),
          },
        },
      };
    });
  const addCost = (kind, amt) =>
    setData((d) => {
      const x = { ...BLANK, ...(d.days[today] || {}) };
      return {
        ...d,
        days: {
          ...d.days,
          [today]: {
            ...x,
            [kind]: +((x[kind] || 0) + amt).toFixed(2),
            costs: [...x.costs, [kind, amt]],
          },
        },
      };
    });
  const undoCost = () =>
    setData((d) => {
      const x = { ...BLANK, ...(d.days[today] || {}) };
      if (!x.costs.length) return d;
      const [k, a] = x.costs[x.costs.length - 1];
      return {
        ...d,
        days: {
          ...d.days,
          [today]: {
            ...x,
            [k]: Math.max(0, +((x[k] || 0) - a).toFixed(2)),
            costs: x.costs.slice(0, -1),
          },
        },
      };
    });

  /* voice follows the app language */
  const voiceLog = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setMsg(t('vNoSupport'));
    const r = new SR();
    r.lang = VOICE_LANG[lang] || 'en-MY';
    r.interimResults = false;
    r.onresult = (e) => {
      const raw = e.results[0][0].transcript,
        res = parseVoice(raw);
      if (!res) return setMsg(t('vNone', { raw }));
      add(res.amt);
      const items = res.parts.length
        ? res.parts.map(([q, i]) => `${q} x ${t('p' + i)}`).join(' + ')
        : 'RM';
      setMsg(t('vHeard', { raw, items, amt: fmt(res.amt) }));
    };
    r.onerror = () => setMsg(t('vErr'));
    r.start();
    setMsg(t('listening'));
  };
  const simulate = () => {
    const a = 6 + Math.floor(Math.random() * 12);
    add(a);
    setMsg(t('simMsg', { a }));
  };
  const backup = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `finscope-vendor-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ----- stats from the last 30 days of real records ----- */
  const st = useMemo(() => {
    const cut = ago(29);
    const rec = Object.entries(data.days).filter(
      ([d, x]) => d >= cut && (x.sales > 0 || x.ingr > 0 || x.rent > 0)
    );
    const n = rec.length,
      sum = (k) => rec.reduce((s, [, x]) => s + (x[k] || 0), 0);
    const S = n ? sum('sales') / n : 0,
      I = n ? sum('ingr') / n : 0,
      R = n ? sum('rent') / n : 0;
    const ds = rec.map(([d]) => d).sort();
    return {
      n,
      S,
      I,
      R,
      net30: sum('sales') - sum('ingr') - sum('rent'),
      costDays: rec.filter(([, x]) => x.ingr > 0).length,
      avgNet: S - I - R,
      from: ds[0] || '',
      to: ds[ds.length - 1] || '',
    };
  }, [data.days]);

  const dailyFixed = data.fixed / 30;
  const bufTarget = dailyFixed * data.closeDays;
  const bufGap = Math.max(0, bufTarget - data.cash);
  const setAside = bufGap / 90;

  /* ----- supplier price changes ----- */
  const spikes = useMemo(() => {
    const g = {};
    [...data.buys]
      .sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : a.id - b.id))
      .forEach((b) => {
        const k = b.item.trim().toLowerCase();
        (g[k] = g[k] || { name: b.item.trim(), list: [] }).list.push(b);
      });
    return Object.values(g)
      .filter((x) => x.list.length >= 2)
      .map((x) => {
        const l = x.list,
          cur = l[l.length - 1],
          prev = l[l.length - 2];
        return {
          name: x.name,
          cur: cur.price,
          prev: prev.price,
          pct: ((cur.price - prev.price) / prev.price) * 100,
        };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [data.buys]);

  /* ----- cash projections ----- */
  const proj = useMemo(() => {
    if (!st.n) return null;
    const ratio = st.S > 0 ? st.I / st.S : 0,
      openFrac = data.opWeek / 7;
    const prof = (m) => st.S * m * (1 - ratio) - st.R;
    const rn = wet ? rainy : 0,
      mult = 1 - drop / 100,
      nowM = new Date().getMonth();
    let b = data.cash,
      s = data.cash;
    const d30 = [{ x: 0, base: Math.round(b), plan: Math.round(s) }];
    for (let d = 1; d <= 30; d++) {
      const open = Math.floor(d * openFrac) > Math.floor((d - 1) * openFrac);
      const closed =
        Math.floor((d * rn) / 30) > Math.floor(((d - 1) * rn) / 30);
      b += (open ? prof(1) : 0) - dailyFixed;
      s +=
        (open && !closed ? prof(wet && SLOW.includes(nowM) ? mult : 1) : 0) -
        dailyFixed;
      d30.push({ x: d, base: Math.round(b), plan: Math.round(s) });
    }
    b = data.cash;
    s = data.cash;
    const m12 = [{ x: 'Now', base: Math.round(b), plan: Math.round(s) }];
    for (let m = 0; m < 12; m++) {
      const idx = (nowM + m) % 12,
        ob = (data.opWeek * 52) / 12;
      const op = Math.max(0, ob - rn * openFrac),
        slow = wet && SLOW.includes(idx);
      b += ob * prof(1) - data.fixed;
      s += op * prof(slow ? mult : 1) - data.fixed;
      m12.push({ x: MN[idx], base: Math.round(b), plan: Math.round(s) });
    }
    const rows = view === '30' ? d30 : m12,
      last = rows[rows.length - 1];
    return {
      rows,
      lowBase: Math.min(...rows.map((r) => r.base)),
      lowPlan: Math.min(...rows.map((r) => r.plan)),
      endBase: last.base,
      endPlan: last.plan,
    };
  }, [st, data, wet, rainy, drop, view, dailyFixed]);
  const lowest = proj
    ? wet
      ? Math.min(proj.lowPlan, proj.lowBase)
      : proj.lowBase
    : 0;

  /* ----- extra cash advice ----- */
  const surplus = st.net30 - data.fixed;
  const toBuf = Math.min(Math.max(0, surplus), bufGap);
  const rest = Math.max(0, surplus - toBuf);
  const stock = rest * 0.3,
    park = rest - stock;

  /* ----- readiness checklist ----- */
  const checks = [
    [t('ck1'), st.n >= 20],
    [t('ck2'), st.n > 0 && st.avgNet > 0],
    [t('ck3'), st.n > 0 && st.costDays / st.n >= 0.8],
    [t('ck4'), data.fixed > 0 && data.cash >= dailyFixed * 7],
  ];
  const manual = [
    ['ssm', t('m1')],
    ['acct', t('m2')],
  ];
  const passed =
    checks.filter((c) => c[1]).length + manual.filter(([k]) => data[k]).length;
  const total = checks.length + manual.length,
    score = Math.round((passed / total) * 100);

  /* ----- where to keep the buffer ----- */
  const amt = Math.max(1000, data.cash || bufTarget);
  const picks = useMemo(
    () =>
      DATA.products
        .filter(
          (p) =>
            !p.bumiOnly &&
            !p.tenorRates &&
            !p.badges.includes('Lock-in') &&
            !p.badges.includes('Limited withdrawals') &&
            (p.badges.includes('Instant Liquidity') || p.badges.includes('T+1'))
        )
        .map((p) => [p, eff(p, amt)])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    [amt]
  );

  const net = td.sales - td.ingr - td.rent;
  const tabs = [
    ['💵', t('tab1')],
    ['📈', t('tab2')],
    ['🔮', t('tab3')],
  ];

  return (
    <div
      className="min-h-screen bg-[#040812] text-slate-100"
      style={{ fontFamily: "ui-sans-serif, system-ui, 'Segoe UI', sans-serif" }}
    >
      {showPL && (
        <PLModal
          stats={st}
          biz={data.biz}
          owner={data.owner}
          onField={(x) => set(x)}
          onClose={() => setShowPL(false)}
          t={t}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040812]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-2">
            <span className="text-xl font-extrabold text-white">
              Fin<span className="text-cyan-300">Scope</span>
            </span>
            <span className="ml-2 rounded bg-cyan-400/10 px-1.5 py-0.5 text-[11px] text-cyan-200">
              Vendor
            </span>
          </div>
          <nav
            className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto"
            aria-label="Main"
          >
            {tabs.map(([e, l], i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                aria-current={tab === i}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  tab === i
                    ? 'bg-cyan-400/15 text-cyan-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {e} {l}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div
              className="flex items-center rounded-xl border border-white/15 bg-[#0B1726] p-1 text-xs"
              role="group"
              aria-label={t('lang')}
            >
              {[
                ['en', 'EN'],
                ['ms', 'BM'],
                ['zh', '中文'],
              ].map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={lang === k}
                  onClick={() => onLang && onLang(k)}
                  className={`w-10 rounded-lg px-1 py-1.5 text-center font-bold transition ${
                    lang === k
                      ? 'bg-cyan-400 text-[#040812] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <ModeSwitch currentMode={currentMode} onSwitchMode={onSwitchMode} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock size={13} /> {t('privacy')}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Btn onClick={backup}>
              <Download size={14} /> {t('backup')}
            </Btn>
            <Btn onClick={() => setData(sample())}>{t('sample')}</Btn>
            <Btn
              onClick={() =>
                window.confirm(t('confirmClear')) && setData(EMPTY)
              }
            >
              {t('clear')}
            </Btn>
          </div>
        </div>

        {/* ===== TAB 1 ===== */}
        {tab === 0 && (
          <div className="space-y-5">
            <Sec title={t('sellTitle')} hint={t('sellHint')}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRESETS.map(([p, e], i) => (
                  <button
                    key={i}
                    onClick={() => add(p)}
                    className="flex flex-col items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-400/5 py-4 transition hover:bg-cyan-400/10 active:scale-95"
                  >
                    <span className="text-2xl">{e}</span>
                    <span className="px-1 text-center text-sm font-medium text-white">
                      {t('p' + i)}
                    </span>
                    <span className="text-sm font-bold text-cyan-300">
                      RM {p}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OtherAmount
                  onAdd={add}
                  ph={t('otherRm')}
                  label={t('addSale')}
                />
                <Btn onClick={undo}>
                  <Undo2 size={15} /> {t('undoSale')}
                </Btn>
              </div>
            </Sec>

            <Sec title={t('costTitle')} hint={t('costHint')}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {COSTS.map(([p, e, k], i) => (
                  <button
                    key={i}
                    onClick={() => addCost(k, p)}
                    className="flex items-center justify-between rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 transition hover:bg-amber-400/10 active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{e}</span>
                      <span className="text-left text-sm font-medium text-white">
                        {t('c' + i)}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-amber-300">
                      -RM {p}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OtherAmount
                  onAdd={(v) => addCost('ingr', v)}
                  ph={t('otherRm')}
                  label={t('addCost')}
                  cost
                />
                <Btn onClick={undoCost}>
                  <Undo2 size={15} /> {t('undoCost')}
                </Btn>
              </div>
            </Sec>

            <Glass className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300">
                  <Radio size={15} /> {t('simBadge')}
                </span>
                <Btn onClick={simulate}>{t('simBtn')}</Btn>
                <Cta onClick={voiceLog} className="!px-4">
                  <Mic size={16} /> {t('voiceBtn')}
                </Cta>
                <Btn onClick={() => setShowPL(true)} className="ml-auto">
                  <FileText size={15} /> {t('plBtn')}
                </Btn>
              </div>
              {msg && (
                <p
                  className="rounded-lg bg-[#040812] p-3 text-sm text-cyan-200"
                  role="status"
                >
                  {msg}
                </p>
              )}
            </Glass>

            <Sec title={t('todayTitle')}>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm text-slate-300">
                  {t('totalSales')}
                  <Inp
                    className="mt-1"
                    type="number"
                    value={td.sales || ''}
                    placeholder="0"
                    onChange={num((v) => patchDay({ sales: v }))}
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  {t('ingr')}
                  <Inp
                    className="mt-1"
                    type="number"
                    value={td.ingr || ''}
                    placeholder="0"
                    onChange={num((v) => patchDay({ ingr: v }))}
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  {t('rent')}
                  <Inp
                    className="mt-1"
                    type="number"
                    value={td.rent || ''}
                    placeholder="0"
                    onChange={num((v) => patchDay({ rent: v }))}
                  />
                </label>
              </div>
            </Sec>

            <Sec title={t('snapTitle')}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Big
                  label={t('snapSales')}
                  value={`RM ${fmt(td.sales)}`}
                  color="text-cyan-300"
                />
                <Big
                  label={t('snapCosts')}
                  value={`RM ${fmt(td.ingr + td.rent)}`}
                  color="text-amber-300"
                />
                <Big
                  label={t('snapNet')}
                  value={`RM ${fmt(net)}`}
                  color={net < 0 ? 'text-red-400' : 'text-emerald-300'}
                />
              </div>
              <p className="mt-3 text-[11px] text-slate-500">{t('saved')}</p>
            </Sec>
          </div>
        )}

        {/* ===== TAB 2 ===== */}
        {tab === 1 && (
          <div className="space-y-5">
            <Sec title={t('alertTitle')} hint={t('alertHint')}>
              <div className="flex flex-wrap gap-2">
                <Inp
                  className="min-w-[10rem] flex-1"
                  placeholder={t('itemPh')}
                  aria-label={t('itemPh')}
                  value={buy.item}
                  onChange={(e) => setBuy({ ...buy, item: e.target.value })}
                />
                <Inp
                  className="!w-32"
                  type="number"
                  placeholder={t('pricePh')}
                  aria-label={t('pricePh')}
                  value={buy.price}
                  onChange={(e) => setBuy({ ...buy, price: e.target.value })}
                />
                <Cta
                  onClick={() => {
                    const p = Number(buy.price);
                    if (!buy.item.trim() || !(p > 0))
                      return setMsg(t('needItem'));
                    set({
                      buys: [
                        ...data.buys,
                        { id: Date.now(), item: buy.item, price: p, d: today },
                      ],
                    });
                    setBuy({ item: '', price: '' });
                    setMsg('');
                  }}
                  className="!px-4"
                >
                  <Plus size={15} /> {t('add')}
                </Cta>
              </div>
              {msg && <p className="mt-2 text-sm text-amber-300">{msg}</p>}
              <div className="mt-4 space-y-2">
                {spikes.length === 0 && (
                  <p className="text-sm text-slate-300">{t('noSpikes')}</p>
                )}
                {spikes.map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-xl p-3 ${
                      s.pct >= 10
                        ? 'border border-amber-400/40 bg-amber-400/10'
                        : 'bg-[#040812]'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="font-semibold text-white">
                        {s.pct >= 10 && (
                          <AlertTriangle
                            size={15}
                            className="mr-1.5 inline text-amber-300"
                          />
                        )}
                        {s.name}
                      </span>
                      <span
                        className={
                          s.pct >= 10
                            ? 'font-bold text-amber-300'
                            : s.pct > 0
                            ? 'text-amber-200'
                            : 'text-emerald-300'
                        }
                      >
                        RM {fmt(s.prev)} {t('to')} RM {fmt(s.cur)} (
                        {s.pct >= 0 ? '+' : ''}
                        {s.pct.toFixed(1)}%)
                      </span>
                    </div>
                    {s.pct >= 10 && (
                      <p className="mt-1 text-xs text-amber-100/90">
                        {t('spikeAdvice', { p: s.pct.toFixed(0) })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Sec>

            <Sec title={t('extraTitle')} hint={t('extraHint')}>
              {!st.n ? (
                <p className="text-sm text-slate-300">{t('logFirst')}</p>
              ) : data.fixed <= 0 ? (
                <p className="text-sm text-amber-300">{t('needFixed')}</p>
              ) : surplus <= 0 ? (
                <p className="text-sm text-amber-300">
                  {t('notCover', { a: fmt(st.net30), b: fmt(data.fixed) })}
                </p>
              ) : (
                <div className="space-y-2 text-sm text-slate-200">
                  <p>
                    {t('extraThis')}{' '}
                    <b className="text-emerald-300">RM {fmt(surplus)}</b>
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    {toBuf > 0 && (
                      <li>{t('toBuf', { a: fmt(toBuf), b: fmt(bufGap) })}</li>
                    )}
                    {stock > 0 && <li>{t('stockLine', { a: fmt(stock) })}</li>}
                    {park > 0 && <li>{t('parkLine', { a: fmt(park) })}</li>}
                  </ul>
                  <p className="text-xs text-slate-500">{t('rule')}</p>
                </div>
              )}
            </Sec>

            <Sec title={t('readyTitle')} hint={t('readyHint')}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">{t('progress')}</span>
                <span className="font-bold text-emerald-300">
                  {t('progVal', { a: passed, b: total, c: score })}
                </span>
              </div>
              <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${score}%` }}
                />
              </div>
              <ul className="space-y-2 text-sm text-slate-200">
                {checks.map(([l, ok]) => (
                  <li key={l} className="flex items-center gap-2">
                    {ok ? (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-emerald-400"
                      />
                    ) : (
                      <Circle size={18} className="shrink-0 text-slate-500" />
                    )}
                    {l}
                  </li>
                ))}
                {manual.map(([k, l]) => (
                  <li key={k}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!data[k]}
                        onChange={(e) => set({ [k]: e.target.checked })}
                        className="accent-emerald-400"
                      />
                      {l}
                    </label>
                  </li>
                ))}
              </ul>
            </Sec>
          </div>
        )}

        {/* ===== TAB 3 ===== */}
        {tab === 2 && (
          <div className="space-y-5">
            <Sec title={t('myNums')}>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm text-slate-300">
                  {t('fixedLbl')}
                  <Inp
                    className="mt-1"
                    type="number"
                    value={data.fixed || ''}
                    placeholder={t('fixedPh')}
                    onChange={num((v) => set({ fixed: v }))}
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  {t('cashLbl')}
                  <Inp
                    className="mt-1"
                    type="number"
                    value={data.cash || ''}
                    placeholder="0"
                    onChange={num((v) => set({ cash: v }))}
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  {t('daysOpen')}
                  <Inp
                    className="mt-1"
                    type="number"
                    min={1}
                    max={7}
                    value={data.opWeek}
                    onChange={(e) =>
                      set({
                        opWeek: Math.min(
                          7,
                          Math.max(1, Number(e.target.value) || 1)
                        ),
                      })
                    }
                  />
                </label>
              </div>
            </Sec>

            <Glass>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-white">{t('projTitle')}</h3>
                <div className="inline-flex rounded-lg border border-white/10 p-0.5 text-sm">
                  {[
                    ['30', t('d30')],
                    ['12', t('m12')],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`rounded-md px-3 py-1 ${
                        view === v
                          ? 'bg-cyan-400 font-semibold text-[#040812]'
                          : 'text-slate-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={wet}
                    onChange={(e) => setWet(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <CloudRain size={16} className="text-cyan-300" />{' '}
                  {t('wetLbl')}
                </label>
              </div>

              {wet && (
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    {t('rainyLbl', { n: rainy })}
                    <input
                      type="range"
                      min={0}
                      max={15}
                      value={rainy}
                      onChange={(e) => setRainy(Number(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    {t('dropLbl', { n: drop })}
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={5}
                      value={drop}
                      onChange={(e) => setDrop(Number(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </label>
                </div>
              )}

              {!proj ? (
                <p className="text-sm text-slate-300">{t('noProj')}</p>
              ) : (
                <>
                  <div
                    className="h-72 w-full"
                    role="img"
                    aria-label={t('chartAria')}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={proj.rows}
                        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid stroke="#ffffff12" vertical={false} />
                        <XAxis
                          dataKey="x"
                          stroke="#64748b"
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          stroke="#64748b"
                          tick={{ fontSize: 11 }}
                          width={64}
                          tickFormatter={(v) => `RM${v}`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#0B1726',
                            border: '1px solid #ffffff20',
                            borderRadius: 12,
                          }}
                          formatter={(v, n) => [`RM ${fmt(v)}`, n]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          name={t('normal')}
                          dataKey="base"
                          stroke="#00F2FE"
                          fill="#00F2FE"
                          fillOpacity={0.15}
                          strokeWidth={2.5}
                        />
                        {wet && (
                          <Area
                            type="monotone"
                            name={t('scen')}
                            dataKey="plan"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.15}
                            strokeWidth={2.5}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Big
                      label={wet ? t('lowestWet') : t('lowest')}
                      value={`RM ${fmt(lowest)}`}
                      color={lowest < 0 ? 'text-red-400' : 'text-emerald-300'}
                    />
                    <Big
                      label={wet ? t('endCashWet') : t('endCash')}
                      value={`RM ${fmt(wet ? proj.endPlan : proj.endBase)}`}
                      color="text-cyan-300"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {t('basis', { n: st.n, s: fmt(st.S), c: fmt(st.I + st.R) })}
                  </p>
                </>
              )}
            </Glass>

            <Sec title={t('bufTitle')}>
              {data.fixed <= 0 ? (
                <p className="text-sm text-amber-300">{t('bufNeedFixed')}</p>
              ) : (
                <>
                  <label className="mb-3 block text-sm text-slate-300">
                    {t('closeLbl', { n: data.closeDays })}
                    <input
                      type="range"
                      min={3}
                      max={30}
                      value={data.closeDays}
                      onChange={(e) =>
                        set({ closeDays: Number(e.target.value) })
                      }
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Big
                      label={t('bufNeeded')}
                      value={`RM ${fmt(bufTarget)}`}
                      color="text-cyan-300"
                    />
                    <Big
                      label={t('bufStill')}
                      value={`RM ${fmt(bufGap)}`}
                      color="text-amber-300"
                    />
                    <Big
                      label={t('bufPerDay')}
                      value={`RM ${fmt(setAside)}`}
                      color="text-emerald-300"
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {bufGap > 0
                      ? t('bufMsg', { a: fmt(setAside), n: data.closeDays })
                      : t('bufOk', { n: data.closeDays })}
                  </p>
                </>
              )}
            </Sec>

            <Sec
              title={t('keepTitle')}
              hint={t('keepHint', { a: amt.toLocaleString() })}
            >
              <div className="space-y-2">
                {picks.map(([p, e]) => (
                  <div key={p.id} className="rounded-xl bg-[#040812] p-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="text-sm font-semibold text-cyan-200">
                        {p.name}{' '}
                        <span className="font-normal text-slate-300">
                          · {p.bank}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-cyan-300">
                        {t('perYear', {
                          r: e.toFixed(2),
                          m: fmt((amt * e) / 1200),
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {p.badges.includes('Instant Liquidity')
                        ? t('anytime')
                        : t('oneDay')}
                      {' · '}
                      {p.badges.includes('PIDM Protected')
                        ? t('pidm')
                        : t('noPidm')}
                      {' · '}
                      {p.verified || t('demoRate')}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                {t('notAdvice')}
              </p>
            </Sec>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= subcomponents ================= */
function OtherAmount({ onAdd, ph, label, cost = false }) {
  const [v, setV] = useState('');
  const Icon = cost ? Minus : Plus;
  return (
    <div className="flex items-center gap-2">
      <Inp
        className="!w-32"
        type="number"
        placeholder={ph}
        aria-label={ph}
        value={v}
        onChange={(e) => setV(e.target.value)}
      />
      <Btn
        className={
          cost
            ? 'border-amber-400/40 text-amber-200'
            : 'border-cyan-400/40 text-cyan-200'
        }
        onClick={() => {
          const n = Number(v);
          if (n > 0) {
            onAdd(n);
            setV('');
          }
        }}
      >
        <Icon size={15} /> {label}
      </Btn>
    </div>
  );
}

/* Formal statement. Used for both the on-screen preview and the print copy. */
function PLDoc({ stats, biz, owner, t }) {
  const sales = stats.S * stats.n,
    cogs = stats.I * stats.n,
    rent = stats.R * stats.n;
  const gross = sales - cogs,
    np = gross - rent;
  const margin = sales > 0 ? ((np / sales) * 100).toFixed(1) : '0.0';
  const money = (v) => (v < 0 ? `(RM ${fmt(-v)})` : `RM ${fmt(v)}`);
  const cell = { padding: '7px 0' };
  const R = ({ l, v, indent, bold, top, dbl }) => (
    <tr
      style={{
        borderTop: top ? '1.5px solid #000' : 'none',
        borderBottom: dbl ? '3px double #000' : 'none',
      }}
    >
      <td
        style={{
          ...cell,
          paddingLeft: indent ? 22 : 0,
          fontWeight: bold ? 700 : 400,
        }}
      >
        {l}
      </td>
      <td
        style={{
          ...cell,
          textAlign: 'right',
          fontWeight: bold ? 700 : 400,
          whiteSpace: 'nowrap',
        }}
      >
        {v}
      </td>
    </tr>
  );
  const line = {
    borderBottom: '1px solid #000',
    minHeight: 22,
    padding: '2px 0',
  };
  return (
    <div
      style={{
        background: '#fff',
        color: '#000',
        fontFamily: 'Georgia, "Times New Roman", serif',
        padding: 28,
        fontSize: 13,
        lineHeight: 1.45,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          borderBottom: '2px solid #000',
          paddingBottom: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>
          {biz || '____________________'}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {t('plTitle')}
        </div>
        <div style={{ marginTop: 4 }}>
          {stats.n > 0
            ? `${t('plPeriod')}: ${dmy(stats.from)} - ${dmy(stats.to)} (${t(
                'plDays',
                { n: stats.n }
              )})`
            : t('plNoRec')}
        </div>
        <div style={{ fontStyle: 'italic', marginTop: 2 }}>
          ({t('unaudited')})
        </div>
      </div>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14 }}
      >
        <tbody>
          <R l={t('plRev')} v={money(sales)} bold />
          <R l={t('plCogs')} v={`(RM ${fmt(cogs)})`} indent />
          <R l={t('plGross')} v={money(gross)} bold top />
          <R l={t('plOpex')} v="" indent />
          <R l={t('plRentLine')} v={`(RM ${fmt(rent)})`} indent />
          <R l={t('plNet')} v={money(np)} bold top dbl />
        </tbody>
      </table>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 10,
          fontSize: 12,
        }}
      >
        <tbody>
          <R l={t('plMargin')} v={`${margin}%`} />
          <R l={t('plAvg')} v={`RM ${fmt(stats.S)}`} />
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700 }}>{t('plNotes')}</div>
        <ol style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 12 }}>
          <li>{t('plNote1')}</li>
          <li>{t('plNote2')}</li>
          <li>{t('plNote3')}</li>
        </ol>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 36 }}>
        <div style={{ flex: 2 }}>
          <div style={line}>{owner || ''}</div>
          <div style={{ fontSize: 11 }}>{t('plSignOwner')}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={line}>{dmy(dkey())}</div>
          <div style={{ fontSize: 11 }}>{t('plPrepared')}</div>
        </div>
      </div>
    </div>
  );
}

function PLModal({ stats, biz, owner, onField, onClose, t }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <>
      <style>{`#pl-print-root{display:none}@media print{@page{size:A4;margin:14mm}body>*:not(#pl-print-root){display:none!important}#pl-print-root{display:block!important}}`}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-label={t('plTitle')}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col gap-3 overflow-y-auto rounded-2xl border border-cyan-400/20 bg-[#0B1726] p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{t('plTitle')}</h3>
            <button
              onClick={onClose}
              aria-label={t('close')}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              {t('plBiz')}
              <Inp
                className="mt-1"
                value={biz}
                onChange={(e) => onField({ biz: e.target.value })}
              />
            </label>
            <label className="block text-sm text-slate-300">
              {t('plOwner')}
              <Inp
                className="mt-1"
                value={owner}
                onChange={(e) => onField({ owner: e.target.value })}
              />
            </label>
          </div>
          <div className="overflow-hidden rounded-lg">
            <PLDoc stats={stats} biz={biz} owner={owner} t={t} />
          </div>
          <div className="flex gap-3">
            <Cta onClick={() => window.print()} className="flex-1">
              <Printer size={16} /> {t('plPrint')}
            </Cta>
            <Btn onClick={onClose}>{t('close')}</Btn>
          </div>
        </div>
      </div>
      {createPortal(
        <div id="pl-print-root">
          <PLDoc stats={stats} biz={biz} owner={owner} t={t} />
        </div>,
        document.body
      )}
    </>
  );
}
