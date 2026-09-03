import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

interface LegalSection {
  title: string;
  body: string;
}

const TERMS_SECTIONS: LegalSection[] = [
  { title: '1. Objet', body: 'Les présentes conditions générales d\'utilisation régissent l\'accès et l\'usage de l\'application KmerFoodLens (« l\'Application »), éditée par KmerFoodLens.' },
  { title: '2. Acceptation des conditions', body: 'En créant un compte ou en utilisant l\'Application, l\'utilisateur reconnaît avoir pris connaissance des présentes conditions et les accepter sans réserve.' },
  { title: '3. Compte utilisateur', body: 'L\'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée depuis son compte.' },
  { title: '4. Commandes et paiements', body: 'Les commandes passées via l\'Application auprès des restaurants partenaires sont soumises aux modalités de paiement en vigueur (mobile money, carte, espèces selon disponibilité).' },
  { title: '5. Comptes professionnels (Pro)', body: 'Les établissements souhaitant proposer leurs services via l\'Application doivent soumettre une demande, examinée et validée par l\'équipe KmerFoodLens avant activation.' },
  { title: '6. Propriété intellectuelle', body: 'L\'ensemble des contenus, marques et logos présents dans l\'Application sont la propriété de KmerFoodLens ou de leurs propriétaires respectifs.' },
  { title: '7. Responsabilité', body: 'KmerFoodLens s\'efforce d\'assurer l\'exactitude des informations affichées mais ne saurait être tenu responsable des erreurs de reconnaissance de plats ou d\'informations fournies par des tiers (restaurants partenaires).' },
  { title: '8. Modification des conditions', body: 'KmerFoodLens se réserve le droit de modifier les présentes conditions à tout moment ; les utilisateurs seront informés des changements significatifs.' },
];

const PRIVACY_SECTIONS: LegalSection[] = [
  { title: '1. Données collectées', body: 'KmerFoodLens collecte les données que vous fournissez (nom, email, téléphone, photo de profil) ainsi que les données d\'usage (scans, commandes, localisation approximative pour la recherche de restaurants).' },
  { title: '2. Utilisation des données', body: 'Vos données sont utilisées pour fournir le service (reconnaissance de plats, commandes, recommandations), améliorer l\'Application, et vous contacter si nécessaire.' },
  { title: '3. Partage des données', body: 'Vos données ne sont partagées avec des tiers que dans la mesure nécessaire au service (ex. restaurant partenaire pour une commande, prestataire de paiement).' },
  { title: '4. Conservation des données', body: 'Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de vos données à tout moment.' },
  { title: '5. Vos droits', body: 'Conformément à la réglementation applicable, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles.' },
  { title: '6. Sécurité', body: 'KmerFoodLens met en œuvre des mesures techniques (chiffrement, contrôle d\'accès) pour protéger vos données contre tout accès non autorisé.' },
  { title: '7. Contact', body: 'Pour toute question relative à vos données personnelles, contactez support@kmerfoodlens.com.' },
];

function LegalDocument({ sections }: { sections: LegalSection[] }) {
  const C = useColors();
  return (
    <View style={{ gap: 14 }}>
      {sections.map((section, i) => (
        <View key={i} style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 6 }}>{section.title}</Text>
          <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20 }}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

export default function TermsScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [tab, setTab] = React.useState<'terms' | 'privacy'>('terms');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('terms.title', 'CGU & Confidentialité')}</Text>
      </View>

      {/* Draft banner — this legal text is a generic placeholder, not reviewed by a lawyer. */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, backgroundColor: '#FBDCDC', borderBottomWidth: 1, borderColor: '#C62828' }}>
        <Icon name="AlertTriangle" size={16} color="#C62828" />
        <Text style={{ flex: 1, fontSize: 12, color: '#C62828', lineHeight: 18, fontWeight: '600' }}>
          {t('terms.draftBanner', 'BROUILLON — Texte générique fourni à titre indicatif. Doit être validé par un juriste avant toute publication réelle.')}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {(['terms', 'privacy'] as const).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTab(key)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: tab === key ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 13, fontWeight: tab === key ? '700' : '500', color: tab === key ? '#E8591A' : C.inkMute }}>
              {key === 'terms' ? t('terms.tabTerms', 'CGU') : t('terms.tabPrivacy', 'Confidentialité')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LegalDocument sections={tab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS} />
      </ScrollView>
    </SafeAreaView>
  );
}
