import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddEditProductScreen({ route, navigation }) {
  const theme = useTheme();
  const { productId } = route.params || {};
  const { products, addProduct, editProduct } = useContext(AppContext);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const isEditMode = Boolean(productId);
  const productToEdit = products.find((p) => p.id === productId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      supplier: '',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '0',
      minStock: '5',
      brand: '',
      unit: 'pcs',
      location: '',
      description: '',
      image: '',
    },
  });

  useEffect(() => {
    if (isEditMode && productToEdit) {
      reset({
        name: productToEdit.name,
        sku: productToEdit.sku,
        category: productToEdit.category,
        supplier: productToEdit.supplier,
        purchasePrice: String(productToEdit.purchasePrice),
        sellingPrice: String(productToEdit.sellingPrice),
        quantity: String(productToEdit.quantity),
        minStock: String(productToEdit.minStock),
        brand: productToEdit.brand,
        unit: productToEdit.unit,
        location: productToEdit.location || '',
        description: productToEdit.description,
        image: productToEdit.image || '',
      });
      if (productToEdit.image && productToEdit.image.startsWith('http')) {
        setShowUrlInput(true);
      }
    }
  }, [isEditMode, productToEdit, reset]);

  const handleTakeLivePhoto = async (onChange) => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please allow camera permission in your phone settings to capture product photos.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const permanentUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        onChange(permanentUri);
      }
    } catch (err) {
      console.error('Camera error:', err);
      Alert.alert(
        'Camera Option',
        'Could not start camera directly. You can also pick a photo from your gallery.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Gallery', onPress: () => handlePickFromGallery(onChange) },
        ]
      );
    }
  };

  const handlePickFromGallery = async (onChange) => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Gallery Permission Required',
            'Please allow photo gallery permission in your phone settings to select product photos.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const permanentUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        onChange(permanentUri);
      }
    } catch (err) {
      console.error('Gallery error:', err);
      Alert.alert('Gallery Error', 'Unable to select image from gallery. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    const imgUrl =
      (data.image && data.image.trim()) ||
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=60';

    const formattedData = {
      ...data,
      purchasePrice: Number(data.purchasePrice),
      sellingPrice: Number(data.sellingPrice),
      quantity: Number(data.quantity),
      minStock: Number(data.minStock),
      image: imgUrl,
    };

    if (isEditMode) {
      const res = await editProduct(productId, formattedData);
      if (res?.success !== false) {
        Alert.alert('Success', 'Product updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', res?.message || 'Failed to update product.');
      }
    } else {
      const res = await addProduct(formattedData);
      if (res?.success !== false) {
        Alert.alert('Success', 'Product added successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', res?.message || 'Failed to add product.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </Text>

        <View style={styles.form}>
          {/* Product Image Section */}
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.imageSectionCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outline + '40',
                  },
                ]}
              >
                <Text style={[styles.imageSectionTitle, { color: theme.colors.onSurface }]}>
                  Product Image
                </Text>

                {value ? (
                  <View style={styles.previewContainer}>
                    <View
                      style={[
                        styles.imagePreviewWrapper,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.outline,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: value }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                      <View style={styles.imageTag}>
                        <MaterialCommunityIcons name="check-circle" size={14} color="#ffffff" />
                        <Text style={styles.imageTagText}>Photo Selected</Text>
                      </View>
                    </View>

                    <View style={styles.photoActionsRow}>
                      <Button
                        mode="outlined"
                        icon="camera"
                        onPress={() => handleTakeLivePhoto(onChange)}
                        style={styles.photoActionBtn}
                        contentStyle={styles.photoBtnContent}
                        labelStyle={styles.photoBtnLabel}
                      >
                        Retake Photo
                      </Button>
                      <Button
                        mode="outlined"
                        icon="image"
                        onPress={() => handlePickFromGallery(onChange)}
                        style={styles.photoActionBtn}
                        contentStyle={styles.photoBtnContent}
                        labelStyle={styles.photoBtnLabel}
                      >
                        Change Photo
                      </Button>
                      <Button
                        mode="text"
                        icon="trash-can-outline"
                        textColor={theme.colors.error}
                        onPress={() => onChange('')}
                        style={styles.removeBtn}
                        contentStyle={styles.photoBtnContent}
                        labelStyle={styles.photoBtnLabel}
                      >
                        Remove
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.emptyUploadBox,
                      {
                        backgroundColor: theme.colors.surfaceVariant + '40',
                        borderColor: theme.colors.outline,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="camera-plus"
                        size={28}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={[styles.uploadPrompt, { color: theme.colors.onSurface }]}>
                      Add a photo for this product
                    </Text>
                    <Text style={[styles.uploadSubtext, { color: theme.colors.onSurfaceVariant }]}>
                      Capture with camera or choose from gallery
                    </Text>

                    <View style={styles.uploadOptionsContainer}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.optionCard, { backgroundColor: theme.colors.primary }]}
                        onPress={() => handleTakeLivePhoto(onChange)}
                      >
                        <MaterialCommunityIcons name="camera" size={20} color="#ffffff" />
                        <Text style={styles.optionPrimaryText}>Take Live Photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.optionCard,
                          {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                            borderWidth: 1,
                          },
                        ]}
                        onPress={() => handlePickFromGallery(onChange)}
                      >
                        <MaterialCommunityIcons
                          name="image-multiple"
                          size={20}
                          color={theme.colors.primary}
                        />
                        <Text style={[styles.optionSecondaryText, { color: theme.colors.onSurface }]}>
                          Upload from Gallery
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.urlToggle}
                  onPress={() => setShowUrlInput(!showUrlInput)}
                >
                  <MaterialCommunityIcons
                    name={showUrlInput ? 'chevron-up' : 'link-variant'}
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.urlToggleText, { color: theme.colors.primary }]}>
                    {showUrlInput ? 'Hide URL Input' : 'Or enter image URL manually'}
                  </Text>
                </TouchableOpacity>

                {showUrlInput && (
                  <CustomInput
                    label="Image URL"
                    value={value}
                    onChangeText={onChange}
                    leftIcon="link"
                    placeholder="https://example.com/image.jpg"
                    style={{ marginTop: 6 }}
                  />
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Product Name *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="cube-outline"
                error={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{ required: 'SKU is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="SKU / Barcode Code *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="barcode"
                error={errors.sku?.message}
                disabled={isEditMode}
              />
            )}
            name="sku"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Category *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="tag-outline"
                    placeholder="e.g. Electronics"
                    error={errors.category?.message}
                  />
                )}
                name="category"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'Brand name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Brand Name *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="alpha-b-box-outline"
                    placeholder="e.g. Sony"
                    error={errors.brand?.message}
                  />
                )}
                name="brand"
              />
            </View>
          </View>

          <Controller
            control={control}
            rules={{ required: 'Supplier is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Supplier *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="truck-outline"
                placeholder="e.g. Global Tech Dist"
                error={errors.supplier?.message}
              />
            )}
            name="supplier"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Purchase Price required',
                  pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Purchase Price *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="currency-usd"
                    error={errors.purchasePrice?.message}
                  />
                )}
                name="purchasePrice"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Selling Price required',
                  pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Selling Price *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="currency-usd"
                    error={errors.sellingPrice?.message}
                  />
                )}
                name="sellingPrice"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Quantity required',
                  pattern: { value: /^\d+$/, message: 'Must be integer' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Current Qty *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="numeric"
                    error={errors.quantity?.message}
                  />
                )}
                name="quantity"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Min stock required',
                  pattern: { value: /^\d+$/, message: 'Must be integer' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Min Stock Warning *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="alert-box-outline"
                    error={errors.minStock?.message}
                  />
                )}
                name="minStock"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Unit Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. pcs, box, kg"
                  />
                )}
                name="unit"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Storage Location"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="map-marker-outline"
                    placeholder="e.g. Shelf A1"
                  />
                )}
                name="location"
              />
            </View>
          </View>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Product Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                placeholder="Write item details here..."
              />
            )}
            name="description"
          />

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.btn}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Product
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollBody: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  imageSectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  imageSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyUploadBox: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadPrompt: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 12,
    marginBottom: 14,
    textAlign: 'center',
  },
  uploadOptionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  optionPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewContainer: {
    width: '100%',
  },
  imagePreviewWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageTagText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  photoActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  photoActionBtn: {
    flex: 1,
    borderRadius: 8,
  },
  removeBtn: {
    borderRadius: 8,
  },
  photoBtnContent: {
    height: 36,
  },
  photoBtnLabel: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  urlToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 4,
    gap: 4,
  },
  urlToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  flexItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  btn: {
    flex: 1,
    marginHorizontal: 6,
  },
});
