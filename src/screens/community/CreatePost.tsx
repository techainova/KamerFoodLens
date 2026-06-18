import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const AUDIENCES = ['Public', 'Abonnés', 'Amis'];
const POST_TYPES = ['Post', 'Recette', 'Question'];

const SUGGESTED_TAGS = ['#Mbongo', '#Ndolé', '#PouletDG', '#Kpwem', '#Achu', '#Cameroun', '#Recette'];

export default function CreatePost() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [postType, setPostType] = useState('Post');
  const [audience, setAudience] = useState('Public');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const canPublish = text.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="X" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>Nouveau post</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: canPublish ? '#E8591A' : '#E5E0D8' }}
          disabled={!canPublish}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Publier</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Type selector */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {POST_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setPostType(type)}
                  style={{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: type === postType ? '#E8591A' + '15' : '#F5F0EB', borderWidth: 1.5, borderColor: type === postType ? '#E8591A' : '#E5E0D8' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: type === postType ? '#E8591A' : '#6D4C41' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Author row */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#E8591A20', borderWidth: 1.5, borderColor: '#E8591A40', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>M</Text>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Moi</Text>

              {/* Audience */}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                {AUDIENCES.map(aud => (
                  <TouchableOpacity
                    key={aud}
                    onPress={() => setAudience(aud)}
                    style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: aud === audience ? '#2C1810' : '#F5F0EB', borderWidth: 1, borderColor: aud === audience ? '#2C1810' : '#E5E0D8' }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: aud === audience ? '#fff' : '#6D4C41' }}>{aud}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Text input */}
          <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderColor: C.border }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={postType === 'Recette' ? 'Partagez votre recette — ingrédients, étapes, astuces...' : postType === 'Question' ? 'Posez votre question à la communauté...' : 'Quoi de neuf en cuisine ?'}
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 15, color: C.ink, lineHeight: 24, minHeight: 140, textAlignVertical: 'top' }}
            />
            <Text style={{ fontSize: 11, color: text.length > 400 ? '#C62828' : '#8C8278', textAlign: 'right', marginTop: 6 }}>{text.length}/500</Text>
          </View>

          {/* Media grid */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10 }}>Photos / Vidéo</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[0, 1, 2].map(i => (
                <TouchableOpacity key={i} style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  {i === 0 ? <Icon name="Plus" size={22} color="#8C8278" /> : <Icon name="Camera" size={18} color="rgba(140,130,120,0.4)" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10 }}>Mots-clés</Text>

            {tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {tags.map(tag => (
                  <TouchableOpacity key={tag} onPress={() => removeTag(tag)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#E8591A15', borderWidth: 1, borderColor: '#E8591A40' }}>
                    <Text style={{ fontSize: 12, color: '#E8591A', fontWeight: '600' }}>{tag}</Text>
                    <Icon name="X" size={11} color="#E8591A" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 8 }}>Suggestions :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(tag => (
                <TouchableOpacity key={tag} onPress={() => addTag(tag)} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Location */}
          <TouchableOpacity style={{ backgroundColor: C.surface, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="MapPin" size={16} color="#E8591A" />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.inkSoft }}>Ajouter un lieu</Text>
            <Icon name="ChevronRight" size={16} color="#8C8278" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
