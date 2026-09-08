import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export function UserAvatar({
  imageUri,
  name = '',
  size = 64,
  style,
  textStyle,
  placeholderBg,
  textColor,
  showCameraBadge = false,
  badgeIcon = 'camera-plus',
  onPress,
  onPressBadge,
}) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUri]);

  const initials = name && name.trim() ? name.trim().charAt(0).toUpperCase() : '?';
  const radius = size / 2;
  const badgeSize = Math.max(22, Math.round(size * 0.36));
  const iconSize = Math.max(12, Math.round(badgeSize * 0.58));

  const validUri = typeof imageUri === 'string' && imageUri.trim().length > 0;
  const shouldRenderImage = validUri && !hasError;

  const content = (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }, style]}>
      {shouldRenderImage ? (
        <Image
          source={{ uri: imageUri.trim() }}
          style={{ width: size, height: size, borderRadius: radius }}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: placeholderBg || theme.colors.primaryContainer,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: Math.round(size * 0.38),
                color: textColor || theme.colors.primary,
              },
              textStyle,
            ]}
          >
            {initials}
          </Text>
        </View>
      )}

      {showCameraBadge && (
        <Pressable
          onPress={onPressBadge || onPress}
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.surface || '#ffffff',
            },
          ]}
        >
          <MaterialCommunityIcons name={badgeIcon} size={iconSize} color="#ffffff" />
        </Pressable>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
