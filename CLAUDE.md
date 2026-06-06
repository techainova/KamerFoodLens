# CLAUDE.md — KmerFoodLens (KFL)

## Projet
Application mobile React Native + Expo — reconnaissance de plats camerounais par IA.
83 écrans · 3 rôles (Standard / Pro / Admin) · Android & iOS · Bilingue FR/EN.
Design de référence : https://api.anthropic.com/v1/design/h/DQC25pZ6yJhP9aok0UA4oA?open_file=KmerFoodLens+-+Wireframes.html

## Stack technique obligatoire
- React Native 0.85 + Expo SDK 56 + TypeScript STRICT (zéro `any`)
- React Navigation v7 — Stack + BottomTab + Drawer
- Zustand v5 (état global) + TanStack Query v5 (cache API)
- NativeWind v4 (styles) — JAMAIS de StyleSheet avec valeurs brutes
- react-native-quick-crypto — AES-256-GCM pour TOUT échange sensible
- Apollo Client v3 — GraphQL UNIQUEMENT pour Dashboard Pro et Admin
- i18next v23 — TOUT texte visible passe par useTranslation()
- MMKV v2 — JAMAIS AsyncStorage

## Design System KFL — NE JAMAIS DÉVIER
Fichier source unique : src/constants/theme.ts

### Couleurs
- primary   : #E8591A  (Orange KFL — boutons CTA, accents)
- success   : #2E7D32  (Vert — confirmations, succès)
- error     : #C62828  (Rouge — erreurs, alertes)
- gold      : #F9A825  (Or — Pro, badges, récompenses)
- navy      : #1A237E  (Indigo — Admin, autorité)
- ink       : #2C1810  (Texte principal)
- inkSoft   : #6D4C41  (Texte secondaire)
- inkMute   : #8C8278  (Texte désactivé/placeholder)
- cream     : #FFFAF5  (Fond principal)
- surface   : #FFFFFF  (Cartes, modals)
- surface2  : #F5F0EB  (Fond secondaire)
- border    : #E5E0D8  (Bordures)
- success_soft : #E3F0E4
- error_soft   : #FBDCDC
- gold_soft    : #FBF3DC
- navy_soft    : #E8EAF6

### Espacements — spacing.*
xs=4  sm=8  md=16  lg=24  xl=32  xxl=48

### Border radius — radius.*
sm=8  md=12  lg=16  xl=24  full=9999

### Typographie
- Titres : Playfair Display Bold   → fontFamily: 'PlayfairDisplay-Bold'
- Corps  : Inter (400/500/600/700) → fontFamily: 'Inter-Regular' etc.
- Mono   : JetBrains Mono          → fontFamily: 'JetBrainsMono-Regular'

### Ombres — shadow.*
sm : { shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.08, shadowRadius:3, elevation:2 }
md : { shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.10, shadowRadius:6, elevation:4 }
lg : { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.14, shadowRadius:12, elevation:8 }

## Structure des dossiers — respecter strictement