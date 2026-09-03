import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Linking,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

const SUPPORT_EMAIL = 'support@kmerfoodlens.com';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  titleKey: string;
  icon: 'Camera' | 'MapPin' | 'ShoppingBag' | 'Star' | 'Shield';
  items: FaqItem[];
}

const SECTIONS: FaqSection[] = [
  {
    titleKey: 'faq.sectionScan',
    icon: 'Camera',
    items: [
      {
        question: 'Comment fonctionne le scan de plats ?',
        answer: 'Prenez une photo du plat (ou choisissez-en une dans votre galerie), et l\'app identifie automatiquement le plat, ses ingrédients et sa recette. Vous pouvez aussi décrire le plat à l\'oral ou par écrit si vous préférez.',
      },
      {
        question: 'Le plat scanné n\'est pas reconnu, que faire ?',
        answer: 'Si la confiance de reconnaissance est trop faible, l\'app l\'indique clairement au lieu de deviner. Essayez une photo mieux éclairée, ou décrivez le plat par texte ou audio depuis l\'écran de scan.',
      },
      {
        question: 'Mes scans sont-ils sauvegardés ?',
        answer: 'Oui, votre historique de scans est disponible dans votre journal alimentaire, accessible depuis votre profil.',
      },
    ],
  },
  {
    titleKey: 'faq.sectionRestaurants',
    icon: 'MapPin',
    items: [
      {
        question: 'Comment trouver des restaurants autour de moi ?',
        answer: 'Depuis l\'onglet Carte, l\'app affiche les restaurants proches de votre position, avec filtres par type de cuisine et distance.',
      },
      {
        question: 'Comment passer une commande ?',
        answer: 'Ouvrez la fiche d\'un restaurant, sélectionnez des plats dans son menu, ajoutez-les au panier, puis validez votre commande et votre paiement.',
      },
    ],
  },
  {
    titleKey: 'faq.sectionAccount',
    icon: 'Shield',
    items: [
      {
        question: 'Comment devenir compte Pro ?',
        answer: 'Depuis votre profil ou les paramètres, choisissez "Devenir Pro" et remplissez le formulaire de votre établissement. Votre demande est ensuite examinée par l\'équipe KmerFoodLens avant activation.',
      },
      {
        question: 'Comment changer mon mot de passe ou mon adresse email ?',
        answer: 'Le mot de passe se change depuis Paramètres > Changer le mot de passe. Le changement d\'adresse email n\'est pas encore disponible directement dans l\'app.',
      },
      {
        question: 'Comment supprimer mon compte ?',
        answer: 'Depuis Profil > Modifier le profil, l\'option "Supprimer le compte" est disponible en bas de l\'écran.',
      },
    ],
  },
  {
    titleKey: 'faq.sectionCommunity',
    icon: 'Star',
    items: [
      {
        question: 'Comment gagner des points XP ?',
        answer: 'Vous gagnez des points XP en scannant des plats, en répondant aux quiz, en passant des commandes et en laissant des avis sur les restaurants.',
      },
      {
        question: 'Qu\'est-ce que la tombola ?',
        answer: 'La tombola est un jeu où vous pouvez acheter des tickets avec votre portefeuille pour tenter de gagner des lots, tirés au sort périodiquement.',
      },
    ],
  },
];

export default function FAQScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleContactSupport = () => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Support KmerFoodLens')}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('faq.title', 'Aide & FAQ')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section, si) => (
          <View key={si}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name={section.icon} size={16} color="#E8591A" />
              <Text style={{ fontSize: 14, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>
                {t(section.titleKey)}
              </Text>
            </View>
            <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                const isOpen = openIndex === key;
                return (
                  <View key={key} style={{ borderBottomWidth: ii < section.items.length - 1 ? 1 : 0, borderColor: C.border }}>
                    <TouchableOpacity
                      onPress={() => setOpenIndex(isOpen ? null : key)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: C.ink }}>{item.question}</Text>
                      <Icon name={isOpen ? 'ChevronDown' : 'ChevronRight'} size={16} color={C.inkMute} />
                    </TouchableOpacity>
                    {isOpen && (
                      <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 }}>
                        {item.answer}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleContactSupport}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 25, backgroundColor: '#E8591A' }}
          activeOpacity={0.85}
        >
          <Icon name="Mail" size={16} color="#fff" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('faq.contactSupport', 'Contacter le support')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
