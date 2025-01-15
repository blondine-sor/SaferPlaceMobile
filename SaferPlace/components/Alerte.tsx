import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react-native';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  style?: ViewStyle;
  duration?: number; // Duration in milliseconds
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  style,
  duration = 3000, // Default 3 seconds
  onDismiss,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Start fade out animation slightly before the timer ends
    const fadeOutDelay = duration - 300;
    const fadeTimeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        onDismiss?.();
      });
    }, fadeOutDelay);

    // Cleanup
    return () => {
      clearTimeout(fadeTimeout);
    };
  }, [duration, onDismiss]);

  const getVariantStyles = (): {
    container: ViewStyle;
    icon: { color: string };
    title: TextStyle;
    progressBar: { backgroundColor: string };
  } => {
    switch (variant) {
      case 'success':
        return {
          container: { backgroundColor: '#dcfce7' },
          icon: { color: '#16a34a' },
          title: { color: '#16a34a' },
          progressBar: { backgroundColor: '#16a34a' },
        };
      case 'warning':
        return {
          container: { backgroundColor: '#fef9c3' },
          icon: { color: '#ca8a04' },
          title: { color: '#ca8a04' },
          progressBar: { backgroundColor: '#ca8a04' },
        };
      case 'error':
        return {
          container: { backgroundColor: '#fee2e2' },
          icon: { color: '#dc2626' },
          title: { color: '#dc2626' },
          progressBar: { backgroundColor: '#dc2626' },
        };
      default:
        return {
          container: { backgroundColor: '#e0f2fe' },
          icon: { color: '#0284c7' },
          title: { color: '#0284c7' },
          progressBar: { backgroundColor: '#0284c7' },
        };
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={24} color={getVariantStyles().icon.color} />;
      case 'warning':
        return <AlertCircle size={24} color={getVariantStyles().icon.color} />;
      case 'error':
        return <XCircle size={24} color={getVariantStyles().icon.color} />;
      default:
        return <Info size={24} color={getVariantStyles().icon.color} />;
    }
  };

  const variantStyles = getVariantStyles();

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <Animated.View style={[styles.container, variantStyles.container, style, { opacity: fadeAnim }]}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, variantStyles.title]}>{title}</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
      <Animated.View
        style={[
          styles.progressBar,
          variantStyles.progressBar,
          { width: progressWidth },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden', // For progress bar
    position: 'relative', // For progress bar
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#374151',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
  },
});

export default Alert;