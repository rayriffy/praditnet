export interface CollectionType {
  id: string
  group: number
  name: string
  assetPath?: string
  category?: number
  aquaKeys: string[]
  image: {
    width: number
    height: number
  }
}

export const collectionTypes: CollectionType[] = [
  {
    id: 'character',
    group: 1,
    name: 'Character',
    assetPath: 'character/icon',
    // itemKind: 2,
    aquaKeys: ['character_id', 'chara_illust_id'],
    image: {
      width: 96,
      height: 96,
    },
  },
  {
    id: 'nameplate',
    group: 1,
    name: 'Nameplate',
    // itemKind: 4,
    aquaKeys: ['nameplate_id'],
    image: {
      width: 576,
      height: 228,
    },
  },
  {
    id: 'systemVoice',
    group: 1,
    name: 'System Voice',
    assetPath: 'systemVoice/icon',
    // itemKind: 4,
    aquaKeys: ['voice_id'],
    image: {
      width: 200,
      height: 128,
    },
  },
  {
    id: 'avatarBack',
    group: 2,
    name: 'Back',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_back'],
    category: 7,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarFace',
    group: 2,
    name: 'Face',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_face'],
    category: 3,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarHead',
    group: 2,
    name: 'Head',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_head'],
    category: 2,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarItem',
    group: 2,
    name: 'Item',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_item'],
    category: 5,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarSkin',
    group: 2,
    name: 'Skin',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_skin'],
    category: 4,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarWear',
    group: 2,
    name: 'Wear',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_wear'],
    category: 1,
    image: {
      width: 150,
      height: 150,
    },
  },
  {
    id: 'avatarFront',
    group: 2,
    name: 'Front',
    assetPath: 'avatarAccessory',
    // itemKind: 4,
    aquaKeys: ['avatar_front'],
    category: 6,
    image: {
      width: 150,
      height: 150,
    },
  },
]
