import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WarrantyWidget, WarrantyWidgetData } from './WarrantyWidget';

const WIDGET_STORAGE_KEY = '@app_widget_warranty_data';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction, renderWidget } = props;

  // Sadece tanımladığımız WarrantyWidget için işlem yap
  if (widgetInfo.widgetName === 'WarrantyWidget') {
    switch (widgetAction) {
      case 'WIDGET_ADDED':
      case 'WIDGET_UPDATE':
      case 'WIDGET_RESIZED': {
        let widgetData: WarrantyWidgetData = {
          nearestProduct: null,
          activeCount: 0,
          totalCount: 0,
        };

        try {
          const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
          if (raw) {
            widgetData = JSON.parse(raw);
          }
        } catch (e) {
          console.warn('[WidgetTaskHandler] Veri okunamadı:', e);
        }

        renderWidget(<WarrantyWidget {...widgetData} />);
        break;
      }
      default:
        break;
    }
  }
}
