import { registerRootComponent } from 'expo';

import App from './App';
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler';

// Android Ana Ekran Widget Görev Yöneticisini Güvenle Kaydet
try {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  if (typeof registerWidgetTaskHandler === 'function') {
    registerWidgetTaskHandler(widgetTaskHandler);
  }
} catch {
  // Expo Go içinde yerel modül olmadığında sessizce devam et
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

