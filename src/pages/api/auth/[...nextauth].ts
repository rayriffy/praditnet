import NextAuth from 'next-auth'

import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"

import { Sequelize } from "sequelize"
import 'mariadb'
import SequelizeAdapter from "@next-auth/sequelize-adapter"

const {
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env

const sequelize = new Sequelize(`mariadb://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/praditnet`)

export default NextAuth({
  adapter: SequelizeAdapter(sequelize),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  ],
})
