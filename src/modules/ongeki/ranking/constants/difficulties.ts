import { Difficulty } from '../@types/Difficulty'

export const difficulties: Difficulty[] = [
  {
    id: 0,
    key: 'basic',
    name: 'Basic',
    color: {
      primary: 'bg-emerald-500',
      secondary: 'bg-emerald-200',
      border: 'border-emerald-500',
      ring: 'hover:ring-emerald-500',
    },
  },
  {
    id: 1,
    key: 'advanced',
    name: 'Advanced',
    color: {
      primary: 'bg-orange-500',
      secondary: 'bg-orange-200',
      border: 'border-orange-500',
      ring: 'hover:ring-orange-500',
    },
  },
  {
    id: 2,
    key: 'expert',
    name: 'Expert',
    color: {
      primary: 'bg-red-500',
      secondary: 'bg-red-200',
      border: 'border-red-500',
      ring: 'hover:ring-red-500',
    },
  },
  {
    id: 3,
    key: 'master',
    name: 'Master',
    color: {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-200',
      border: 'border-purple-500',
      ring: 'hover:ring-purple-500',
    },
  },
  // {
  //   id: 4,
  //   name: 'ULTIMA',
  // },
  // {
  //   id: 5,
  //   name: "World's End",
  // },
]
