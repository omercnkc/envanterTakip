import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface WarrantyWidgetData {
  language?: 'tr' | 'en';
  nearestProduct?: {
    id: string;
    name: string;
    brandModel?: string;
    daysRemaining: number;
    endDate: string;
    status: 'expired' | 'expiring_soon' | 'active';
  } | null;
  activeCount: number;
  totalCount: number;
}

export const WarrantyWidget: React.FC<WarrantyWidgetData> = ({
  nearestProduct,
  activeCount = 0,
  totalCount = 0,
  language = 'tr',
}) => {
  const isEn = language === 'en';
  const isExpiring = nearestProduct?.status === 'expiring_soon';
  const isExpired = nearestProduct?.status === 'expired';

  // Durum rengi
  const badgeBg = isExpired
    ? '#fee2e2'
    : isExpiring
    ? '#ffedd5'
    : '#dcfce7';

  const badgeTextColor = isExpired
    ? '#b91c1c'
    : isExpiring
    ? '#c2410c'
    : '#15803d';

  const daysText =
    nearestProduct?.daysRemaining === 0
      ? (isEn ? 'Ends Today' : 'Bugün Son Gün')
      : nearestProduct?.daysRemaining === 1
      ? (isEn ? 'Ends Tomorrow' : 'Yarın Bitiyor')
      : nearestProduct?.daysRemaining && nearestProduct.daysRemaining > 0
      ? (isEn ? `${nearestProduct.daysRemaining} Days Left` : `${nearestProduct.daysRemaining} Gün Kaldı`)
      : (isEn ? 'Expired' : 'Süresi Doldu');

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_URI"
      clickActionData={{
        uri: nearestProduct?.id
          ? `envantertakip://product/${nearestProduct.id}`
          : 'envantertakip://home',
      }}
    >
      {/* Üst Başlık & Rozet */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget
            text={isEn ? "🛡️ Safe Inventory" : "🛡️ Envanter Takip"}
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#4648d4',
            }}
          />
          <TextWidget
            text={`${activeCount} ${isEn ? 'active warranties' : 'aktif garanti'}`}
            style={{
              fontSize: 10,
              color: '#64748b',
              marginTop: 1,
            }}
          />
        </FlexWidget>

        {/* Durum Rozeti */}
        <FlexWidget
          style={{
            backgroundColor: badgeBg,
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <TextWidget
            text={
              isExpiring
                ? (isEn ? '⚠️ Expiring' : '⚠️ Yaklaşıyor')
                : isExpired
                ? (isEn ? '❌ Expired' : '❌ Bitti')
                : (isEn ? '✅ Safe' : '✅ Güvende')
            }
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: badgeTextColor,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Orta Bölüm: En Yakın Ürün veya Güvende Mesajı */}
      {nearestProduct ? (
        <FlexWidget
          style={{
            flexDirection: 'column',
            marginVertical: 4,
          }}
        >
          <TextWidget
            text={nearestProduct.name}
            style={{
              fontSize: 15,
              fontWeight: '800',
              color: '#0f172a',
            }}
          />
          {nearestProduct.brandModel ? (
            <TextWidget
              text={nearestProduct.brandModel}
              style={{
                fontSize: 11,
                color: '#64748b',
                marginTop: 2,
              }}
            />
          ) : null}
        </FlexWidget>
      ) : (
        <FlexWidget
          style={{
            flexDirection: 'column',
            marginVertical: 4,
          }}
        >
          <TextWidget
            text={isEn ? "Warranties Safe" : "Garantiler Güvende"}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#15803d',
            }}
          />
          <TextWidget
            text={isEn ? "No products expiring this month" : "Bu ay süresi biten ürün yok"}
            style={{
              fontSize: 11,
              color: '#64748b',
              marginTop: 2,
            }}
          />
        </FlexWidget>
      )}

      {/* Alt Bölüm: Kalan Gün ve Bitiş Tarihi */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: 10,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <TextWidget
          text={nearestProduct ? daysText : `${totalCount} ${isEn ? 'items saved' : 'kayıtlı eşya'}`}
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: nearestProduct ? badgeTextColor : '#4648d4',
          }}
        />
        <TextWidget
          text={nearestProduct?.endDate ? `${isEn ? 'Ends: ' : 'Son: '}${nearestProduct.endDate}` : (isEn ? 'Details →' : 'Detaylar →')}
          style={{
            fontSize: 10,
            color: '#64748b',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
