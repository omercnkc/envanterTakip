import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { PermissionPromptConfig } from '../utils/permissionHelper';
import { getStyles } from './PermissionModal.styles';

interface PermissionModalProps {
  config: PermissionPromptConfig | null;
  onAllow: () => void;
  onDismiss: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  config,
  onAllow,
  onDismiss,
}) => {
  const { colors } = useTheme();
  const { language } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  if (!config) return null;

  const renderIcon = () => {
    switch (config.type) {
      case 'camera':
        return <Camera size={34} color={colors.primary} />;
      case 'media_library':
        return <ImageIcon size={34} color={colors.tertiary} />;
      case 'notifications':
        return <Bell size={34} color={colors.primary} />;
      default:
        return <ShieldCheck size={34} color={colors.primary} />;
    }
  };

  return (
    <Modal
      visible={!!config}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCard}>
          {/* İkon Rozeti */}
          <View style={styles.iconOuterCircle}>{renderIcon()}</View>

          {/* Başlık ve Açıklama */}
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.description}>{config.description}</Text>

          {/* Faydalar Kutusu */}
          <View style={styles.featuresContainer}>
            {config.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={styles.featureIconBadge}>
                  <CheckCircle2 size={15} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Gizlilik Güvencesi */}
          <View style={styles.privacyRow}>
            <Lock size={13} color={colors.outline} />
            <Text style={styles.privacyText}>
              {language === 'tr'
                ? 'Verileriniz uçtan uca şifrelidir ve gizliliğinize saygı duyulur.'
                : 'Your data is end-to-end encrypted and your privacy is respected.'}
            </Text>
          </View>

          {/* Butonlar */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.allowButton}
              onPress={onAllow}
              activeOpacity={0.8}
            >
              <Text style={styles.allowButtonText}>{config.primaryButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.dismissButtonText}>
                {config.secondaryButtonText || (language === 'tr' ? 'Şimdi Değil' : 'Not Now')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
