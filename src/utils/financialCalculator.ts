/**
 * Finansal Envanter Analiz ve İstatistik Hesaplayıcı
 * Toplam maddi değer, ortalama değer, son 1 yıl harcamaları,
 * en pahalı ürünler ve kategori dağılımını hesaplar.
 */

import { differenceInDays } from 'date-fns';
import { Product } from '../types';
import { parseAnyDate, formatCurrency } from './warrantyCalculator';

export interface CategoryFinancialStat {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  totalCost: number;
  productCount: number;
  percentage: number;
}

export interface FinancialAnalyticsResult {
  totalValue: number;
  averageValue: number;
  lastYearTotal: number;
  pricedCount: number;
  unpricedCount: number;
  topExpensiveProducts: Array<{
    product: Product;
    percentageOfTotal: number;
  }>;
  categoryBreakdown: CategoryFinancialStat[];
}

/**
 * Ürün listesini analiz ederek detaylı finansal metrikleri döner
 */
export function calculateFinancialAnalytics(products: Product[]): FinancialAnalyticsResult {
  if (!products || products.length === 0) {
    return {
      totalValue: 0,
      averageValue: 0,
      lastYearTotal: 0,
      pricedCount: 0,
      unpricedCount: 0,
      topExpensiveProducts: [],
      categoryBreakdown: [],
    };
  }

  let totalValue = 0;
  let lastYearTotal = 0;
  let pricedCount = 0;
  let unpricedCount = 0;
  const now = new Date();

  // Kategori bazlı biriktirici
  const categoryMap = new Map<number, {
    name: string;
    icon: string;
    total: number;
    count: number;
  }>();

  // Fiyatı geçerli ürünler listesi (sıralama için)
  const pricedProducts: Product[] = [];

  for (const p of products) {
    const price = typeof p.purchase_price === 'number' && p.purchase_price > 0
      ? p.purchase_price
      : 0;

    if (price > 0) {
      totalValue += price;
      pricedCount += 1;
      pricedProducts.push(p);

      // Son 365 gün (1 yıl) harcaması
      if (p.purchase_date) {
        const purchaseDate = parseAnyDate(p.purchase_date);
        if (purchaseDate) {
          const diffDays = differenceInDays(now, purchaseDate);
          if (diffDays >= 0 && diffDays <= 365) {
            lastYearTotal += price;
          }
        }
      }
    } else {
      unpricedCount += 1;
    }

    // Kategori gruplama
    const catId = p.category_id || 10;
    const catName = p.category?.name || 'Diğer';
    const catIcon = p.category?.icon || 'package';

    const existingCat = categoryMap.get(catId) || {
      name: catName,
      icon: catIcon,
      total: 0,
      count: 0,
    };

    existingCat.total += price;
    existingCat.count += 1;
    categoryMap.set(catId, existingCat);
  }

  // Ortalama değer
  const averageValue = pricedCount > 0 ? Math.round(totalValue / pricedCount) : 0;

  // En yüksek değerli ilk 3 ürün
  pricedProducts.sort((a, b) => (b.purchase_price || 0) - (a.purchase_price || 0));
  const topExpensiveProducts = pricedProducts.slice(0, 3).map((product) => ({
    product,
    percentageOfTotal: totalValue > 0
      ? Math.round(((product.purchase_price || 0) / totalValue) * 100)
      : 0,
  }));

  // Kategori bazlı dağılım (tutara göre çoktan aza)
  const categoryBreakdown: CategoryFinancialStat[] = Array.from(categoryMap.entries())
    .map(([categoryId, data]) => ({
      categoryId,
      categoryName: data.name,
      categoryIcon: data.icon,
      totalCost: data.total,
      productCount: data.count,
      percentage: totalValue > 0 ? Math.round((data.total / totalValue) * 100) : 0,
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  return {
    totalValue,
    averageValue,
    lastYearTotal,
    pricedCount,
    unpricedCount,
    topExpensiveProducts,
    categoryBreakdown,
  };
}

/**
 * Sigorta ve Taşınma amacıyla eşyaların toplam değer döküm metnini üretir
 */
export function generateInsuranceReportText(
  products: Product[],
  analytics: FinancialAnalyticsResult
): string {
  const dateStr = new Date().toLocaleDateString('tr-TR');
  let report = `🛡️ EV ENVANTER & MADDİ DEĞER RAPORU\n`;
  report += `Oluşturulma Tarihi: ${dateStr}\n`;
  report += `-------------------------------------------\n`;
  report += `Toplam Envanter Serveti: ${formatCurrency(analytics.totalValue)}\n`;
  report += `Toplam Kayıtlı Eşya: ${products.length} adet (${analytics.pricedCount} fiyatlı)\n`;
  report += `Ortalama Eşya Değeri: ${formatCurrency(analytics.averageValue)}\n`;
  report += `Son 1 Yıl Harcaması: ${formatCurrency(analytics.lastYearTotal)}\n`;
  report += `-------------------------------------------\n\n`;

  report += `🏆 EN YÜKSEK DEĞERLİ CİHAZLAR:\n`;
  analytics.topExpensiveProducts.forEach((item, idx) => {
    report += `${idx + 1}. ${item.product.name} (${item.product.brand || 'Belirtilmemiş'})\n`;
    report += `   Değer: ${formatCurrency(item.product.purchase_price || 0)} (%${item.percentageOfTotal})\n`;
    report += `   Seri No: ${item.product.serial_number || 'Yok'}\n\n`;
  });

  report += `📊 KATEGORİ DAĞILIMI:\n`;
  analytics.categoryBreakdown.forEach((cat) => {
    if (cat.totalCost > 0) {
      report += `• ${cat.categoryName}: ${formatCurrency(cat.totalCost)} (%${cat.percentage} - ${cat.productCount} adet)\n`;
    }
  });

  report += `\nBu rapor Ev Envanter & Garanti Takip uygulaması tarafından sigorta ve taşınma beyanı için otomatik oluşturulmuştur.`;
  return report;
}

/**
 * Sigorta ve Taşınma amacıyla A4 formatında profesyonel yazdırılabilir HTML raporu üretir
 */
export function generateInsuranceReportHtml(
  products: Product[],
  analytics: FinancialAnalyticsResult
): string {
  const dateStr = new Date().toLocaleDateString('tr-TR');

  // En yüksek değerli ürünler satırları
  const topRows = analytics.topExpensiveProducts.map((item, idx) => `
    <tr>
      <td style="text-align: center; font-weight: 700; color: #4648d4;">#${idx + 1}</td>
      <td style="font-weight: 700; color: #0f172a;">${item.product.name}</td>
      <td>${[item.product.brand, item.product.model].filter(Boolean).join(' - ') || '—'}</td>
      <td><code>${item.product.serial_number || '—'}</code></td>
      <td style="text-align: center;">${item.product.purchase_date || '—'}</td>
      <td class="price">${formatCurrency(item.product.purchase_price || 0)}</td>
      <td style="text-align: right; font-weight: 600; color: #4648d4;">%${item.percentageOfTotal}</td>
    </tr>
  `).join('');

  // Kategori dökümü satırları
  const catRows = analytics.categoryBreakdown.filter((c) => c.totalCost > 0).map((cat) => `
    <tr>
      <td style="font-weight: 600; color: #0f172a;">${cat.categoryName}</td>
      <td style="text-align: center;">${cat.productCount} adet</td>
      <td class="price">${formatCurrency(cat.totalCost)}</td>
      <td style="text-align: right; font-weight: 700; color: #4648d4;">%${cat.percentage}</td>
    </tr>
  `).join('');

  // Tüm kayıtlı eşyalar satırları (Sigorta / Taşınma tam dökümü)
  const allProductsRows = products.map((prod, idx) => `
    <tr>
      <td style="text-align: center; color: #64748b;">${idx + 1}</td>
      <td style="font-weight: 600; color: #0f172a;">${prod.name}</td>
      <td>${prod.category?.name || 'Genel'}</td>
      <td>${[prod.brand, prod.model].filter(Boolean).join(' - ') || '—'}</td>
      <td><code>${prod.serial_number || '—'}</code></td>
      <td style="text-align: center;">${prod.purchase_date || '—'}</td>
      <td class="price">${prod.purchase_price ? formatCurrency(prod.purchase_price) : '—'}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ev Envanter ve Maddi Değer Raporu</title>
      <style>
        @page { size: A4; margin: 14mm 12mm; }
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 0;
          font-size: 11px;
          line-height: 1.4;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .summary-card { break-inside: avoid; }
          tr { break-inside: avoid; }
          .section-header { break-after: avoid; }
          .footer { break-inside: avoid; }
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2.5px solid #4648d4;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .brand-title {
          font-size: 20px;
          font-weight: 800;
          color: #4648d4;
          letter-spacing: -0.5px;
        }
        .report-type {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        .date-box {
          text-align: right;
          font-size: 11px;
          color: #475569;
        }
        .summary-grid {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
        }
        .summary-card {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .summary-card.highlight {
          background: #4648d4;
          color: #ffffff;
          border-color: #4648d4;
        }
        .summary-card.highlight .summary-label {
          color: rgba(255, 255, 255, 0.85);
        }
        .summary-card.highlight .summary-value {
          color: #ffffff;
        }
        .summary-label {
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .summary-value {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .section-header {
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 3px solid #4648d4;
          padding-left: 8px;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th {
          background: #f1f5f9;
          text-align: left;
          padding: 7px 9px;
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          border-bottom: 1.5px solid #cbd5e1;
        }
        td {
          padding: 7px 9px;
          border-bottom: 1px solid #f1f5f9;
        }
        tr:nth-child(even) td {
          background: #fbfcfe;
        }
        .price {
          font-weight: 700;
          color: #0f172a;
          text-align: right;
        }
        code {
          background: #f1f5f9;
          padding: 1px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 10px;
        }
        .footer {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 9.5px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signature-section {
          text-align: center;
          margin-top: 15px;
        }
        .signature-line {
          width: 160px;
          border-top: 1px solid #94a3b8;
          margin-top: 25px;
          padding-top: 4px;
          font-size: 9.5px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand-title">🛡️ Ev Envanter & Garanti Takip</div>
          <div class="report-type">Finansal Envanter & Sigorta Değer Beyan Raporu</div>
        </div>
        <div class="date-box">
          <div><strong>Rapor Tarihi:</strong> ${dateStr}</div>
          <div><strong>Belge No:</strong> ENV-${Date.now().toString().slice(-6)}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card highlight">
          <div class="summary-label">Toplam Envanter Değeri</div>
          <div class="summary-value">${formatCurrency(analytics.totalValue)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Kayıtlı Eşya Sayısı</div>
          <div class="summary-value">${products.length} adet</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Ortalama Eşya Değeri</div>
          <div class="summary-value">${formatCurrency(analytics.averageValue)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Son 1 Yıl Harcaması</div>
          <div class="summary-value">${formatCurrency(analytics.lastYearTotal)}</div>
        </div>
      </div>

      <div class="section-header">En Yüksek Değerli Eşyalar (Portföy Payı)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 35px; text-align: center;">Sıra</th>
            <th>Ürün Adı</th>
            <th>Marka / Model</th>
            <th>Seri Numarası</th>
            <th style="text-align: center;">Satın Alma</th>
            <th style="text-align: right;">Değer</th>
            <th style="text-align: right;">Pay</th>
          </tr>
        </thead>
        <tbody>
          ${topRows}
        </tbody>
      </table>

      <div class="section-header">Kategori Bazlı Bütçe & Harcama Dağılımı</div>
      <table>
        <thead>
          <tr>
            <th>Kategori Adı</th>
            <th style="text-align: center;">Eşya Adedi</th>
            <th style="text-align: right;">Toplam Tutar</th>
            <th style="text-align: right;">Oran (%)</th>
          </tr>
        </thead>
        <tbody>
          ${catRows}
        </tbody>
      </table>

      <div class="section-header">Tüm Kayıtlı Eşyalar & Maddi Değer Dökümü (${products.length} Eşya)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th>Eşya Adı</th>
            <th>Kategori</th>
            <th>Marka / Model</th>
            <th>Seri No</th>
            <th style="text-align: center;">Satın Alma</th>
            <th style="text-align: right;">Fiyat</th>
          </tr>
        </thead>
        <tbody>
          ${allProductsRows}
        </tbody>
      </table>

      <div class="footer">
        <div>
          <div>Bu belge Ev Envanter & Garanti Takip uygulaması üzerinden otomatik oluşturulmuştur.</div>
          <div>Konut sigortası, kasko veya nakliye / taşınma beyanlarında envanter dökümü olarak kullanılabilir.</div>
        </div>
        <div class="signature-section">
          <div class="signature-line">Beyan Eden / İmza</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const CATEGORY_CHART_COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export interface CategoryPieChartItem {
  categoryId: string;
  categoryName: string;
  value: number;
  color: string;
  focused?: boolean;
  productCount: number;
  totalCost: number;
  percentage: number;
  text?: string;
}

/**
 * Hem ürün adedine hem de harcama tutarına göre Donut/Pie Chart için veri hazırlar
 */
export function getCategoryChartData(
  products: Product[],
  mode: 'count' | 'value',
  selectedCategoryId?: string | null
): {
  chartData: CategoryPieChartItem[];
  totalValue: number;
  totalCount: number;
} {
  const map = new Map<string, {
    name: string;
    count: number;
    totalCost: number;
  }>();

  let grandTotalValue = 0;
  let grandTotalCount = products.length;

  products.forEach((p) => {
    const catId = p.category_id ? String(p.category_id) : 'other';
    const catName = p.category?.name || 'Genel / Diğer';
    const price = p.purchase_price || 0;

    grandTotalValue += price;

    const existing = map.get(catId) || {
      name: catName,
      count: 0,
      totalCost: 0,
    };

    existing.count += 1;
    existing.totalCost += price;
    map.set(catId, existing);
  });

  const rawItems = Array.from(map.entries()).map(([catId, data]) => {
    const isCountMode = mode === 'count';
    const val = isCountMode ? data.count : data.totalCost;
    const totalRef = isCountMode ? grandTotalCount : grandTotalValue;
    const percentage = totalRef > 0 ? Math.round((val / totalRef) * 100) : 0;

    return {
      categoryId: catId,
      categoryName: data.name,
      value: Math.max(0.01, val), // 0 olanlar grafikte çökmesin diye minik taban
      rawVal: val,
      productCount: data.count,
      totalCost: data.totalCost,
      percentage,
    };
  });

  // Değere göre çoktan aza sırala
  rawItems.sort((a, b) => b.rawVal - a.rawVal);

  const chartData: CategoryPieChartItem[] = rawItems
    .filter((item) => (mode === 'value' ? item.rawVal > 0 : item.productCount > 0))
    .map((item, index) => {
      const color = CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length];
      const isFocused = Boolean(selectedCategoryId && selectedCategoryId === item.categoryId);

      return {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        value: item.value,
        color,
        focused: isFocused,
        productCount: item.productCount,
        totalCost: item.totalCost,
        percentage: item.percentage,
        text: `${item.percentage}%`,
      };
    });

  return {
    chartData,
    totalValue: grandTotalValue,
    totalCount: grandTotalCount,
  };
}

