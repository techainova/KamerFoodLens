import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Switch,
  Image,
} from 'react-native';
import { Alert } from '@/utils/alert';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { restaurantsService, WEEKDAYS, type MenuItem, type Weekday } from '@/services/restaurants.service';

const DAY_LABELS: Record<Weekday, string> = {
  monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer', thursday: 'Jeu', friday: 'Ven', saturday: 'Sam', sunday: 'Dim',
};

export default function RestaurantMenuEdit() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const C = useColors();
  const { t } = useTranslation();
  const { restaurantId, itemId } = route.params as { restaurantId: string; itemId?: string };
  const isEditing = !!itemId;

  const { data: items, isLoading: loadingMenu } = useQuery<MenuItem[]>({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: () => restaurantsService.getMenu(restaurantId),
    staleTime: 60_000,
  });

  const existing = isEditing ? items?.find(i => i.id === itemId) : undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableDays, setAvailableDays] = useState<Weekday[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description ?? '');
      setPrice(String(existing.priceXAF));
      setCategory(existing.category);
      setImageUrl(existing.imageUrl ?? '');
      setIsAvailable(existing.isAvailable);
      setAvailableDays(existing.availableDays ?? []);
    }
  }, [existing]);

  const uploadImageFromAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) return;
    setUploadingImage(true);
    try {
      const { url } = await restaurantsService.uploadMenuItemImage(restaurantId, asset.base64, asset.mimeType ?? 'image/jpeg');
      setImageUrl(url);
    } catch {
      Alert.alert(t('common.error'), t('restaurantMenu.imageUploadError'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePickFromLibrary = async () => {
    if (uploadingImage) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('restaurantMenu.photoPermissionTitle'), t('restaurantMenu.photoPermissionMsg'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    await uploadImageFromAsset(result.assets[0]);
  };

  const handlePickFromCamera = async () => {
    if (uploadingImage) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('restaurantMenu.photoPermissionTitle'), t('restaurantMenu.photoPermissionMsg'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true, allowsEditing: true, aspect: [4, 3] });
    if (result.canceled || !result.assets?.[0]) return;
    await uploadImageFromAsset(result.assets[0]);
  };

  const isEveryDay = availableDays.length === 0;
  const toggleDay = (day: Weekday) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const canSave = name.trim().length > 0 && parseInt(price, 10) > 0;

  const handleSave = async () => {
    const priceXAF = parseInt(price, 10);
    if (!name.trim() || !priceXAF || priceXAF <= 0) return;

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        priceXAF,
        category: category.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isAvailable,
        availableDays,
      };
      if (isEditing && itemId) {
        await restaurantsService.updateMenuItem(restaurantId, itemId, payload);
      } else {
        await restaurantsService.createMenuItem(restaurantId, payload);
      }
      await queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
      navigation.goBack();
    } catch {
      Alert.alert(t('common.error'), t('restaurantMenu.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!itemId) return;
    Alert.alert(t('restaurantMenu.deleteDish'), t('restaurantMenu.deleteConfirmMsg', { name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            await restaurantsService.deleteMenuItem(restaurantId, itemId);
            await queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
            navigation.goBack();
          } catch {
            Alert.alert(t('common.error'), t('restaurantMenu.deleteError'));
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (isEditing && loadingMenu) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeAreaView>
    );
  }

  const fields = [
    { l: t('restaurantMenu.dishName'), v: name, s: setName, p: t('restaurantMenu.dishNamePlaceholder') },
    { l: t('restaurantMenu.dishCategory'), v: category, s: setCategory, p: t('restaurantMenu.dishCategoryPlaceholder') },
    { l: t('restaurantMenu.dishPriceXaf'), v: price, s: setPrice, p: '4500', keyboard: 'numeric' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>
          {isEditing ? t('restaurantMenu.editDish') : t('restaurantMenu.addDish')}
        </Text>
        <TouchableOpacity
          onPress={() => void handleSave()}
          disabled={!canSave || saving}
          style={{ height: 32, paddingHorizontal: 14, backgroundColor: canSave ? C.gold : C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
        >
          {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: canSave ? '#fff' : C.inkMute, fontSize: 13, fontWeight: '600' }}>{t('common.save')}</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Photo du plat */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
            {t('restaurantMenu.dishPhoto')}
          </Text>
          <View style={{ height: 160, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 }}>
            {uploadingImage ? (
              <ActivityIndicator color={C.primary} size="large" />
            ) : imageUrl ? (
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Icon name="Image" size={32} color={C.inkMute} />
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => void handlePickFromLibrary()}
              disabled={uploadingImage}
              style={{ flex: 1, height: 42, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Icon name="Image" size={16} color={C.inkSoft} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{t('restaurantMenu.pickFromGallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => void handlePickFromCamera()}
              disabled={uploadingImage}
              style={{ flex: 1, height: 42, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Icon name="Camera" size={16} color={C.inkSoft} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{t('restaurantMenu.takePhoto')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fields */}
        {fields.map((f, i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{f.l}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
              <TextInput
                value={f.v} onChangeText={f.s} placeholder={f.p} placeholderTextColor={C.inkMute}
                style={{ fontSize: 14, color: C.ink }} keyboardType={f.keyboard}
              />
            </View>
          </View>
        ))}

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('restaurantMenu.dishDescription')}</Text>
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 12, minHeight: 90 }}>
            <TextInput
              value={description} onChangeText={setDescription} multiline numberOfLines={3}
              placeholder={t('restaurantMenu.dishDescriptionPlaceholder')} placeholderTextColor={C.inkMute}
              style={{ fontSize: 14, color: C.ink }}
            />
          </View>
        </View>

        {/* Availability */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: 14, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{t('restaurantMenu.available')}</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: C.border, true: C.success }} thumbColor="#fff" />
        </View>

        {/* Jours de disponibilité — un plat peut être proposé un seul jour
            (ex. "plat du vendredi") ou plusieurs (ex. menu du week-end). */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
            {t('restaurantMenu.availableDaysLabel', 'Jours au menu')}
          </Text>
          <TouchableOpacity
            onPress={() => setAvailableDays([])}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 13, borderRadius: 14, backgroundColor: isEveryDay ? C.primarySoft : C.surface, borderWidth: 1.4, borderColor: isEveryDay ? C.primary : C.border, marginBottom: 10 }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: isEveryDay ? C.primary : C.ink }}>
              {t('restaurantMenu.everyDay', 'Tous les jours')}
            </Text>
            {isEveryDay && <Icon name="Check" size={16} color={C.primary} />}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {WEEKDAYS.map((day) => {
              const selected = availableDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, backgroundColor: selected ? C.ink : C.surface, borderWidth: 1, borderColor: selected ? C.ink : C.border }}
                >
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: selected ? C.cream : C.inkSoft }}>{DAY_LABELS[day]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 8 }}>
            {isEveryDay
              ? t('restaurantMenu.everyDayHint', 'Ce plat est proposé chaque jour de la semaine.')
              : t('restaurantMenu.someDaysHint', 'Ce plat n\'apparaîtra que les jours sélectionnés.')}
          </Text>
        </View>

        {isEditing && (
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleting}
            style={{ height: 44, borderWidth: 1, borderColor: C.error, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          >
            {deleting ? <ActivityIndicator color={C.error} size="small" /> : <Text style={{ fontSize: 14, color: C.error }}>{t('restaurantMenu.deleteDish')}</Text>}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
